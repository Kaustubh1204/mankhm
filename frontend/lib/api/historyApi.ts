import { HistoricalCyclone } from '@/types/cyclone';
import { MOCK_HISTORICAL_CYCLONES } from '@/lib/mock/historyMock';

export const historyApi = {
  async getHistoricalCyclones(): Promise<HistoricalCyclone[]> {
    return Promise.resolve([...MOCK_HISTORICAL_CYCLONES]);
  },

  async getHistoricalCycloneById(id: string): Promise<HistoricalCyclone | null> {
    const found = MOCK_HISTORICAL_CYCLONES.find((h) => h.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async searchHistoricalCyclones(query: string, year?: string, region?: string): Promise<HistoricalCyclone[]> {
    let result = [...MOCK_HISTORICAL_CYCLONES];
    if (year && year !== 'ALL') {
      result = result.filter((r) => String(r.year) === year);
    }
    if (region && region !== 'ALL') {
      result = result.filter((r) => r.region === region);
    }
    if (query) {
      const q = query.toLowerCase().trim();
      result = result.filter((r) => r.cycloneName.toLowerCase().includes(q) || r.region.toLowerCase().includes(q));
    }
    return Promise.resolve(result);
  },
};
