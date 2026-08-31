```markdown
# Implementation Task Tracker

### Milestone 1: Environment & Auth Infrastructure
- [x] Configure `.env` structure for MOSDAC credentials (`MOSDAC_USERNAME`, `MOSDAC_PASSWORD`).
- [ ] Implement robust token retry logic handling MOSDAC's 3-failed-attempt lockout policy.
- [ ] Test HTTP/2 Keep-Alive connection pooling for MOSDAC REST endpoints.

### Milestone 2: Low-Latency Pipeline Core
- [x] Create Node.js Express + `ws` WebSocket streaming engine.
- [x] Implement sub-millisecond timer monitoring (`process.hrtime`).
- [x] Build In-Memory Buffer (`StateBuffer`) to eliminate disk I/O latency.
- [ ] Connect Python PyTorch client via WebSocket for live tensor ingestion.

### Milestone 3: Storage & Data Reconciliation
- [ ] Deploy Apache Spark job script for merging Real-time (15-min) and Batch (6-hr) streams.
- [ ] Provision AWS S3 Bucket with Hive-compliant directory structure.
- [ ] Setup PostgreSQL + PostGIS spatial tables for GIS vector rendering.

### Milestone 4: API & Dashboard Integration
- [x] Implement `/api/v1/model/latest-frame` REST endpoint.
- [x] Implement `/api/v1/cyclone/active-track` REST endpoint.
- [ ] Build React + Mapbox GL JS frontend consuming WebSocket streams.
- [ ] Conduct end-to-end SLA stress test targeting `< 4ms` pipeline throughput.