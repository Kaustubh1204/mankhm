const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface TelemetrySource {
  id: string;
  name: string;
  category: 'SATELLITE' | 'MICROWAVE' | 'WIND' | 'ATMOSPHERIC' | 'BUOY' | 'TRACK';
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  lastReceived: string | null;
  latencyMs: number | null;
  observationTimestamp: string | null;
}

export const telemetryApi = {
  async getTelemetrySources(): Promise<{ success: boolean; data: TelemetrySource[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const res = await fetch(`${API_URL}/api/telemetry/sources`);
      if (!res.ok) return { success: false, data: [], error: 'Telemetry service unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to connect to telemetry service.' };
    }
  },
};
