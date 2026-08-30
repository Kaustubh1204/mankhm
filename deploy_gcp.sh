#!/bin/bash
# ==============================================================================
# ONE-CLICK GCP CLOUD RUN DEPLOYMENT SCRIPT
# Uses GCP $300 Free Credits to deploy Python AI Inference & Node.js MOSDAC Engine
# with Scale-to-Zero ($0.00 idle cost).
# ==============================================================================

set -e

# Default Settings
PROJECT_ID=${GCP_PROJECT_ID:-"$(gcloud config get-value project 2>/dev/null)"}
REGION=${GCP_REGION:-"asia-south1"} # Mumbai / South Asia region for lowest latency to ISRO/IMD

if [ -z "$PROJECT_ID" ]; then
  echo "[ERROR] GCP_PROJECT_ID is not set. Run: gcloud config set project <YOUR_PROJECT_ID>"
  exit 1
fi

echo "======================================================================"
echo "DEPLOYING TROPICAL CYCLONE AI SYSTEM TO GCP CLOUD RUN"
echo "Project ID : $PROJECT_ID"
echo "Region     : $REGION"
echo "======================================================================"

# Enable GCP Cloud Run & Artifact Registry APIs
echo "[1/4] Enabling required GCP APIs (Cloud Run, Artifact Registry, Cloud Build)..."
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project="$PROJECT_ID"

# Step 2: Build & Push Python AI Inference Server Container
echo "[2/4] Building & Pushing Python AI Inference Container..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/cyclone-ai-inference:latest" --dockerfile=Dockerfile . --project="$PROJECT_ID"

# Step 3: Deploy Python AI Inference Server to GCP Cloud Run (Scale-to-Zero)
echo "[3/4] Deploying Python AI Inference Service to Cloud Run..."
gcloud run deploy cyclone-ai-inference \
  --image "gcr.io/$PROJECT_ID/cyclone-ai-inference:latest" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 5 \
  --project="$PROJECT_ID"

AI_SERVICE_URL=$(gcloud run services describe cyclone-ai-inference --platform managed --region "$REGION" --format 'value(status.url)' --project="$PROJECT_ID")
echo "[SUCCESS] Python AI Service Live at: $AI_SERVICE_URL"

# Step 4: Build & Deploy Node.js MOSDAC Ingestor Server
echo "[4/4] Building & Deploying Node.js MOSDAC Ingestor to Cloud Run..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/mosdac-ingester-server:latest" --dockerfile=Dockerfile.node . --project="$PROJECT_ID"

gcloud run deploy mosdac-ingester-server \
  --image "gcr.io/$PROJECT_ID/mosdac-ingester-server:latest" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars "AI_INFERENCE_URL=$AI_SERVICE_URL" \
  --project="$PROJECT_ID"

NODE_SERVICE_URL=$(gcloud run services describe mosdac-ingester-server --platform managed --region "$REGION" --format 'value(status.url)' --project="$PROJECT_ID")

echo "======================================================================"
echo "🎉 DEPLOYMENT COMPLETE! SYSTEM IS LIVE ON GCP CLOUD RUN"
echo "======================================================================"
echo "Python AI Inference API : $AI_SERVICE_URL"
echo "Node.js MOSDAC Backend  : $NODE_SERVICE_URL"
echo "API Health Check        : $AI_SERVICE_URL/health"
echo "Realtime AI Endpoint    : $AI_SERVICE_URL/api/v1/predict/realtime"
echo "Batch 72h Track Endpoint: $AI_SERVICE_URL/api/v1/predict/batch"
echo "======================================================================"
