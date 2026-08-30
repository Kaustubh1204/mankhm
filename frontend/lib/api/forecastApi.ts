import { MOCK_FORECASTS, MockForecast } from '../mock/forecastMock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export type CycloneForecast = MockForecast;

export const forecastApi = {
  async getForecast(cycloneId: string = 'cyc_aruna'): Promise<{ success: boolean; data: CycloneForecast | null; isMock: boolean; error?: string }> {
    if (!API_URL) {
      await new Promise((res) => setTimeout(res, 200));
      const forecast = MOCK_FORECASTS[cycloneId] || MOCK_FORECASTS['cyc_aruna'] || null;
      return { success: true, data: forecast, isMock: true };
    }
    try {
      const res = await fetch(`${API_URL}/api/forecasts/${cycloneId}`);
      if (!res.ok) return { success: false, data: MOCK_FORECASTS['cyc_aruna'] || null, isMock: true };
      const json = await res.json();
      return { success: true, data: json.data, isMock: false };
    } catch {
      return { success: false, data: MOCK_FORECASTS['cyc_aruna'] || null, isMock: true };
    }
  },
};
