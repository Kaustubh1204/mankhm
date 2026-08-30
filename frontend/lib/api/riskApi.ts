import { MOCK_RISK_REGIONS, RiskRegion } from '../mock/riskMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type { RiskRegion };

export const riskApi = {
  async getRiskRegions(): Promise<{ success: boolean; data: RiskRegion[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_RISK_REGIONS, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/risk/regions`);
      if (!res.ok) return { success: false, data: MOCK_RISK_REGIONS, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_RISK_REGIONS, isMock: true };
    }
  },
};
