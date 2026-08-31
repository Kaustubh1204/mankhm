# 100% Free Cloud Deployment Guide (Zero Billing & Zero Credit Card Required)

This guide provides instructions to deploy your **Tropical Cyclone AI System** completely for **FREE** using **Cloudflare Workers** and **Hugging Face Spaces**. 

Neither platform requires any credit card or billing account setup.

---

## Architecture Overview

```
                               ┌──────────────────────────────────┐
                               │     Cloudflare Workers Edge      │
                               │  (100,000 Free Requests/Day)     │
                               │  - Sub-5ms Edge Cache & API      │
                               └────────────────┬─────────────────┘
                                                │
                                                ▼
                               ┌──────────────────────────────────┐
                               │    Hugging Face Docker Space     │
                               │  (100% Free CPU/GPU Containers)  │
                               │  - Python ONNX Inference Server  │
                               └──────────────────────────────────┘
```

---

## Part 1: Deploy to Cloudflare Workers (Edge API - 100,000 Free Requests/Day)

### **Step 1: Install Wrangler (Cloudflare CLI)**
```bash
npm install -g wrangler
```

### **Step 2: Authenticate with Cloudflare (Free Account)**
```bash
npx wrangler login
```
*(This opens a browser window. Simply log in or create a free Cloudflare account with your email. No credit card requested!)*

### **Step 3: Deploy to Cloudflare Edge**
```bash
npx wrangler deploy
```

#### **What You Get Immediately:**
* **Live Edge HTTPS URL**: `https://mankhm-cyclone-edge.<your-subdomain>.workers.dev`
* **Health Check**: `https://mankhm-cyclone-edge.<your-subdomain>.workers.dev/health`
* **Realtime API Endpoint**: `https://mankhm-cyclone-edge.<your-subdomain>.workers.dev/api/v1/predict/realtime`
* **Batch 72h Track Endpoint**: `https://mankhm-cyclone-edge.<your-subdomain>.workers.dev/api/v1/predict/batch`

---

## Part 2: Deploy Python ONNX AI Server on Hugging Face Spaces (100% Free Container)

1. Create a free account at [Hugging Face](https://huggingface.co/join).
2. Click **New Space**: [huggingface.co/new-space](https://huggingface.co/new-space)
3. Fill in the details:
   * **Space Name**: `mankhm-cyclone-ai`
   * **SDK**: Select **Docker** (Blank)
   * **Hardware**: Select **CPU Basic (Free)**
4. Clone and push your project to Hugging Face:
   ```bash
   git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/mankhm-cyclone-ai
   git push hf feature/cyclone-pipeline-dev:main
   ```

Hugging Face will automatically build your `Dockerfile` and give you a live free HTTPS API endpoint (e.g. `https://YOUR_USERNAME-mankhm-cyclone-ai.hf.space/health`)!

---

## Comparison: Free Tier Limits

| Cloud Platform | Free Tier Invocations | Requires Credit Card? | Latency |
|---|---|---|---|
| **Cloudflare Workers** | **100,000 Requests / Day** | ❌ NO | `< 5.0 ms` |
| **Hugging Face Spaces** | **24/7 Free Container** | ❌ NO | `< 25.0 ms` |
| **Render.com / Railway** | **750 Hours / Month** | ❌ NO | `< 40.0 ms` |
