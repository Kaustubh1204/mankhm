# One-Click PowerShell GCP Cloud Run Deployment Script
param (
    [string]$ProjectId = "",
    [string]$Region = "asia-south1"
)

$ErrorActionPreference = "Stop"

# Ensure gcloud is in PATH
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    $GCloudPaths = @(
        "C:\Users\hs730\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin",
        "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin",
        "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin",
        "C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin"
    )
    foreach ($p in $GCloudPaths) {
        if (Test-Path $p) {
            $env:PATH = "$p;$env:PATH"
            break
        }
    }
}

if ([string]::IsNullOrEmpty($ProjectId)) {
    $ProjectId = (gcloud config get-value project 2>$null)
}

if ([string]::IsNullOrEmpty($ProjectId)) {
    Write-Error "[ERROR] GCP Project ID is not set. Run: gcloud config set project <YOUR_PROJECT_ID>"
    exit 1
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "DEPLOYING TROPICAL CYCLONE AI SYSTEM TO GCP CLOUD RUN (PowerShell)" -ForegroundColor Cyan
Write-Host "Project ID : $ProjectId" -ForegroundColor Yellow
Write-Host "Region     : $Region" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

# Step 1: Enable GCP Services
Write-Host "[1/4] Enabling required GCP APIs..." -ForegroundColor Green
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project=$ProjectId

# Step 2: Build & Push Python Container
Write-Host "[2/4] Building & Pushing Python AI Container..." -ForegroundColor Green
gcloud builds submit --tag "gcr.io/$ProjectId/cyclone-ai-inference:latest" . --project=$ProjectId

# Step 3: Deploy Python AI Service
Write-Host "[3/4] Deploying Python AI Service to Cloud Run..." -ForegroundColor Green
gcloud run deploy cyclone-ai-inference `
  --image "gcr.io/$ProjectId/cyclone-ai-inference:latest" `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 2 `
  --min-instances 0 `
  --max-instances 5 `
  --project=$ProjectId

$AiServiceUrl = (gcloud run services describe cyclone-ai-inference --platform managed --region $Region --format 'value(status.url)' --project=$ProjectId)
Write-Host "[SUCCESS] Python AI Service Live at: $AiServiceUrl" -ForegroundColor Green

# Step 4: Build & Deploy Node.js Service
Write-Host "[4/4] Deploying Node.js MOSDAC Ingestor to Cloud Run..." -ForegroundColor Green
gcloud builds submit --tag "gcr.io/$ProjectId/mosdac-ingester-server:latest" -f Dockerfile.node . --project=$ProjectId

gcloud run deploy mosdac-ingester-server `
  --image "gcr.io/$ProjectId/mosdac-ingester-server:latest" `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --memory 1Gi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 3 `
  --set-env-vars "AI_INFERENCE_URL=$AiServiceUrl" `
  --project=$ProjectId

$NodeServiceUrl = (gcloud run services describe mosdac-ingester-server --platform managed --region $Region --format 'value(status.url)' --project=$ProjectId)

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE! SYSTEM IS LIVE ON GCP CLOUD RUN" -ForegroundColor Green
Write-Host "Python AI Inference API : $AiServiceUrl" -ForegroundColor Yellow
Write-Host "Node.js MOSDAC Backend  : $NodeServiceUrl" -ForegroundColor Yellow
Write-Host "API Health Check        : $AiServiceUrl/health" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
