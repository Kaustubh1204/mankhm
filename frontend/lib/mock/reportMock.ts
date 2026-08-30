export interface MockReport {
  id: string;
  reportName: string;
  type: 'CYCLONE_SUMMARY' | 'FORECAST_ANALYSIS' | 'RISK_ASSESSMENT' | 'HISTORICAL_ARCHIVE';
  cycloneId?: string;
  cycloneName?: string;
  generatedTimestamp: string;
  fileSizeMb: number;
  status: 'READY' | 'PROCESSING';
}

export const MOCK_REPORTS: MockReport[] = [
  {
    id: 'rpt_aruna_summary',
    reportName: 'Cyclone Aruna Synoptic & Intensity Bulletin',
    type: 'CYCLONE_SUMMARY',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    generatedTimestamp: '2026-08-31 03:00 UTC',
    fileSizeMb: 4.8,
    status: 'READY',
  },
  {
    id: 'rpt_aruna_forecast',
    reportName: '72h Trajectory & Intensity Cone Projection',
    type: 'FORECAST_ANALYSIS',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    generatedTimestamp: '2026-08-31 02:30 UTC',
    fileSizeMb: 6.2,
    status: 'READY',
  },
  {
    id: 'rpt_odisha_surge',
    reportName: 'North Odisha Storm Surge & Exposure Analysis',
    type: 'RISK_ASSESSMENT',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    generatedTimestamp: '2026-08-31 02:00 UTC',
    fileSizeMb: 8.1,
    status: 'READY',
  },
  {
    id: 'rpt_bay_bengal_2023',
    reportName: '2023 Bay of Bengal Cyclonic Season Retrospective',
    type: 'HISTORICAL_ARCHIVE',
    generatedTimestamp: '2026-08-15 10:00 UTC',
    fileSizeMb: 14.5,
    status: 'READY',
  },
];
