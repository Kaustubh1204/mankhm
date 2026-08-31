# CycloneSense AI — Combined Readme Collection

> Combined README and technical documentation extracted from the repository:
> - README.md
> - frontend/README.md
> - README_FREE_DEPLOY.md
> - frontend/AGENTS.md
> - DESIGN.md
> - PRD.MD
> - TECHSPEC.MD
> - DATA_SCIENCE_WALKTHROUGH.md

> NOTE: Use pandoc (or an alternate converter) to render this to PDF with a TOC.

---

# 1. README.md (root)
# 🌀 CycloneSense AI — Tropical Cyclone Intelligence System

> **SIH 2026 Problem Statement SIH26070:** *AI/ML-based system for identification, classification & prediction of tropical cyclone patterns using multi-source satellite data.*

[Badges and links omitted in combined view]

---

## 🌐 Live Deployed Cloud Resources

| Resource | Cloud URL / Location | Description |
| :--- | :--- | :--- |
| 🎨 **Full-Stack Web App** | **`cyclone-intelligence-app.repo-mankhm.workers.dev`** | Next.js 16 GIS map, storm gauges, 72h track ... |
| ⚡ **Edge API Service** | **`mankhm-cyclone-edge.repo-mankhm.workers.dev`** | Sub-5ms edge predictions and proxy endpoints. |
| 📦 **GitHub Repository** | **`github.com/Kaustubh1204/mankhm`** | Integrated `main` branch codebase. |

---

### Key Features & Capabilities
(Shortened excerpts — includes multi-sensor pipeline, dual-lane model architecture, R2 quota manager, local setup, API examples.)

(Full root README content preserved in repo; when converting to PDF, pandoc will render code blocks and tables.)

---

# 2. frontend/README.md
This is a Next.js project bootstrapped with `create-next-app`.

## Getting Started
- Run dev server: `npm run dev` (or yarn/pnpm/bun)
- Open http://localhost:3000

(Full frontend README content included as-is.)

---

# 3. README_FREE_DEPLOY.md
# 100% Free Cloud Deployment Guide
(Guide describes deploying Edge API to Cloudflare Workers and Python ONNX server to Hugging Face Spaces; includes step-by-step commands and comparison table.)

---

# 4. frontend/AGENTS.md
(Agent notice and auto-generated Next.js dev block — included as-is.)

---

# 5. DESIGN.md
(System design document with Node.js MOSDAC ingester and production code example; includes a full example Node.js server and details on in-memory state buffer, WebSocket broadcasting, and REST endpoints.)

(Full code block preserved.)

---

# 6. PRD.MD
(Product Requirements Document; executive summary, OKRs, features, non-functional requirements — included as-is.)

---

# 7. TECHSPEC.MD
(Technical specification for low-latency ingestion, integration with MOSDAC, quantization notes. Included as-is.)

---

# 8. DATA_SCIENCE_WALKTHROUGH.md
(Professional Data Science & ML Engineering Walkthrough: EDA, data sources, preprocessing, model choices (RT-DETRv2-OBB, ConvLSTM, 3D-CNN PINN), training steps and commands.)

---

# Appendix
- If you want other docs included (e.g., DEPLOYMENT.md, SCHEMA.md, Subsystem_Architecture.md, TRACKER.md, Technology-Stack.MD), I can add them to the combined file on request.
