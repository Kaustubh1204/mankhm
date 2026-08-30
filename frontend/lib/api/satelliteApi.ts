import { MOCK_SATELLITE_LAYERS, SatelliteLayer } from '../mock/satelliteMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type { SatelliteLayer };

export const satelliteApi = {
  async getSatelliteLayers(): Promise<{ success: boolean; data: SatelliteLayer[]; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      return { success: true, data: MOCK_SATELLITE_LAYERS, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/satellite/layers`);
      if (!res.ok) return { success: false, data: MOCK_SATELLITE_LAYERS, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_SATELLITE_LAYERS, isMock: true };
    }
  },
};
