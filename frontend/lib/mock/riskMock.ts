export interface RiskRegion {
  id: string;
  regionName: string;
  stateCountry: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  windRiskScore: number; // 0-100
  rainfallRiskScore: number; // 0-100
  stormSurgeMeters: number;
  coastalExposureScore: number; // 0-100
  populationExposure: string;
  primaryCycloneId: string;
  lastUpdated: string;
}

export const MOCK_RISK_REGIONS: RiskRegion[] = [
  {
    id: 'risk_orissa_north',
    regionName: 'Northern Coastal Odisha (Bhadrak / Balasore)',
    stateCountry: 'Odisha, India',
    riskLevel: 'CRITICAL',
    windRiskScore: 92,
    rainfallRiskScore: 88,
    stormSurgeMeters: 4.2,
    coastalExposureScore: 95,
    populationExposure: '2.4 Million',
    primaryCycloneId: 'cyc_aruna',
    lastUpdated: '2026-08-31 03:00 UTC',
  },
  {
    id: 'risk_bengal_south',
    regionName: 'South 24 Parganas & Sundarbans',
    stateCountry: 'West Bengal, India',
    riskLevel: 'HIGH',
    windRiskScore: 78,
    rainfallRiskScore: 82,
    stormSurgeMeters: 2.8,
    coastalExposureScore: 88,
    populationExposure: '3.1 Million',
    primaryCycloneId: 'cyc_aruna',
    lastUpdated: '2026-08-31 03:00 UTC',
  },
  {
    id: 'risk_gujarat_kutch',
    regionName: 'Kutch & Devbhumi Dwarka Coast',
    stateCountry: 'Gujarat, India',
    riskLevel: 'MODERATE',
    windRiskScore: 58,
    rainfallRiskScore: 45,
    stormSurgeMeters: 1.5,
    coastalExposureScore: 62,
    populationExposure: '1.2 Million',
    primaryCycloneId: 'cyc_vayun',
    lastUpdated: '2026-08-31 02:30 UTC',
  },
  {
    id: 'risk_andhra_north',
    regionName: 'North Andhra Coast (Visakhapatnam)',
    stateCountry: 'Andhra Pradesh, India',
    riskLevel: 'LOW',
    windRiskScore: 32,
    rainfallRiskScore: 40,
    stormSurgeMeters: 0.6,
    coastalExposureScore: 45,
    populationExposure: '1.8 Million',
    primaryCycloneId: 'cyc_aruna',
    lastUpdated: '2026-08-31 03:00 UTC',
  },
];
