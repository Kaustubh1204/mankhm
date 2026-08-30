import { MOCK_FORECASTS, MockForecast } from '../mock/forecastMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mankhm-cyclone-edge.repo-mankhm.workers.dev';

export type CycloneForecast = MockForecast;

export const forecastApi = {
  async getForecast(cycloneId: string = 'BOB_01_2026'): Promise<{ success: boolean; data: CycloneForecast | null; isMock: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/api/v1/predict/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storm_id: cycloneId, current_lat: 16.5, current_lon: 87.2 }),
      });
      if (!res.ok) throw new Error('Forecast API Error');
      const json = await res.json();

      const liveForecast: CycloneForecast = {
        cycloneId: json.storm_id || cycloneId,
        cycloneName: `Cyclone ${json.storm_id || cycloneId}`,
        rapidIntensificationProb: json.rapid_intensification?.ri_probability || 0.54,
        rapidIntensificationAlert: json.rapid_intensification?.ri_alert || false,
        trackWaypoints: (json.track_72h_forecast_cone || []).map((pt: { forecast_hour: number; latitude: number; longitude: number; cone_radius_km: number }) => ({
          hour: pt.forecast_hour,
          lat: pt.latitude,
          lon: pt.longitude,
          coneRadiusKm: pt.cone_radius_km,
        })),
        lastUpdatedUtc: new Date().toISOString(),
      };

      return { success: true, data: liveForecast, isMock: false };
    } catch {
      const fallback = MOCK_FORECASTS['cyc_aruna'] || null;
      return { success: true, data: fallback, isMock: true, error: 'Connecting via fallback cache.' };
    }
  },
};
