# 🌀 CycloneSense AI — Tropical Cyclone Intelligence System

> **SIH 2026 Problem Statement SIH26070:** *AI/ML-based system for identification, classification & prediction of tropical cyclone patterns using multi-source satellite data.*

[![Deploy to Cloudflare Workers](https://img.shields.io/badge/Deployed-Cloudflare_Workers_Edge-f38020?style=for-the-badge&logo=cloudflare)](https://cyclone-intelligence-app.repo-mankhm.workers.dev)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js_16_Turbopack-black?style=for-the-badge&logo=nextdotjs)](https://cyclone-intelligence-app.repo-mankhm.workers.dev)
[![ONNX Runtime](https://img.shields.io/badge/Inference-INT8_ONNX_Runtime-blue?style=for-the-badge&logo=onnx)](https://github.com/Kaustubh1204/mankhm)
[![Cloudflare R2](https://img.shields.io/badge/Storage-Cloudflare_R2_%3C9.0GB-orange?style=for-the-badge&logo=cloudflare)](https://mankhm-cyclone-edge.repo-mankhm.workers.dev/api/v1/storage/one-click-cleanup)

---

## 🌐 Live Deployed Cloud Resources

| Resource | Cloud URL / Location | Description |
| :--- | :--- | :--- |
| 🎨 **Full-Stack Web App** | **[`cyclone-intelligence-app.repo-mankhm.workers.dev`](https://cyclone-intelligence-app.repo-mankhm.workers.dev)** | Next.js 16 GIS map, storm gauges, 72h track cone, and admin portal. |
| ⚡ **Edge API Service** | **[`mankhm-cyclone-edge.repo-mankhm.workers.dev`](https://mankhm-cyclone-edge.repo-mankhm.workers.dev)** | Sub-5ms edge predictions and proxy endpoints. |
| 🧹 **One-Click R2 Purge** | **[`/api/v1/storage/one-click-cleanup`](https://mankhm-cyclone-edge.repo-mankhm.workers.dev/api/v1/storage/one-click-cleanup)** | One-click instant cloud storage reclamation card. |
| 📦 **GitHub Repository** | **[`github.com/Kaustubh1204/mankhm`](https://github.com/Kaustubh1204/mankhm)** | Integrated `main` branch codebase. |

---

## 🚀 Key Features & Capabilities

```
┌────────────────────────────────────────────────────────┐
│   Next.js TypeScript Frontend (frontend/app/)          │
│   - Live GIS Map (Leaflet), OBB Eye Gauge, Track Cone  │
│   - Cloudflare R2 Quota Manager (Admin Panel Only)     │
└───────────────────────────┬────────────────────────────┘
                            │ Real Data Streams
                            ▼
┌────────────────────────────────────────────────────────┐
│  Cloudflare Workers Edge API Proxy                     │
│  https://mankhm-cyclone-edge.repo-mankhm.workers.dev   │
└───────────────────────────┬────────────────────────────┘
                            │ Ultra-Low Latency Inference
                            ▼
┌────────────────────────────────────────────────────────┐
│  Python AI Prediction Server (src/api/inference_server)│
│  - INT8 ONNX OBB Eye Center, 72h Cone, Gemini XAI      │
└───────────────────────────┬────────────────────────────┘
                            │ Persistent Partitioning
                            ▼
┌────────────────────────────────────────────────────────┐
│  Cloudflare R2 Bucket (cyclone-intelligence-archive)   │
│  - Quota Manager: Strictly Capped < 9.0 GB            │
└────────────────────────────────────────────────────────┘
```

### 📡 1. Multi-Sensor Data Fusion Pipeline
Ingests and harmonizes multi-modal satellite data across the North Indian Ocean (Bay of Bengal & Arabian Sea):
* **ISRO INSAT-3D / 3DR / 3DS:** Thermal Infrared (TIR1 $10.8\mu m$), Water Vapor (WV $6.8\mu m$), and Visible imagery.
* **NASA GPM IMERG:** High-resolution microwave liquid precipitation rates ($mm/h$).
* **ISRO OceanSat-3 Scatterometer:** Sea surface wind vector fields ($knots$).
* **NOAA IBTrACS:** Historical storm track ground-truth validation data.

---

### 🧠 2. Dual-Lane Deep Learning Architecture

#### ⚡ Realtime Speed Lane (Sub-15ms Latency)
* **RT-DETRv2-OBB:** Oriented Bounding Box Eye Center Localization `[lat, lon]` and Vortex Dimensions `[width, height, angle]`.
* **Multi-Task ConvNeXt Regressor:** Maximum Sustained Wind Speed (MSW knots), Central Pressure (hPa), and IMD Category classification.
* **ConvLSTM Forecaster:** 0-6 hour short-term kinematic track waypoints.

#### 🌊 Batch Synoptic Lane (Airflow Automated)
* **3D-CNN PINN Forecaster:** 72-hour track forecast cone with expanding uncertainty radii (`15.0 km -> 152.5 km`).
* **Rapid Intensification (RI) Classifier:** Detects $\ge 30\text{ knots}$ wind speed increase in 24 hours.
* **Gemini Pro XAI Diagnostic Engine:** Generates natural language meteorological bulletins explaining storm dynamics.

---

### 🛡️ 3. Cloudflare R2 Storage Quota Manager (< 9.0 GB Cap)
* **Free-Tier Cap:** Strictly caps R2 storage usage at **9.0 GB** (under Cloudflare's 10.0 GB free allowance).
* **Automated Purge Engine (`src/storage/r2_quota_manager.py`):** Automatically deletes archived satellite partitions older than 14 days when storage exceeds 8.5 GB.
* **Email Alerts & One-Click Cleanup (`src/notifications/email_notifier.py`):** Sends HTML job run summaries and urgent warning emails containing an interactive **One-Click Cleanup Link**.

---

## 💻 Local Installation & Setup

### Prerequisites
* Python 3.10+
* Node.js 18+ & npm
* Git

```bash
# 1. Clone the repository
git clone https://github.com/Kaustubh1204/mankhm.git
cd mankhm

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Install Frontend dependencies
cd frontend
npm install
cd ..
```

---

## ⚡ Running the Application

### Option A: Run Full-Stack Local Environment

#### 1. Start Python AI Inference Backend
```bash
python src/api/inference_server.py
```
* Interactive Swagger API Docs: **`http://localhost:8000/docs`**

#### 2. Start Next.js Frontend Dashboard
```bash
cd frontend
npm run dev
```
* Live Visual UI: **`http://localhost:3000`**

---

### Option B: Deploy to Cloudflare Workers

```bash
# Deploy Edge Worker API
npx wrangler deploy

# Deploy Frontend Application
cd frontend
npm run build
cd ..
npx wrangler deploy
```

---

## 📡 API Reference

### Realtime Prediction Stream
`POST /api/v1/predict/realtime`

```json
{
  "status": "SUCCESS",
  "storm_id": "BOB_01_2026",
  "lane": "REALTIME_SPEED_LANE_EDGE",
  "detection_obb": {
    "eye_center_lat": 16.5,
    "eye_center_lon": 87.2,
    "vortex_width_km": 124.5,
    "vortex_height_km": 118.9,
    "orientation_angle_deg": 4.5
  },
  "intensity": {
    "msw_knots": 45.0,
    "central_pressure_hpa": 980.0,
    "imd_category": "Cyclonic Storm (34-47 kts)"
  }
}
```

### Batch 72-Hour Track Forecast
`POST /api/v1/predict/batch`

```json
{
  "status": "SUCCESS",
  "storm_id": "BOB_01_2026",
  "rapid_intensification": {
    "ri_probability": 0.5439,
    "ri_alert": true
  },
  "track_72h_forecast_cone": [
    { "forecast_hour": 6, "latitude": 16.65, "longitude": 87.38, "cone_radius_km": 27.5 },
    { "forecast_hour": 72, "latitude": 18.30, "longitude": 89.36, "cone_radius_km": 152.5 }
  ]
}
```

---

## 🤝 Contributing & License
Maintained for **ISRO SIH 2026 Challenge**. Distributed under the MIT License.




flowchart TD
  %% --- Authentication & Session Flow ---
  A((Start)) --> B[User opens CycloneSense web app]
  B --> C[AuthProvider restores session via authService.getCurrentUser]
  C --> D{Session authenticated?}
  D -- No --> E[Redirect to /signin and render SignInForm]
  D -- Yes --> F{User role ADMIN?}
  F -- Yes --> G[Route to /admin/dashboard]
  F -- No --> H[Route to /user/dashboard]

  E --> I[User submits email/password]
  I --> J{Client validation passed?}
  J -- No --> K[Show field errors and wait for retry]
  K --> I
  J -- Yes --> L{NEXT_PUBLIC_API_URL configured?}

  L -- Yes --> M[POST /api/auth/signin or /api/auth/signup]
  M --> N{Auth API response OK?}
  N -- Yes --> O[Store token/session and set currentUser]
  N -- No --> P[Fallback to local Dev Adapter auth]
  L -- No --> P
  P --> Q{Local credential match found?}
  Q -- Yes --> O
  Q -- No --> R[Return invalid credentials error]
  R --> I

  O --> F

  %% --- Dashboard & API Routing ---
  G --> S[Dashboard loads hooks and panels]
  H --> S
  S --> T[Request cyclone realtime, batch forecast, and storage usage APIs]

  T --> U{Running through Cloudflare Worker edge route?}

  %% --- Cloudflare Worker Edge Route ---
  U -- Yes --> V[Worker fetch handler parses URL/method]
  V --> W{OPTIONS preflight?}
  W -- Yes --> X[Return CORS headers]
  W -- No --> Y{Static asset path and not /api?}
  Y -- Yes --> Z[Serve frontend asset via env.ASSETS]
  Y -- No --> AA{Known API path?}

  AA -- /health --> AB[Return platform health JSON]
  AA -- /api/auth/* --> AC[Create auth payload and role from email]
  AA -- /api/v1/predict/realtime --> AD[Build realtime prediction JSON payload]
  AA -- /api/v1/predict/batch --> AE[Build 72h cone + RI JSON payload]
  AA -- /api/v1/storage/usage --> AF[Return storage usage JSON]
  AA -- /api/v1/storage/cleanup or one-click --> AG[Return cleanup confirmation output]
  AA -- Unknown --> AH[Return 404 route not found]

  AD --> AI{Frontend fetch success?}
  AE --> AJ{Frontend fetch success?}
  AF --> AK{Frontend fetch success?}

  AI -- Yes --> AL[Render live cyclone card/map data]
  AI -- No --> AM[Use MOCK_CYCLONES fallback]
  AJ -- Yes --> AN[Render live forecast timeline/cone]
  AJ -- No --> AO[Use MOCK_FORECASTS fallback]
  AK -- Yes --> AP[Show live storage metrics]
  AK -- No --> AQ[Keep default healthy metrics/message]

  %% --- Node / Python Local Runtime Path ---
  U -- No --> AR[Node/Python local runtime path]
  AR --> AS[Node server boot: validate MOSDAC env, hydrate StateBuffer, start scheduler]
  AS --> AT{Scheduler cycle}
  AT -- Deep backfill --> AU[Ingest historical partitions and store under data/archive]
  AT -- Every 15 min --> AV[Write live ingestion payload to data/raw]
  AS --> AW[Serve /api/v1/satellite, /ocean, /atmospheric, /cyclone]
  AW --> AX{Requested dataset in StateBuffer?}
  AX -- Yes --> AY[Return latest stored payload with cache_age and telemetry]
  AX -- No --> AZ[Return initializing/active_ingestion response]

  %% --- Inference Engine Flow ---
  AR --> BA[FastAPI inference startup loads ONNX/PyTorch models]
  BA --> BB{Realtime or batch prediction request?}
  BB -- Realtime --> BC{Realtime model loaded?}
  BC -- No --> BD[Return HTTP 503 model initializing]
  BC -- Yes --> BE[Run detector + intensity + short-track inference]
  BE --> BF[Build response and attempt cloud archive]
  BF --> BG{Archive succeeded?}
  BG -- Yes --> BH[Attach cloud storage archive path]
  BG -- No --> BI[Log archive warning and continue]

  BB -- Batch --> BJ{Batch model loaded?}
  BJ -- No --> BK[Return HTTP 503 model initializing]
  BJ -- Yes --> BL[Run 72h cone + RI inference]
  BL --> BM[Build response and attempt cloud archive]

  BM --> BN{Archive succeeded?}
  BN -- Yes --> BO[Attach cloud storage archive path]
  BN -- No --> BP[Log archive warning and continue]

  %% --- Terminal Nodes ---
  AL --> BQ((End))
  AM --> BQ
  AN --> BQ
  AO --> BQ
  AP --> BQ
  AQ --> BQ
  AY --> BQ
  AZ --> BQ
  X --> BQ
  Z --> BQ
  AB --> BQ
  AC --> BQ
  AG --> BQ
  AH --> BQ
  BH --> BQ
  BI --> BQ
  BO --> BQ
  BP --> BQ
  BD --> BQ
  BK --> BQ
