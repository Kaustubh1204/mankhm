const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface SystemNodeHealth {
  nodeId: string;
  name: string;
  cpuPercent: number | null;
  memoryPercent: number | null;
  gpuPercent: number | null;
  storagePercent: number | null;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  service: 'Ingestion' | 'Kafka' | 'Collector' | 'Processing' | 'ML' | 'API' | 'Database';
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
}

export const systemApi = {
  async getSystemHealth(): Promise<{ success: boolean; data: SystemNodeHealth[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const res = await fetch(`${API_URL}/api/system/health`);
      if (!res.ok) return { success: false, data: [], error: 'System health service unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to connect to system health service.' };
    }
  },

  async getLogs(filters?: { level?: string; service?: string }): Promise<{ success: boolean; data: SystemLog[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const params = new URLSearchParams(filters as Record<string, string>).toString();
      const res = await fetch(`${API_URL}/api/system/logs?${params}`);
      if (!res.ok) return { success: false, data: [], error: 'System log service unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to retrieve system logs.' };
    }
  },
};
