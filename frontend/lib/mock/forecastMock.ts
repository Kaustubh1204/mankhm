export interface ForecastPoint {
  timeHorizon: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  windSpeedKt: number;
  windSpeedKmH: number;
  pressureHpa: number;
  classification: string;
  confidenceRadiusKm: number;
}

export interface MockForecast {
  cycloneId: string;
  cycloneName: string;
  intensityTrend: 'STRENGTHENING' | 'STEADY' | 'WEAKENING';
  rapidIntensificationRisk: 'ELEVATED' | 'HIGH' | 'MODERATE' | 'LOW';
  rapidIntensificationProbPct: number;
  trackConfidencePct: number;
  intensityConfidencePct: number;
  modelAgreementPct: number;
  points: ForecastPoint[];
}

export const MOCK_FORECASTS: Record<string, MockForecast> = {
  cyc_aruna: {
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    intensityTrend: 'STRENGTHENING',
    rapidIntensificationRisk: 'ELEVATED',
    rapidIntensificationProbPct: 74,
    trackConfidencePct: 87,
    intensityConfidencePct: 82,
    modelAgreementPct: 91,
    points: [
      { timeHorizon: 'NOW', timestamp: '2026-08-31 03:00 UTC', latitude: 16.4, longitude: 87.2, windSpeedKt: 78, windSpeedKmH: 145, pressureHpa: 968, classification: 'Very Severe Cyclonic Storm', confidenceRadiusKm: 15 },
      { timeHorizon: '+6h', timestamp: '2026-08-31 09:00 UTC', latitude: 17.1, longitude: 86.6, windSpeedKt: 85, windSpeedKmH: 157, pressureHpa: 962, classification: 'Very Severe Cyclonic Storm', confidenceRadiusKm: 30 },
      { timeHorizon: '+12h', timestamp: '2026-08-31 15:00 UTC', latitude: 17.9, longitude: 86.0, windSpeedKt: 92, windSpeedKmH: 170, pressureHpa: 955, classification: 'Extremely Severe Cyclonic Storm', confidenceRadiusKm: 50 },
      { timeHorizon: '+24h', timestamp: '2026-09-01 03:00 UTC', latitude: 19.3, longitude: 85.2, windSpeedKt: 98, windSpeedKmH: 181, pressureHpa: 948, classification: 'Extremely Severe Cyclonic Storm', confidenceRadiusKm: 85 },
      { timeHorizon: '+36h', timestamp: '2026-09-01 15:00 UTC', latitude: 20.4, longitude: 84.8, windSpeedKt: 90, windSpeedKmH: 166, pressureHpa: 958, classification: 'Very Severe Cyclonic Storm', confidenceRadiusKm: 120 },
      { timeHorizon: '+48h', timestamp: '2026-09-02 03:00 UTC', latitude: 21.2, longitude: 84.5, windSpeedKt: 65, windSpeedKmH: 120, pressureHpa: 975, classification: 'Severe Cyclonic Storm', confidenceRadiusKm: 160 },
      { timeHorizon: '+72h', timestamp: '2026-09-03 03:00 UTC', latitude: 22.5, longitude: 84.2, windSpeedKt: 35, windSpeedKmH: 65, pressureHpa: 995, classification: 'Depression', confidenceRadiusKm: 220 },
    ],
  },
  cyc_vayun: {
    cycloneId: 'cyc_vayun',
    cycloneName: 'Cyclone Vayun',
    intensityTrend: 'STEADY',
    rapidIntensificationRisk: 'MODERATE',
    rapidIntensificationProbPct: 42,
    trackConfidencePct: 83,
    intensityConfidencePct: 78,
    modelAgreementPct: 86,
    points: [
      { timeHorizon: 'NOW', timestamp: '2026-08-31 02:30 UTC', latitude: 19.8, longitude: 65.5, windSpeedKt: 60, windSpeedKmH: 110, pressureHpa: 982, classification: 'Severe Cyclonic Storm', confidenceRadiusKm: 20 },
      { timeHorizon: '+6h', timestamp: '2026-08-31 08:30 UTC', latitude: 20.4, longitude: 65.8, windSpeedKt: 62, windSpeedKmH: 115, pressureHpa: 980, classification: 'Severe Cyclonic Storm', confidenceRadiusKm: 35 },
      { timeHorizon: '+12h', timestamp: '2026-08-31 14:30 UTC', latitude: 21.1, longitude: 66.2, windSpeedKt: 65, windSpeedKmH: 120, pressureHpa: 978, classification: 'Severe Cyclonic Storm', confidenceRadiusKm: 55 },
      { timeHorizon: '+24h', timestamp: '2026-09-01 02:30 UTC', latitude: 22.2, longitude: 67.0, windSpeedKt: 55, windSpeedKmH: 102, pressureHpa: 986, classification: 'Cyclonic Storm', confidenceRadiusKm: 90 },
      { timeHorizon: '+48h', timestamp: '2026-09-02 02:30 UTC', latitude: 23.5, longitude: 68.2, windSpeedKt: 40, windSpeedKmH: 74, pressureHpa: 994, classification: 'Deep Depression', confidenceRadiusKm: 170 },
      { timeHorizon: '+72h', timestamp: '2026-09-03 02:30 UTC', latitude: 24.2, longitude: 69.5, windSpeedKt: 25, windSpeedKmH: 46, pressureHpa: 1002, classification: 'Well Marked Low', confidenceRadiusKm: 250 },
    ],
  },
};
