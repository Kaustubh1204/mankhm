import { MOCK_ALERTS, MockAlert } from '../mock/alertMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type CycloneAlert = MockAlert;

export const alertApi = {
  async getAlerts(): Promise<{ success: boolean; data: CycloneAlert[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_ALERTS, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/alerts`);
      if (!res.ok) return { success: false, data: MOCK_ALERTS, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_ALERTS, isMock: true };
    }
  },
};
