import { MOCK_HISTORY_RECORDS, HistoricalRecord } from '../mock/historyMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type { HistoricalRecord };

export const historyApi = {
  async getHistoryRecords(): Promise<{ success: boolean; data: HistoricalRecord[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_HISTORY_RECORDS, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/history/records`);
      if (!res.ok) return { success: false, data: MOCK_HISTORY_RECORDS, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_HISTORY_RECORDS, isMock: true };
    }
  },
};
