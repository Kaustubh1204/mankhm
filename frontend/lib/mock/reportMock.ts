import { CycloneReport } from '@/types/cyclone';

export const MOCK_REPORTS: CycloneReport[] = [
  {
    id: 'rpt_aruna_summary_01',
    reportName: 'Cyclone Aruna Complete Basin Intelligence Brief',
    type: 'CYCLONE_SUMMARY',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    generatedTimestamp: '2026-08-31 08:00 UTC (DEMO)',
    fileSizeMb: 4.8,
    status: 'READY',
    executiveSummary:
      'This intelligence brief synthesizes orbital satellite imagery (INSAT-3DS), scatterometer surface wind fields, and 72-hour deep learning trajectory ensembles for Cyclone Aruna in the Bay of Bengal. Extreme coastal hazard alerts remain active for Northern Odisha and West Bengal.',
    sections: [
      'Executive Intelligence Overview',
      'Synoptic Environment & Ocean Heat Content',
      'Satellite Eye-Wall Morphology & Deep Convection',
      '72-Hour Multi-Model Ensemble Trajectory',
      'Coastal Storm Surge & Inundation Analysis',
      'Evacuation Risk Index & Population Exposure',
    ],
  },
  {
    id: 'rpt_ensemble_forecast_02',
    reportName: 'North Indian Ocean 72h Ensemble Trajectory Analysis',
    type: 'FORECAST_ANALYSIS',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    generatedTimestamp: '2026-08-31 06:00 UTC (DEMO)',
    fileSizeMb: 3.2,
    status: 'READY',
    executiveSummary:
      'Ensemble trajectory divergence and track confidence analysis for active vortices across Bay of Bengal and Arabian Sea basins.',
    sections: [
      'Model Ensemble Inter-Comparison',
      'Cross-Track & Along-Track Error Analysis',
      'Intensity Forecast Cone of Uncertainty',
    ],
  },
  {
    id: 'rpt_odisha_surge_03',
    reportName: 'Odisha & Sundarbans Coastal Hazard Assessment',
    type: 'RISK_ASSESSMENT',
    cycloneId: 'cyc_aruna',
    cycloneName: 'Cyclone Aruna',
    generatedTimestamp: '2026-08-31 05:30 UTC (DEMO)',
    fileSizeMb: 5.6,
    status: 'READY',
    executiveSummary:
      'High-resolution hydrodynamic surge modeling indicates peak 4.5m water level increase above astronomical tide near Dhamra Port and Chandipur.',
    sections: [
      'Bathymetry & Tidal Resonance Factors',
      'Surge Height Inundation Mapping',
      'Infrastructure Vulnerability Assessment',
    ],
  },
  {
    id: 'rpt_historical_amphan_04',
    reportName: 'Super Cyclone Amphan (2020) Deep Learning Retrospective',
    type: 'HISTORICAL_ARCHIVE',
    generatedTimestamp: '2026-08-28 12:00 UTC (DEMO)',
    fileSizeMb: 8.1,
    status: 'READY',
    executiveSummary:
      'Retrospective benchmark comparing CycloneSense AI neural track and intensity predictions against historical IMD/JTWC best-track data.',
    sections: [
      'Historical Verification Metrics',
      'Rapid Intensification Lead-Time Evaluation',
      'AI Neural Weights Attribution',
    ],
  },
];
