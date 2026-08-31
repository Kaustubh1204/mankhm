'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cyclone, CycloneForecast, RiskRegion, CycloneAlert, SatelliteSensorType, UserSettings } from '@/types/cyclone';
import { cycloneApi } from '@/lib/api/cycloneApi';
import { forecastApi } from '@/lib/api/forecastApi';
import { riskApi } from '@/lib/api/riskApi';
import { alertApi } from '@/lib/api/alertApi';
import { userApi } from '@/lib/api/userApi';

export interface MapLayerState {
  observedTrack: boolean;
  forecastTrack: boolean;
  forecastCone: boolean;
  riskZones: boolean;
  windField: boolean;
  sstField: boolean;
  satelliteOverlay: boolean;
  coastalRisk: boolean;
  adminBoundaries: boolean;
}

interface DashboardContextType {
  // Cyclones
  cyclones: Cyclone[];
  selectedCycloneId: string;
  selectedCyclone: Cyclone | null;
  setSelectedCycloneId: (id: string) => void;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Forecast & Risk for currently selected cyclone
  currentForecast: CycloneForecast | null;
  currentRiskRegions: RiskRegion[];
  currentAlerts: CycloneAlert[];

  // Timeline State
  selectedHorizon: string;
  setSelectedHorizon: (horizon: string) => void;
  isPlayingTimeline: boolean;
  setIsPlayingTimeline: (play: boolean) => void;

  // GIS Map Layers
  layers: MapLayerState;
  toggleLayer: (key: keyof MapLayerState) => void;
  activeBaseMap: 'dark-vector' | 'satellite-tiles';
  setActiveBaseMap: (style: 'dark-vector' | 'satellite-tiles') => void;
  activeSatelliteType: SatelliteSensorType;
  setActiveSatelliteType: (type: SatelliteSensorType) => void;

  // Map Camera Control Target
  mapFlyTarget: { center: [number, number]; zoom: number } | null;
  flyToLocation: (coords: [number, number], zoom?: number) => void;

  // Global UI Modals & Navigation
  isChartsModalOpen: boolean;
  setIsChartsModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;

  // User Settings & Preferences
  userSettings: UserSettings | null;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

const defaultLayers: MapLayerState = {
  observedTrack: true,
  forecastTrack: true,
  forecastCone: true,
  riskZones: true,
  windField: true,
  sstField: false,
  satelliteOverlay: false,
  coastalRisk: true,
  adminBoundaries: true,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [selectedCycloneId, setSelectedCycloneId] = useState<string>('cyc_aruna');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentForecast, setCurrentForecast] = useState<CycloneForecast | null>(null);
  const [currentRiskRegions, setCurrentRiskRegions] = useState<RiskRegion[]>([]);
  const [currentAlerts, setCurrentAlerts] = useState<CycloneAlert[]>([]);

  const [selectedHorizon, setSelectedHorizon] = useState<string>('NOW');
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  const [layers, setLayers] = useState<MapLayerState>(defaultLayers);
  const [activeBaseMap, setActiveBaseMap] = useState<'dark-vector' | 'satellite-tiles'>('dark-vector');
  const [activeSatelliteType, setActiveSatelliteType] = useState<SatelliteSensorType>('INFRARED');

  const [mapFlyTarget, setMapFlyTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);

  const [isChartsModalOpen, setIsChartsModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);

  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      const [cycList, settings] = await Promise.all([
        cycloneApi.getCyclones(),
        userApi.getUserSettings(),
      ]);
      setCyclones(cycList);
      setUserSettings(settings);
    } catch (err) {
      console.error('[DashboardContext] Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const [cycList, settings] = await Promise.all([
          cycloneApi.getCyclones(),
          userApi.getUserSettings(),
        ]);
        if (isMounted) {
          setCyclones(cycList);
          setUserSettings(settings);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize active cyclone details when selectedCycloneId changes
  useEffect(() => {
    let isMounted = true;
    async function syncCycloneDetails() {
      if (!selectedCycloneId) return;

      try {
        const [fc, risks, alts] = await Promise.all([
          forecastApi.getForecastByCycloneId(selectedCycloneId),
          riskApi.getRiskRegionsByCycloneId(selectedCycloneId),
          alertApi.getAlertsByCycloneId(selectedCycloneId),
        ]);

        if (isMounted) {
          setCurrentForecast(fc);
          setCurrentRiskRegions(risks);
          setCurrentAlerts(alts);
        }
      } catch (err) {
        console.error('[DashboardContext] Error syncing cyclone details:', err);
      }
    }

    syncCycloneDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedCycloneId]);

  const selectedCyclone = cyclones.find((c) => c.id === selectedCycloneId) || cyclones[0] || null;

  const toggleLayer = useCallback((key: keyof MapLayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const flyToLocation = useCallback((coords: [number, number], zoom = 6) => {
    setMapFlyTarget({ center: coords, zoom });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    const updated = await userApi.updateUserSettings(updates);
    setUserSettings(updated);
  }, []);

  const value: DashboardContextType = {
    cyclones,
    selectedCycloneId,
    selectedCyclone,
    setSelectedCycloneId,
    isLoading,
    refreshData: loadInitialData,

    currentForecast,
    currentRiskRegions,
    currentAlerts,

    selectedHorizon,
    setSelectedHorizon,
    isPlayingTimeline,
    setIsPlayingTimeline,

    layers,
    toggleLayer,
    activeBaseMap,
    setActiveBaseMap,
    activeSatelliteType,
    setActiveSatelliteType,

    mapFlyTarget,
    flyToLocation,

    isChartsModalOpen,
    setIsChartsModalOpen,
    isSearchOpen,
    setIsSearchOpen,
    isSidebarExpanded,
    setIsSidebarExpanded,

    userSettings,
    updateSettings,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

const defaultFallbackContext: DashboardContextType = {
  cyclones: [],
  selectedCycloneId: 'cyc_aruna',
  selectedCyclone: null,
  setSelectedCycloneId: () => {},
  isLoading: false,
  refreshData: async () => {},

  currentForecast: null,
  currentRiskRegions: [],
  currentAlerts: [],

  selectedHorizon: 'NOW',
  setSelectedHorizon: () => {},
  isPlayingTimeline: false,
  setIsPlayingTimeline: () => {},

  layers: defaultLayers,
  toggleLayer: () => {},
  activeBaseMap: 'dark-vector',
  setActiveBaseMap: () => {},
  activeSatelliteType: 'INFRARED',
  setActiveSatelliteType: () => {},

  mapFlyTarget: null,
  flyToLocation: () => {},

  isChartsModalOpen: false,
  setIsChartsModalOpen: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
  isSidebarExpanded: false,
  setIsSidebarExpanded: () => {},

  userSettings: null,
  updateSettings: async () => {},
};

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  return context || defaultFallbackContext;
}
