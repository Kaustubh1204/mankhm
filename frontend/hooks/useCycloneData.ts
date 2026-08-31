'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Cyclone,
  CycloneForecast,
  RiskRegion,
  CycloneAlert,
  HistoricalCyclone,
  SatelliteLayer,
  CycloneNotification,
  CycloneReport,
  UserProfileData,
  UserSettings,
} from '@/types/cyclone';
import { cycloneApi } from '@/lib/api/cycloneApi';
import { forecastApi } from '@/lib/api/forecastApi';
import { riskApi } from '@/lib/api/riskApi';
import { alertApi } from '@/lib/api/alertApi';
import { historyApi } from '@/lib/api/historyApi';
import { satelliteApi } from '@/lib/api/satelliteApi';
import { notificationApi } from '@/lib/api/notificationApi';
import { reportApi } from '@/lib/api/reportApi';
import { userApi } from '@/lib/api/userApi';

export function useCyclones() {
  const [cyclones, setCyclones] = useState<Cyclone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCyclones = useCallback(async () => {
    try {
      const data = await cycloneApi.getCyclones();
      setCyclones(data);
    } catch (err) {
      console.error('[useCyclones] Error fetching cyclones:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await cycloneApi.getCyclones();
        if (isMounted) {
          setCyclones(data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { cyclones, isLoading, refetch: fetchCyclones, setCyclones };
}

export function useCurrentCyclone() {
  const [cyclone, setCyclone] = useState<Cyclone | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await cycloneApi.getCyclones();
      if (isMounted) {
        setCyclone(data[0] || null);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { cyclone, isLoading, setCyclone };
}

export function useCyclone(id: string) {
  const [cyclone, setCyclone] = useState<Cyclone | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCyclone = useCallback(async () => {
    try {
      const data = await cycloneApi.getCycloneById(id);
      setCyclone(data);
    } catch (err) {
      console.error(`[useCyclone] Error fetching cyclone ${id}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await cycloneApi.getCycloneById(id);
        if (isMounted) {
          setCyclone(data);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleSave = async () => {
    if (!id) return;
    const updated = await cycloneApi.toggleSaveCyclone(id);
    if (updated) setCyclone(updated);
  };

  return { cyclone, isLoading, refetch: fetchCyclone, toggleSave };
}

export function useForecast(cycloneId: string) {
  const [forecast, setForecast] = useState<CycloneForecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchForecast() {
      const data = await forecastApi.getForecastByCycloneId(cycloneId);
      if (isMounted) {
        setForecast(data);
        setIsLoading(false);
      }
    }
    fetchForecast();
    return () => {
      isMounted = false;
    };
  }, [cycloneId]);

  return { forecast, isLoading };
}

export function useRisk(cycloneId?: string) {
  const [riskRegions, setRiskRegions] = useState<RiskRegion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchRisk() {
      const data = cycloneId
        ? await riskApi.getRiskRegionsByCycloneId(cycloneId)
        : await riskApi.getRiskRegions();
      if (isMounted) {
        setRiskRegions(data);
        setIsLoading(false);
      }
    }
    fetchRisk();
    return () => {
      isMounted = false;
    };
  }, [cycloneId]);

  return { riskRegions, isLoading };
}

export function useAlerts(cycloneId?: string) {
  const [alerts, setAlerts] = useState<CycloneAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAlerts = useCallback(async () => {
    const data = cycloneId ? await alertApi.getAlertsByCycloneId(cycloneId) : await alertApi.getAlerts();
    setAlerts(data);
    setIsLoading(false);
  }, [cycloneId]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = cycloneId ? await alertApi.getAlertsByCycloneId(cycloneId) : await alertApi.getAlerts();
      if (isMounted) {
        setAlerts(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [cycloneId]);

  const markAsRead = async (id: string) => {
    await alertApi.markAlertAsRead(id);
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const markAllAsRead = async () => {
    await alertApi.markAllAlertsAsRead();
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  return { alerts, isLoading, markAsRead, markAllAsRead, setAlerts, refetch: fetchAlerts };
}

export function useHistory() {
  const [records, setRecords] = useState<HistoricalCyclone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHistory = useCallback(async (query = '', year = 'ALL', region = 'ALL') => {
    const data = await historyApi.searchHistoricalCyclones(query, year, region);
    setRecords(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await historyApi.searchHistoricalCyclones('', 'ALL', 'ALL');
      if (isMounted) {
        setRecords(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { records, isLoading, searchHistory: fetchHistory };
}

export function useHistoricalData() {
  return useHistory();
}

export function useSavedCyclones() {
  const [savedCyclones, setSavedCyclones] = useState<Cyclone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSaved = useCallback(async () => {
    const all = await cycloneApi.getCyclones();
    setSavedCyclones(all.filter((c) => c.isSaved));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const all = await cycloneApi.getCyclones();
      if (isMounted) {
        setSavedCyclones(all.filter((c) => c.isSaved));
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const removeSaved = async (id: string) => {
    await cycloneApi.toggleSaveCyclone(id);
    setSavedCyclones((prev) => prev.filter((c) => c.id !== id));
  };

  return { savedCyclones, isLoading, removeSaved, refetch: fetchSaved };
}

export function useSatelliteLayers() {
  const [layers, setLayers] = useState<SatelliteLayer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchLayers() {
      const data = await satelliteApi.getSatelliteLayers();
      if (isMounted) {
        setLayers(data);
        setIsLoading(false);
      }
    }
    fetchLayers();
    return () => {
      isMounted = false;
    };
  }, []);

  return { layers, isLoading };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<CycloneNotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async () => {
    const data = await notificationApi.getNotifications();
    setNotifications(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await notificationApi.getNotifications();
      if (isMounted) {
        setNotifications(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const markAsRead = async (id: string) => {
    await notificationApi.markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = async () => {
    await notificationApi.markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return { notifications, isLoading, markAsRead, markAllAsRead, setNotifications };
}

export function useReports() {
  const [reports, setReports] = useState<CycloneReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReports = useCallback(async () => {
    const data = await reportApi.getReports();
    setReports(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await reportApi.getReports();
      if (isMounted) {
        setReports(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const generateReport = async (type: CycloneReport['type'], cycloneId?: string, cycloneName?: string) => {
    const newRep = await reportApi.generateReport(type, cycloneId, cycloneName);
    setReports((prev) => [newRep, ...prev]);
    return newRep;
  };

  return { reports, isLoading, generateReport, refetch: fetchReports };
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await userApi.getUserProfile();
      if (isMounted) {
        setProfile(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = async (updates: Partial<UserProfileData>) => {
    const updated = await userApi.updateUserProfile(updates);
    setProfile(updated);
  };

  return { profile, isLoading, updateProfile };
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const data = await userApi.getUserSettings();
      if (isMounted) {
        setSettings(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const updated = await userApi.updateUserSettings(updates);
    setSettings(updated);
  };

  return { settings, isLoading, updateSettings };
}
