import { MOCK_CYCLONES, MockCyclone } from '../mock/cycloneMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type CycloneSystem = MockCyclone;

export const cycloneApi = {
  async getActiveCyclones(): Promise<{ success: boolean; data: CycloneSystem[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_CYCLONES, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/cyclones/active`);
      if (!res.ok) return { success: false, data: MOCK_CYCLONES, isMock: true, error: 'Unable to connect to live API, falling back to mock data.' };
      const json = await res.json();
      return { success: true, data: json.data || MOCK_CYCLONES, isMock: false };
    } catch {
      return { success: false, data: MOCK_CYCLONES, isMock: true, error: 'Backend unreachable.' };
    }
  },

  async getCycloneById(id: string): Promise<{ success: boolean; data: CycloneSystem | null; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 150));
      const found = MOCK_CYCLONES.find((c) => c.id === id) || MOCK_CYCLONES[0] || null;
      return { success: true, data: found, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/cyclones/${id}`);
      if (!res.ok) return { success: false, data: null, isMock: true, error: 'Cyclone not found.' };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_CYCLONES[0] || null, isMock: true };
    }
  },
};
