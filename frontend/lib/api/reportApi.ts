import { MOCK_REPORTS, MockReport } from '../mock/reportMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type { MockReport };

export const reportApi = {
  async getReports(): Promise<{ success: boolean; data: MockReport[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_REPORTS, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/reports`);
      if (!res.ok) return { success: false, data: MOCK_REPORTS, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_REPORTS, isMock: true };
    }
  },
};
