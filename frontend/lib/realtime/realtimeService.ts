type RealtimeEventType = 'CYCLONE_TELEMETRY' | 'FORECAST_UPDATE' | 'ALERT_TRIGGER' | 'RISK_UPDATE';

type RealtimeListener = (data: unknown) => void;

/**
 * Realtime Event Bus Architecture
 * Ready for WebSocket or Server-Sent Events (SSE) integration without client polling.
 */
class RealtimeService {
  private listeners: Map<RealtimeEventType, Set<RealtimeListener>> = new Map();
  private ws: WebSocket | null = null;
  private isConnected = false;

  constructor() {
    this.listeners = new Map();
  }

  public subscribe(eventType: RealtimeEventType, listener: RealtimeListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(listener);

    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public emit(eventType: RealtimeEventType, data: unknown): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(data);
        } catch (err) {
          console.error(`[RealtimeService] Error executing listener for ${eventType}:`, err);
        }
      });
    }
  }

  public connect(wsUrl?: string): void {
    if (this.isConnected || !wsUrl) {
      return;
    }

    try {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => {
        this.isConnected = true;
      };
      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type && payload.data) {
            this.emit(payload.type as RealtimeEventType, payload.data);
          }
        } catch {
          // Ignore invalid frames
        }
      };
      this.ws.onclose = () => {
        this.isConnected = false;
        this.ws = null;
      };
    } catch {
      this.isConnected = false;
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}

export const realtimeService = new RealtimeService();
