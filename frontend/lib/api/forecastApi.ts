import { CycloneForecast } from '@/types/cyclone';
import { MOCK_FORECASTS } from '@/lib/mock/forecastMock';

export const forecastApi = {
  async getForecastByCycloneId(cycloneId: string): Promise<CycloneForecast | null> {
    const fc = MOCK_FORECASTS[cycloneId] || MOCK_FORECASTS['cyc_aruna'];
    return Promise.resolve(fc ? { ...fc } : null);
  },

  async getAllForecasts(): Promise<Record<string, CycloneForecast>> {
    return Promise.resolve({ ...MOCK_FORECASTS });
  },

  async getModelEnsembleInfo() {
    return Promise.resolve({
      modelName: 'CycloneSense Neural Ensemble v1.0',
      predictionHorizonHours: 72,
      timeStepHours: 6,
      modelStatus: 'DEMO' as const,
      meanConfidencePct: 87,
      sourcesIngested: ['INSAT-3DS', 'Sentinel-1 SAR', 'Scatterometer Winds', 'Argo Ocean Heat Floats'],
      lastRunTime: '2026-08-31 08:00 UTC (DEMO)',
    });
  },
};
