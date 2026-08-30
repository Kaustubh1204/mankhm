export interface MockAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  title: string;
  description: string;
  cycloneId?: string;
  cycloneName?: string;
  region: string;
  timestamp: string;
  source: string;
  isRead: boolean;
}

export type CycloneAlert = MockAlert;

export const MOCK_ALERTS: MockAlert[] = [
  {
    id: 'alt_001',
    severity: 'CRITICAL',
    title: 'Extremely Heavy Rainfall & Storm Surge Warning',
    description: 'Cyclone Aruna expected to produce storm surge of 3.5-4.5m along North Odisha coast. Coastal evacuations advised.',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    region: 'North Odisha & West Bengal Coast',
    timestamp: '2026-08-31 03:00 UTC',
    source: 'CycloneSense Neural Alert Engine',
    isRead: false,
  },
  {
    id: 'alt_002',
    severity: 'HIGH',
    title: 'Gale Wind Hazard Advisory (75-85 kt)',
    description: 'Sustained surface winds approaching 145 km/h near storm core. Ports advised to hoist signal IV.',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    region: 'Bay of Bengal Northwest Basin',
    timestamp: '2026-08-31 02:15 UTC',
    source: 'CycloneSense Wind Sensor Stream',
    isRead: false,
  },
  {
    id: 'alt_003',
    severity: 'MODERATE',
    title: 'Squally Weather Advisory for Arabian Sea',
    description: 'Cyclone Vayun maintaining Severe Cyclonic Storm intensity. Fishermen advised not to venture into North Arabian Sea.',
    cycloneId: 'cyc_vayun',
    cycloneName: 'Cyclone Vayun',
    region: 'North Arabian Sea',
    timestamp: '2026-08-31 01:30 UTC',
    source: 'CycloneSense Buoy Data Feed',
    isRead: true,
  },
  {
    id: 'alt_004',
    severity: 'INFO',
    title: 'Satellite Ingestion Update (INSAT-3DS)',
    description: 'Automated 15-minute thermal infrared & microwave orbital scans successfully processed.',
    region: 'Indian Ocean Basin',
    timestamp: '2026-08-31 03:15 UTC',
    source: 'INSAT-3DS Ingestion Node',
    isRead: true,
  },
];
