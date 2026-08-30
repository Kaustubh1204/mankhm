export interface HistoricalRecord {
  id: string;
  cycloneName: string;
  region: string;
  startDate: string;
  endDate: string;
  peakWindKmH: number;
  peakWindKt: number;
  minPressureHpa: number;
  durationDays: number;
  maxClassification: string;
  year: number;
  observationsCount: number;
}

export const MOCK_HISTORY_RECORDS: HistoricalRecord[] = [
  {
    id: 'hist_amphan_2020',
    cycloneName: 'Super Cyclone Amphan',
    region: 'Bay of Bengal',
    startDate: '2020-05-16',
    endDate: '2020-05-21',
    peakWindKmH: 260,
    peakWindKt: 140,
    minPressureHpa: 920,
    durationDays: 5,
    maxClassification: 'Super Cyclonic Storm',
    year: 2020,
    observationsCount: 142,
  },
  {
    id: 'hist_tauktae_2021',
    cycloneName: 'Extremely Severe Cyclone Tauktae',
    region: 'Arabian Sea',
    startDate: '2021-05-14',
    endDate: '2021-05-19',
    peakWindKmH: 220,
    peakWindKt: 120,
    minPressureHpa: 950,
    durationDays: 5,
    maxClassification: 'Extremely Severe Cyclonic Storm',
    year: 2021,
    observationsCount: 118,
  },
  {
    id: 'hist_biparjoy_2023',
    cycloneName: 'Very Severe Cyclone Biparjoy',
    region: 'Arabian Sea',
    startDate: '2023-06-06',
    endDate: '2023-06-19',
    peakWindKmH: 165,
    peakWindKt: 90,
    minPressureHpa: 966,
    durationDays: 13,
    maxClassification: 'Very Severe Cyclonic Storm',
    year: 2023,
    observationsCount: 260,
  },
  {
    id: 'hist_midhili_2023',
    cycloneName: 'Cyclonic Storm Midhili',
    region: 'Bay of Bengal',
    startDate: '2023-11-15',
    endDate: '2023-11-18',
    peakWindKmH: 85,
    peakWindKt: 45,
    minPressureHpa: 998,
    durationDays: 3,
    maxClassification: 'Cyclonic Storm',
    year: 2023,
    observationsCount: 54,
  },
];
