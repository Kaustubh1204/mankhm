import { SatelliteLayer } from '@/types/cyclone';

export const MOCK_SATELLITE_LAYERS: SatelliteLayer[] = [
  {
    type: 'VISIBLE',
    title: 'High-Resolution Visible (0.65 µm)',
    satelliteName: 'INSAT-3DS Imager',
    description: 'Daytime optical imagery capturing convective cloud tops, spiral inflow bands, and central vortex eye structure.',
    resolutionKm: 0.5,
    timestamp: '08:00 UTC (DEMO)',
    colorScale: 'Natural Cloud Reflectance',
  },
  {
    type: 'INFRARED',
    title: 'Enhanced Infrared (10.8 µm)',
    satelliteName: 'INSAT-3DS / Sentinel-3',
    description: 'Cloud-top temperature gradient mapping detecting deep convective towers (temperatures below -75°C).',
    resolutionKm: 1.0,
    timestamp: '08:15 UTC (DEMO)',
    colorScale: 'BD Enhancement (Cold Cloud Tops)',
  },
  {
    type: 'WATER_VAPOR',
    title: 'Mid-Level Water Vapor (6.7 µm)',
    satelliteName: 'INSAT-3DS Sounder',
    description: 'Tropospheric moisture flux and dry-air intrusion analysis diagnosing steering currents and shear boundaries.',
    resolutionKm: 2.0,
    timestamp: '07:45 UTC (DEMO)',
    colorScale: 'Atmospheric Moisture Spectrum',
  },
  {
    type: 'MICROWAVE',
    title: 'Microwave 89 GHz Brightness Temperature',
    satelliteName: 'GPM Core / AMSR-2',
    description: 'Passive microwave sounding penetrating cirrus canopy to image low-level eyewall concentric rings and rainband organization.',
    resolutionKm: 4.0,
    timestamp: '06:30 UTC (DEMO)',
    colorScale: 'Precipitation Radiance',
  },
];
