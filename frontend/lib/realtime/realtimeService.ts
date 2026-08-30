const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '';

type MessageCallback = (data: unknown) => void;

class RealtimeService {
  private socket: WebSocket | null = null;
  private isConnected = false;
  private listeners: Map<string, Set<MessageCallback>> = new Map();

  public getStatus(): { isConnected: boolean; wsUrl: string } {
    return {
      isConnected: this.isConnected,
      wsUrl: WS_URL,
    };
  }

  public connect(): void {
    if (!WS_URL || typeof window === 'undefined' || this.socket) return;

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        this.isConnected = true;
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const topic = payload.topic;
          if (topic && this.listeners.has(topic)) {
            this.listeners.get(topic)?.forEach((cb) => cb(payload.data));
          }
        } catch {
          // Ignore malformed WS frames
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.socket = null;
      };

      this.socket.onerror = () => {
        this.isConnected = false;
      };
    } catch {
      this.isConnected = false;
    }
  }

  public subscribe(topic: string, callback: MessageCallback): () => void {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic)?.add(callback);

    if (!this.isConnected && WS_URL) {
      this.connect();
    }

    return () => {
      this.listeners.get(topic)?.delete(callback);
    };
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }
}

export const realtimeService = new RealtimeService();
