const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface MLModel {
  id: string;
  name: string;
  version: string;
  status: 'ACTIVE' | 'RETRAINING' | 'OFFLINE';
  lastInference: string | null;
  inferenceLatencyMs: number | null;
  accuracy: number | null;
  f1Score: number | null;
  rmse: number | null;
}

export interface ModelAgreement {
  task: 'DETECTION' | 'INTENSITY' | 'RAPID_INTENSIFICATION' | 'TRACK';
  status: 'AGREEMENT' | 'MINOR_DISAGREEMENT' | 'DISAGREEMENT' | 'UNAVAILABLE';
  confidencePct: number | null;
}

export const modelApi = {
  async getModels(): Promise<{ success: boolean; data: MLModel[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const res = await fetch(`${API_URL}/api/models`);
      if (!res.ok) return { success: false, data: [], error: 'ML Model registry unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to connect to ML Model API.' };
    }
  },

  async getModelAgreement(): Promise<{ success: boolean; data: ModelAgreement[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const res = await fetch(`${API_URL}/api/models/agreement`);
      if (!res.ok) return { success: false, data: [], error: 'Model agreement service unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to retrieve model agreement matrix.' };
    }
  },
};
