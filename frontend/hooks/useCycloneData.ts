'use client';

import { useState, useEffect } from 'react';
import { cycloneApi, CycloneSystem } from '@/lib/api/cycloneApi';
import { forecastApi, CycloneForecast } from '@/lib/api/forecastApi';
import { riskApi, RiskRegion } from '@/lib/api/riskApi';
import { alertApi, CycloneAlert } from '@/lib/api/alertApi';
import { historyApi, HistoricalRecord } from '@/lib/api/historyApi';
import { satelliteApi, SatelliteLayer } from '@/lib/api/satelliteApi';
import { notificationApi, MockNotification } from '@/lib/api/notificationApi';
import { reportApi, MockReport } from '@/lib/api/reportApi';

export function useCyclones(simulationMode: boolean = true) {
  const [cyclones, setCyclones] = useState<CycloneSystem[]>([]);
  const [hasActiveCyclone, setHasActiveCyclone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await cycloneApi.getActiveCyclones(simulationMode);
      setCyclones(res.data || []);
      setHasActiveCyclone(res.hasActiveCyclone);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, [simulationMode]);

  return { cyclones, hasActiveCyclone, loading, isMock };
}

export function useCyclone(id: string) {
  const [cyclone, setCyclone] = useState<CycloneSystem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await cycloneApi.getCycloneById(id);
      setCyclone(res.data);
      setIsMock(res.isMock);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  return { cyclone, loading, isMock };
}

export function useForecast(id: string = 'cyc_aruna') {
  const [forecast, setForecast] = useState<CycloneForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await forecastApi.getForecast(id);
      setForecast(res.data);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, [id]);

  return { forecast, loading, isMock };
}

export function useRisk() {
  const [riskRegions, setRiskRegions] = useState<RiskRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await riskApi.getRiskRegions();
      setRiskRegions(res.data || []);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, []);

  return { riskRegions, loading, isMock };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<CycloneAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await alertApi.getAlerts();
      setAlerts(res.data || []);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, []);

  return { alerts, setAlerts, loading, isMock };
}

export function useHistoricalData() {
  const [records, setRecords] = useState<HistoricalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await historyApi.getHistoryRecords();
      setRecords(res.data || []);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, []);

  return { records, loading, isMock };
}

export function useSatelliteLayers() {
  const [layers, setLayers] = useState<SatelliteLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await satelliteApi.getSatelliteLayers();
      setLayers(res.data || []);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, []);

  return { layers, loading, isMock };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data || []);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, []);

  return { notifications, setNotifications, loading, isMock };
}

export function useReports() {
  const [reports, setReports] = useState<MockReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await reportApi.getReports();
      setReports(res.data || []);
      setIsMock(res.isMock);
      setLoading(false);
    }
    load();
  }, []);

  return { reports, loading, isMock };
}
