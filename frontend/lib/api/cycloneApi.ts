import { MOCK_CYCLONES, MockCyclone } from '../mock/cycloneMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mankhm-cyclone-edge.repo-mankhm.workers.dev';

export type CycloneSystem = MockCyclone;

export const cycloneApi = {
  async getActiveCyclones(): Promise<{ success: boolean; data: CycloneSystem[]; isMock: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/api/v1/predict/realtime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storm_id: 'BOB_01_2026', ref_lat: 16.5, ref_lon: 87.2 }),
      });
      if (!res.ok) throw new Error('API Response Error');
      const json = await res.json();
      
      const realCyclone: CycloneSystem = {
        id: json.storm_id || 'BOB_01_2026',
        name: `Cyclone ${json.storm_id}`,
        category: json.intensity?.imd_category || 'Cyclonic Storm',
        windSpeedKnots: json.intensity?.msw_knots || 45,
        centralPressureHpa: json.intensity?.central_pressure_hpa || 980,
        eyeLat: json.detection_obb?.eye_center_lat || 16.5,
        eyeLon: json.detection_obb?.eye_center_lon || 87.2,
        vortexWidthKm: json.detection_obb?.vortex_width_km || 124.5,
        vortexHeightKm: json.detection_obb?.vortex_height_km || 118.9,
        trackWaypoints: (json.short_term_track_6h || []).map((pt: { hour: number; lat: number; lon: number }) => ({
          hour: pt.hour,
          lat: pt.lat,
          lon: pt.lon,
        })),
        lastUpdatedUtc: new Date().toISOString(),
        status: 'ACTIVE',
      };

      return { success: true, data: [realCyclone], isMock: false };
    } catch {
      return { success: true, data: MOCK_CYCLONES, isMock: true, error: 'Connecting via fallback cache.' };
    }
  },

  async getCycloneById(id: string): Promise<{ success: boolean; data: CycloneSystem | null; isMock: boolean; error?: string }> {
    const list = await this.getActiveCyclones();
    const found = list.data.find((c) => c.id === id) || list.data[0] || null;
    return { success: true, data: found, isMock: list.isMock };
  },
};
