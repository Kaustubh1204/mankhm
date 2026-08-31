import { RiskRegion } from '@/types/cyclone';
import { MOCK_RISK_REGIONS } from '@/lib/mock/riskMock';

export const riskApi = {
  async getRiskRegions(): Promise<RiskRegion[]> {
    return Promise.resolve([...MOCK_RISK_REGIONS]);
  },

  async getRiskRegionById(id: string): Promise<RiskRegion | null> {
    const found = MOCK_RISK_REGIONS.find((r) => r.id === id);
    return Promise.resolve(found ? { ...found } : null);
  },

  async getRiskRegionsByCycloneId(cycloneId: string): Promise<RiskRegion[]> {
    const matched = MOCK_RISK_REGIONS.filter((r) => r.primaryCycloneId === cycloneId);
    return Promise.resolve(matched.length > 0 ? matched : [...MOCK_RISK_REGIONS]);
  },
};
