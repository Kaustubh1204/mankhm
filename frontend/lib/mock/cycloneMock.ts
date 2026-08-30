export interface MockCyclone {
  id: string;
  name: string;
  classification: string;
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
  status: 'ACTIVE' | 'DEVELOPING' | 'WEAKENING';
  isSaved?: boolean;
  region: string;
}

export const MOCK_CYCLONES: MockCyclone[] = [
  {
    id: 'cyc_aruna',
    name: 'Cyclone Aruna',
    classification: 'Very Severe Cyclonic Storm',
    categoryNumber: 3,
    maxWindKmH: 145,
    maxWindKt: 78,
    centralPressureHpa: 968,
    latitude: 16.4,
    longitude: 87.2,
    movementDirection: 'NW',
    movementSpeedKmH: 16,
    movementSpeedKt: 9,
    lastObservation: '2026-08-31 03:00 UTC',
    status: 'ACTIVE',
    isSaved: true,
    region: 'Bay of Bengal',
  },
  {
    id: 'cyc_vayun',
    name: 'Cyclone Vayun',
    classification: 'Severe Cyclonic Storm',
    categoryNumber: 2,
    maxWindKmH: 110,
    maxWindKt: 60,
    centralPressureHpa: 982,
    latitude: 19.8,
    longitude: 65.5,
    movementDirection: 'NNE',
    movementSpeedKmH: 12,
    movementSpeedKt: 6,
    lastObservation: '2026-08-31 02:30 UTC',
    status: 'ACTIVE',
    isSaved: true,
    region: 'Arabian Sea',
  },
  {
    id: 'cyc_mira',
    name: 'Cyclone Mira',
    classification: 'Cyclonic Storm',
    categoryNumber: 1,
    maxWindKmH: 75,
    maxWindKt: 40,
    centralPressureHpa: 994,
    latitude: 12.1,
    longitude: 89.6,
    movementDirection: 'WNW',
    movementSpeedKmH: 20,
    movementSpeedKt: 11,
    lastObservation: '2026-08-31 01:45 UTC',
    status: 'DEVELOPING',
    isSaved: false,
    region: 'Bay of Bengal',
  },
  {
    id: 'cyc_tara',
    name: 'Cyclone Tara',
    classification: 'Deep Depression',
    categoryNumber: 0,
    maxWindKmH: 55,
    maxWindKt: 30,
    centralPressureHpa: 1000,
    latitude: 9.5,
    longitude: 68.2,
    movementDirection: 'W',
    movementSpeedKmH: 14,
    movementSpeedKt: 8,
    lastObservation: '2026-08-30 22:00 UTC',
    status: 'WEAKENING',
    isSaved: true,
    region: 'Arabian Sea',
  },
];
