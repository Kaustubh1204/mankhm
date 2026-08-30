# Cloud Deployment Guide: GCP Cloud Run, Docker & Cloudflare Edge

This document outlines the step-by-step instructions to deploy the **Tropical Cyclone AI System** to the cloud using **Google Cloud Platform (GCP $300 Free Credits)** with **Scale-to-Zero ($0.00 idle cost)**, as well as alternative serverless cloud options (Hugging Face Spaces, Railway, Render, Docker Compose).

---

## Option 1: GCP Cloud Run Deployment (Recommended - $300 Free Credits)

GCP Cloud Run provides serverless container execution with auto-scaling to zero (`--min-instances=0`). When no active cyclone feed is being processed, server costs drop to **$0.00**.

### **Prerequisites:**
1. Install [Google Cloud SDK (`gcloud` CLI)](https://cloud.google.com/sdk/docs/install).
2. Authenticate and set your GCP Project ID:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```

### **One-Command Automated Deployment:**

* **Linux / macOS / Cloud Shell:**
  ```bash
  chmod +x deploy_gcp.sh
  ./deploy_gcp.sh
  ```

* **Windows PowerShell:**
  ```powershell
  .\deploy_gcp.ps1 -ProjectId YOUR_GCP_PROJECT_ID
  ```

### **What the Script Does:**
1. Enables GCP Cloud Run, Artifact Registry, and Cloud Build APIs.
2. Submits the Python AI Inference container (`Dockerfile`) to Cloud Build and deploys to Cloud Run.
3. Submits the Node.js MOSDAC Backend container (`Dockerfile.node`) to Cloud Build and links the AI Inference URL via environment variables.
4. Outputs live public HTTPS URLs for your endpoints.

---

## Option 2: Docker Compose Deployment (Local VM / GCP Compute Engine)

If you are running on a virtual machine (e.g., GCP Compute Engine Spot Instance or AWS EC2):

```bash
# 1. Build and start containers in detached mode
docker-compose up -d --build

# 2. Check running container health
docker-compose ps

# 3. View live logs
docker-compose logs -f
```

---

## Option 3: Hugging Face Spaces / Railway / Render (Free Alternatives)

### **Hugging Face Spaces (Free GPU/CPU for Python AI Inference):**
1. Create a new Docker Space on [Hugging Face Spaces](https://huggingface.co/new-space).
2. Push your repository to the Space remote:
   ```bash
   git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/cyclone-ai-inference
   git push hf feature/cyclone-pipeline-dev:main
   ```

---

## Post-Deployment API Verification

Once deployed, verify your endpoints using `curl` or Postman:

```bash
# 1. Health Check
curl -X GET https://<YOUR-CLOUD-RUN-URL>/health

# 2. Realtime Cyclone Prediction Endpoint (15-min cadence)
curl -X POST https://<YOUR-CLOUD-RUN-URL>/api/v1/predict/realtime \
  -H "Content-Type: application/json" \
  -d '{"storm_id": "BOB_01_2026", "ref_lat": 16.5, "ref_lon": 87.2}'

# 3. Batch 72-Hour Track & RI Alert Endpoint (6-hr cadence)
curl -X POST https://<YOUR-CLOUD-RUN-URL>/api/v1/predict/batch \
  -H "Content-Type: application/json" \
  -d '{"storm_id": "BOB_01_2026", "current_lat": 16.5, "current_lon": 87.2}'
```
