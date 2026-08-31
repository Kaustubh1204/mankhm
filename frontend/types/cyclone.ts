export type CycloneStatus = 'ACTIVE' | 'DEVELOPING' | 'WEAKENING' | 'DISSIPATED';

export type CycloneClassification =
  | 'Super Cyclonic Storm'
  | 'Extremely Severe Cyclonic Storm'
  | 'Very Severe Cyclonic Storm'
  | 'Severe Cyclonic Storm'
  | 'Cyclonic Storm'
  | 'Deep Depression'
  | 'Depression'
  | 'Well Marked Low';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFO';

export type IntensityTrend = 'STRENGTHENING' | 'STEADY' | 'WEAKENING';

export type RIRiskLevel = 'EXTREME' | 'ELEVATED' | 'MODERATE' | 'LOW';

export interface CycloneTrackPoint {
  timeHorizon: string; // e.g. "-24h", "-12h", "NOW", "+6h", "+12h", "+24h", "+48h", "+72h"
  timestamp: string;
  latitude: number;
  longitude: number;
  windSpeedKmH: number;
  windSpeedKt: number;
  centralPressureHpa: number;
  classification: CycloneClassification | string;
  movementDirection?: string;
  movementSpeedKmH?: number;
  isObserved?: boolean;
  confidenceRadiusKm?: number;
}

export interface CycloneForecast {
  cycloneId: string;
  cycloneName: string;
  intensityTrend: IntensityTrend;
  rapidIntensificationRisk: RIRiskLevel;
  rapidIntensificationProbPct: number;
  trackConfidencePct: number;
  intensityConfidencePct: number;
  modelAgreementPct: number;
  modelName: string;
  predictionHorizon: string;
  aiSummary: string;
  lastModelRun: string;
  points: CycloneTrackPoint[];
}

export interface Cyclone {
  id: string;
  name: string;
  classification: CycloneClassification | string;
  categoryNumber: number;
  maxWindKmH: number;
  maxWindKt: number;
  centralPressureHpa: number;
  latitude: number;
  longitude: number;
  movementDirection: string;
  movementSpeedKmH: number;
  movementSpeedKt: number;
  lastObservation: string;
  status: CycloneStatus;
  intensityTrend: IntensityTrend;
  rapidIntensificationRisk: RIRiskLevel;
  rapidIntensificationProbPct: number;
  isSaved?: boolean;
  region: string;
  basin: 'Bay of Bengal' | 'Arabian Sea' | 'North Indian Ocean';
  description?: string;
  observedTrack: CycloneTrackPoint[];
  forecast: CycloneForecast;
}

export interface RiskFactorScore {
  name: string;
  score: number; // 0 - 100
  level: SeverityLevel;
  description: string;
}

export interface RiskRegion {
  id: string;
  regionName: string;
  stateCountry: string;
  riskLevel: SeverityLevel;
  windRiskScore: number;
  rainfallRiskScore: number;
  stormSurgeMeters: number;
  coastalExposureScore: number;
  populationExposure: string;
  primaryCycloneId: string;
  primaryCycloneName: string;
  lastUpdated: string;
  coordinates: [number, number][]; // Polygon coordinates [[lat, lon], ...]
  summary: string;
}

export interface CycloneAlert {
  id: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  category: 'INTENSIFICATION' | 'TRACK_CHANGE' | 'SURGE_WARNING' | 'SATELLITE' | 'GENERAL';
  cycloneId?: string;
  cycloneName?: string;
  region: string;
  timestamp: string;
  source: string;
  isRead: boolean;
}

export interface HistoricalCyclone {
  id: string;
  cycloneName: string;
  year: number;
  region: string;
  startDate: string;
  endDate: string;
  peakWindKmH: number;
  peakWindKt: number;
  minPressureHpa: number;
  durationDays: number;
  maxClassification: string;
  landfallLocation?: string;
  fatalities?: string;
  observationsCount: number;
  trackSummary: CycloneTrackPoint[];
  aiAnalysisSummary: string;
}

export type SatelliteSensorType = 'VISIBLE' | 'INFRARED' | 'WATER_VAPOR' | 'MICROWAVE';

export interface SatelliteLayer {
  type: SatelliteSensorType;
  title: string;
  satelliteName: string;
  description: string;
  resolutionKm: number;
  timestamp: string;
  colorScale: string;
  imageUrl?: string;
}

export interface CycloneNotification {
  id: string;
  title: string;
  message: string;
  type: 'CYCLONE_UPDATE' | 'FORECAST_UPDATE' | 'RISK_UPDATE' | 'ALERT' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  linkHref?: string;
  cycloneId?: string;
}

export interface CycloneReport {
  id: string;
  reportName: string;
  type: 'CYCLONE_SUMMARY' | 'FORECAST_ANALYSIS' | 'RISK_ASSESSMENT' | 'HISTORICAL_ARCHIVE';
  cycloneId?: string;
  cycloneName?: string;
  generatedTimestamp: string;
  fileSizeMb: number;
  status: 'READY' | 'GENERATING' | 'FAILED';
  executiveSummary: string;
  sections: string[];
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: 'USER' | 'ADMIN' | 'RESEARCHER';
  createdAt: string;
  avatarUrl?: string;
}

export interface UserSettings {
  windUnit: 'kmh' | 'kt' | 'mph';
  pressureUnit: 'hPa' | 'mb';
  distanceUnit: 'km' | 'miles';
  timezone: 'UTC' | 'IST' | 'LOCAL';
  notifications: {
    cycloneUpdateAlerts: boolean;
    forecastChangeAlerts: boolean;
    riskAlerts: boolean;
    criticalAlerts: boolean;
    systemNotifications: boolean;
  };
  theme: 'dark-meteorological';
  mapStyle: 'dark-vector' | 'satellite-tiles';
}
