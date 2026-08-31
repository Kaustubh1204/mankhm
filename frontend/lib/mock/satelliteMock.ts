export interface SatelliteLayer {
  type: 'VISIBLE' | 'INFRARED' | 'WATER_VAPOR' | 'MICROWAVE';
  title: string;
  sensor: string;
  timestamp: string;
  resolutionKm: number;
  description: string;
  previewColor: string;
}

export const MOCK_SATELLITE_LAYERS: SatelliteLayer[] = [
  {
    type: 'VISIBLE',
    title: 'INSAT-3DS High-Res Visible Channel (0.65 µm)',
    sensor: 'INSAT-3DS Imager',
    timestamp: '2026-08-31 03:00 UTC',
    resolutionKm: 1.0,
    description: 'Daytime cloud structure & convective cloud top symmetry.',
    previewColor: '#00b4d8',
  },
  {
    type: 'INFRARED',
    title: 'Enhanced Thermal IR Channel (10.8 µm)',
    sensor: 'INSAT-3DS Sounder',
    timestamp: '2026-08-31 03:00 UTC',
    resolutionKm: 4.0,
    description: 'Cloud top temperature mapping & Dvorak T-number estimation.',
    previewColor: '#0077b6',
  },
  {
    type: 'WATER_VAPOR',
    title: 'Upper-Level Water Vapor Channel (6.7 µm)',
    sensor: 'INSAT-3DR Imager',
    timestamp: '2026-08-31 02:45 UTC',
    resolutionKm: 4.0,
    description: 'Mid-to-upper tropospheric moisture & environmental outflow channels.',
    previewColor: '#38bdf8',
  },
  {
    type: 'MICROWAVE',
    title: 'AMSR2 89 GHz Passive Microwave Imager',
    sensor: 'GCOM-W AMSR2',
    timestamp: '2026-08-30 23:15 UTC',
    resolutionKm: 5.0,
    description: 'Eye-wall rainband structure penetrating upper cirrus shield.',
    previewColor: '#0284c7',
  },
];
