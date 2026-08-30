# Technical Specification Document
## Low-Latency Node.js Ingestion & MOSDAC API Engine

### 1. Architectural Strategy & Low-Latency Mechanisms
To achieve `< 4ms` latency between data arrival and AI inference:
1. **Zero TCP Handshake Overhead:** Use persistent WebSockets for client endpoints and keep-alive HTTP/2 sessions for upstream MOSDAC polling.
2. **In-Memory Ring Buffer:** Store extracted raw tensor arrays directly in Node.js V8 Process Memory (`SharedArrayBuffer` / `Buffer`). No intermediate disk I/O on the real-time hot path.
3. **Disabled WebSocket Deflation:** Set `perMessageDeflate: false` in Node.js `ws` server to bypass CPU compression overhead (saves 2–8ms per message).

### 2. External Integration: MOSDAC Download API (`mdapi`)
* **Endpoint Base:** `https://mosdac.gov.in`
* **Authentication:** OAuth2 Token exchange / Session Cookie initialization using configured `user_credentials`.
* **Search & Fetch Payload:**
  ```json
  {
    "user_credentials": {
      "username": "${MOSDAC_USERNAME}",
      "password": "${MOSDAC_PASSWORD}"
    },
    "search_parameters": {
      "datasetId": "3SIMG_L1B_STD",
      "count": 1
    }
  }