const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface PipelineStage {
  id: string;
  name: string;
  type: 'REALTIME' | 'BATCH' | 'KAFKA' | 'PROCESSING';
  status: 'HEALTHY' | 'WARNING' | 'FAILED' | 'OFFLINE';
  latencyMs: number | null;
  lastUpdate: string | null;
  processedCount: number | null;
  rejectedCount: number | null;
}

export interface KafkaTopic {
  name: string;
  partitions: number | null;
  producerRate: number | null;
  consumerRate: number | null;
  lag: number | null;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
}

export const pipelineApi = {
  async getPipelineStages(): Promise<{ success: boolean; data: PipelineStage[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const res = await fetch(`${API_URL}/api/pipelines/stages`);
      if (!res.ok) return { success: false, data: [], error: 'Pipeline service unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to retrieve pipeline telemetry.' };
    }
  },

  async getKafkaTopics(): Promise<{ success: boolean; data: KafkaTopic[]; error?: string }> {
    if (!API_URL) return { success: true, data: [] };
    try {
      const res = await fetch(`${API_URL}/api/kafka/topics`);
      if (!res.ok) return { success: false, data: [], error: 'Kafka monitoring service unavailable.' };
      const json = await res.json();
      return { success: true, data: json.data || [] };
    } catch {
      return { success: false, data: [], error: 'Unable to connect to Kafka monitoring API.' };
    }
  },
};
