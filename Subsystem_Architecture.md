3. Subsystem Architecture
┌──────────────────┐    HTTPS/REST     ┌────────────────────────┐
│  MOSDAC Portal   │ ───────────────>  │ MOSDAC Poller Worker   │
│ (mosdac.gov.in)  │  (15-min cycle)   │ (Node.js Axios Engine) │
└──────────────────┘                   └───────────┬────────────┘
                                                   │ Raw HDF5 / Payload Stream
                                                   ▼
┌──────────────────┐    Persistent     ┌────────────────────────┐
│ AI Model Worker  │ <───────────────  │ Node.js Stream Ingestor│
│ (Python/PyTorch) │   WSS (< 4ms)     │ (Memory Ring Buffer)   │
└──────────────────┘                   └───────────┬────────────┘
                                                   │ Parquet Dump
                                                   ▼
                                       ┌────────────────────────┐
                                       │  AWS S3 / PostGIS DB   │
                                       └────────────────────────┘