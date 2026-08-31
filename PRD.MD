# Product Requirement Document (PRD)
## Project Name: Real-Time MOSDAC Satellite Ingestion & AI Cyclone Intelligence Pipeline

### 1. Executive Summary
The goal of this system is to bridge ISRO's MOSDAC (Meteorological & Oceanographic Satellite Data Archival Centre) raw satellite data repositories with an automated, sub-4ms AI inference engine. The platform automatically authenticates against MOSDAC, polls live INSAT-3D/3DR/3DS imagery and OceanSat-3 scatterometer products, streams ingestion through dual-lane processing (Real-time and Batch), and exposes low-latency WebSocket & REST APIs for downstream AI models and visualization dashboards.

### 2. Objectives & Key Results (OKRs)
* **Ingestion Latency:** Sub-4ms internal buffer delivery to AI runtime upon packet receipt.
* **MOSDAC Polling Cadence:** Automatic ingestion matching MOSDAC’s 15-minute full-disk refresh cycle.
* **Authentication Reliability:** Automate session re-tokenization via MOSDAC API without credential lockout (handling the 3-strike/1-hour lock policy).
* **System Uptime:** 99.9% operational readiness for live cyclone tracking over the Bay of Bengal & Arabian Sea.

### 3. Core Features & User Requirements
* **FR-1 Automated MOSDAC Data Downloader:** Use valid user credentials (`username`/`password`) to query MOSDAC catalog APIs (`datasetId`: e.g., `3SIMG_L1B_STD`, `3DIMG_L1B_STD`) and pull incoming HDF5/NetCDF files.
* **FR-2 Dual-Stream Processing Engine (Lambda Architecture):**
  * **Real-time Stream (Speed Layer):** Extract Thermal Infrared (TIR-1) matrices every 15 minutes for instant model inference.
  * **Batch Stream (Batch Layer):** Every 6 hours, aggregate multi-sensor profiles (Scatterometer + Microwave) into an S3 Data Lake.
* **FR-3 Ultra-Low Latency Internal Streaming:** High-performance Node.js WebSocket stream delivering preprocessed tensors to model workers with `< 4ms` latency.
* **FR-4 Automated Re-reconciliation & Deduplication:** Merge real-time predictions with batch physics runs using Apache Spark, saving output in Hive-partitioned Parquet files.
* **FR-5 Production API Routes:** Expose REST and WebSocket routes for AI inference and GIS dashboard integration.

### 4. Non-Functional Requirements (NFRs)
* **Performance:** Processing pipeline overhead must remain `< 4ms` using Node.js `process.hrtime` tracking.
* **Storage Optimization:** Columnar Parquet compression in S3 (`s3://cyclone-data-lake/curated/`).
* **Security:** Credentials stored exclusively in environment variables (`.env`); HTTPS/WSS encryption for external streams.