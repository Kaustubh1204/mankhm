"""
Production Prediction Inference Server for Realtime & Batch Cyclone Intelligence.
Loads ONNX Runtime or PyTorch checkpoints to serve sub-15ms cyclone identification,
intensity estimation, OBB eye localization, 0-6h short track, and 72h synoptic track cone / RI alerts.
"""

import time
import os
import torch
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from src.ml.config import (
    REALTIME_CONFIG,
    BATCH_CONFIG,
    REALTIME_CHECKPOINT_DIR,
    BATCH_CHECKPOINT_DIR,
    ONNX_EXPORT_DIR,
)
from src.ml.models.detection_obb import CycloneOBBDetector
from src.ml.models.intensity_regressor import CycloneIntensityRegressor
from src.ml.models.track_forecaster import RealtimeTrackForecaster, BatchSynopticTrackForecaster

# Attempt ONNX Runtime import
try:
    import onnxruntime as ort
    HAS_ONNX_RUNTIME = True
except ImportError:
    HAS_ONNX_RUNTIME = False


app = FastAPI(
    title="Cyclone AI Prediction & Inference API",
    description="Sub-15ms AI/ML inference service for tropical cyclone identification, classification, and track prediction.",
    version="1.0.0",
)


# Global Model Cache
models_cache = {
    "device": "cpu",
    "use_onnx": False,
    "realtime_detector": None,
    "realtime_intensity": None,
    "realtime_track": None,
    "batch_synoptic": None,
}


@app.on_event("startup")
def load_inference_models():
    """ Load trained model checkpoints on server startup. """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    models_cache["device"] = str(device)
    print(f"[INFERENCE SERVER] Booting inference engine on: {device}")

    # Check for ONNX models first
    onnx_det_file = ONNX_EXPORT_DIR / "cyclone_detector_obb.onnx"
    onnx_track_file = ONNX_EXPORT_DIR / "realtime_track_forecaster.onnx"

    if HAS_ONNX_RUNTIME and onnx_det_file.exists() and onnx_track_file.exists():
        print("[INFERENCE SERVER] Loading ONNX Runtime Sessions for ultra-low latency...")
        try:
            models_cache["onnx_det_session"] = ort.InferenceSession(str(onnx_det_file))
            models_cache["onnx_track_session"] = ort.InferenceSession(str(onnx_track_file))
            models_cache["use_onnx"] = True
            print("[SUCCESS] ONNX Runtime sessions loaded successfully!")
        except Exception as err:
            print(f"[WARN] Failed loading ONNX session, falling back to PyTorch: {err}")

    # Load PyTorch Checkpoints (Fallback / Default)
    realtime_ckpt = REALTIME_CHECKPOINT_DIR / "realtime_speed_lane.pt"
    if realtime_ckpt.exists():
        print(f"[INFERENCE SERVER] Loading Realtime PyTorch checkpoint: {realtime_ckpt}")
        checkpoint = torch.load(realtime_ckpt, map_location=device)

        detector = CycloneOBBDetector(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
        detector.load_state_dict(checkpoint["detector"])
        detector.eval()

        intensity_model = CycloneIntensityRegressor(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
        intensity_model.load_state_dict(checkpoint["intensity"])
        intensity_model.eval()

        track_model = RealtimeTrackForecaster(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
        track_model.load_state_dict(checkpoint["track_forecaster"])
        track_model.eval()

        models_cache["realtime_detector"] = detector
        models_cache["realtime_intensity"] = intensity_model
        models_cache["realtime_track"] = track_model

    batch_ckpt = BATCH_CHECKPOINT_DIR / "batch_synoptic_lane.pt"
    if batch_ckpt.exists():
        print(f"[INFERENCE SERVER] Loading Batch PyTorch checkpoint: {batch_ckpt}")
        checkpoint_b = torch.load(batch_ckpt, map_location=device)

        batch_forecaster = BatchSynopticTrackForecaster(in_channels=len(BATCH_CONFIG["input_channels"])).to(device)
        batch_forecaster.load_state_dict(checkpoint_b["model"])
        batch_forecaster.eval()

        models_cache["batch_synoptic"] = batch_forecaster


# Request Payloads
class RealtimePredictionRequest(BaseModel):
    storm_id: Optional[str] = "ACTIVE_CYCLONE_01"
    ref_lat: float = 16.5
    ref_lon: float = 87.2
    # Optional input matrix sequence (T=4, C=3, H=256, W=256)
    sequence_tensor: Optional[List[List[List[List[float]]]]] = None


class BatchPredictionRequest(BaseModel):
    storm_id: Optional[str] = "ACTIVE_CYCLONE_01"
    current_lat: float = 16.5
    current_lon: float = 87.2
    # Optional multi-sensor fused tensor (T=12, C=5, H=256, W=256)
    fused_tensor: Optional[List[List[List[List[float]]]]] = None


@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "device": models_cache["device"],
        "use_onnx": models_cache["use_onnx"],
        "models_loaded": {
            "realtime_lane": models_cache["realtime_detector"] is not None or models_cache["use_onnx"],
            "batch_lane": models_cache["batch_synoptic"] is not None,
        },
    }


@app.post("/api/v1/predict/realtime")
def predict_realtime_lane(req: RealtimePredictionRequest):
    """
    Sub-15ms Realtime Speed Lane Prediction Endpoint.
    Detects cyclone eye (OBB), calculates intensity (MSW knots/Pressure), and projects 0-6h track.
    """
    start_time = time.perf_counter()
    device = torch.device(models_cache["device"])

    # Prepare input tensor
    if req.sequence_tensor is not None:
        input_tensor = torch.tensor(req.sequence_tensor, dtype=torch.float32).unsqueeze(0).to(device)
    else:
        # Synthetic tensor for fast API validation
        input_tensor = torch.randn(1, 4, len(REALTIME_CONFIG["input_channels"]), 256, 256, device=device)

    # Perform Inference
    if models_cache["realtime_detector"] is None and not models_cache["use_onnx"]:
        raise HTTPException(status_code=503, detail="Realtime models initializing or checkpoint missing.")

    with torch.no_grad():
        det_out = models_cache["realtime_detector"](input_tensor)
        int_out = models_cache["realtime_intensity"](input_tensor)
        track_out = models_cache["realtime_track"](input_tensor)

    # Parse Outputs
    obb_raw = det_out["obbs"][0, 0].cpu().numpy()  # [cx, cy, w, h, theta]
    intensity_raw = int_out["intensity_reg"][0].cpu().numpy()  # [msw_knots, pressure_hpa]
    track_delta_raw = track_out[0].cpu().numpy()  # [delta_lat, delta_lon]

    cat_idx = int(torch.argmax(int_out["category_logits"][0]).item())
    category_str = CycloneIntensityRegressor.IMD_CATEGORIES[min(cat_idx, 6)]

    msw_knots = float(np.abs(intensity_raw[0]))
    pressure_hpa = float(intensity_raw[1]) if intensity_raw[1] > 800 else 980.0

    # Map relative OBB to geographic center
    eye_center_lat = req.ref_lat + float((obb_raw[1] - 0.5) * 2.0)
    eye_center_lon = req.ref_lon + float((obb_raw[0] - 0.5) * 2.0)

    # Build 0-6 hour short track projection points
    short_track = []
    for h in range(1, 7):
        factor = h / 6.0
        short_track.append({
            "hour": h,
            "lat": round(req.ref_lat + float(track_delta_raw[0]) * factor, 4),
            "lon": round(req.ref_lon + float(track_delta_raw[1]) * factor, 4)
        })

    inference_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

    res = {
        "status": "SUCCESS",
        "storm_id": req.storm_id,
        "lane": "REALTIME_SPEED_LANE",
        "cadence_minutes": 15,
        "latency_ms": inference_ms,
        "sle_pass": inference_ms <= 15.0,
        "detection_obb": {
            "eye_center_lat": round(eye_center_lat, 4),
            "eye_center_lon": round(eye_center_lon, 4),
            "vortex_width_km": round(float(obb_raw[2] * 200.0), 2),
            "vortex_height_km": round(float(obb_raw[3] * 200.0), 2),
            "orientation_angle_deg": round(float(np.degrees(obb_raw[4])), 2),
        },
        "intensity": {
            "msw_knots": round(msw_knots, 1),
            "msw_kmh": round(msw_knots * 1.852, 1),
            "central_pressure_hpa": round(pressure_hpa, 1),
            "imd_category": category_str,
        },
        "short_term_track_6h": short_track,
    }

    # Automatically archive prediction data to Cloud Storage
    try:
        from src.storage.cloud_storage import cloud_archiver
        archive_path = cloud_archiver.archive_realtime_prediction(res)
        res["cloud_storage_archive"] = archive_path
    except Exception as err:
        print(f"[CLOUD ARCHIVE WARN] Realtime archiving error: {err}")

    return res


@app.post("/api/v1/predict/batch")
def predict_batch_lane(req: BatchPredictionRequest):
    """
    Batch Synoptic Lane Prediction Endpoint (6-Hour Cadence).
    Projects 72-Hour Track Forecast Cone (12 waypoints) and Rapid Intensification probability.
    """
    start_time = time.perf_counter()
    device = torch.device(models_cache["device"])

    if models_cache["batch_synoptic"] is None:
        raise HTTPException(status_code=503, detail="Batch synoptic model initializing or checkpoint missing.")

    if req.fused_tensor is not None:
        fused_tensor = torch.tensor(req.fused_tensor, dtype=torch.float32).unsqueeze(0).to(device)
    else:
        fused_tensor = torch.randn(1, 12, len(BATCH_CONFIG["input_channels"]), 256, 256, device=device)

    with torch.no_grad():
        out = models_cache["batch_synoptic"](fused_tensor)

    track_cone_raw = out["track_72h_cone"][0].cpu().numpy()  # [12, 2]
    ri_prob = float(out["rapid_intensification_prob"][0, 0].cpu().numpy())

    # Build 72-hour track forecast waypoints
    track_cone_72h = []
    for i in range(12):
        hour = (i + 1) * 6
        lat_pt = round(req.current_lat + float(track_cone_raw[i, 0]), 4)
        lon_pt = round(req.current_lon + float(track_cone_raw[i, 1]), 4)
        uncertainty_radius_km = round(15.0 + (i * 12.5), 1)  # Expanding forecast cone radius

        track_cone_72h.append({
            "forecast_hour": hour,
            "latitude": lat_pt,
            "longitude": lon_pt,
            "cone_radius_km": uncertainty_radius_km
        })

    inference_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

    res = {
        "status": "SUCCESS",
        "storm_id": req.storm_id,
        "lane": "BATCH_SYNOPTIC_LANE",
        "cadence_hours": 6,
        "latency_ms": inference_ms,
        "rapid_intensification": {
            "ri_probability": round(ri_prob, 4),
            "ri_alert": ri_prob >= 0.50,
            "definition": "+30 knots wind increase in 24 hours",
        },
        "track_72h_forecast_cone": track_cone_72h,
    }

    # Automatically archive prediction data to Cloud Storage
    try:
        from src.storage.cloud_storage import cloud_archiver
        archive_path = cloud_archiver.archive_batch_prediction(res)
        res["cloud_storage_archive"] = archive_path
    except Exception as err:
        print(f"[CLOUD ARCHIVE WARN] Batch archiving error: {err}")

    return res


@app.post("/api/v1/xai/gemini-bulletin")
def get_gemini_ai_bulletin(req: RealtimePredictionRequest):
    """
    Generates a Gemini AI Pro Meteorological Diagnostic Bulletin explaining predictions for IMD forecasters.
    """
    from src.ml.gemini_xai import generate_cyclone_meteorologist_report
    pred_result = predict_realtime_lane(req)
    bulletin_text = generate_cyclone_meteorologist_report(pred_result)

    return {
        "status": "SUCCESS",
        "storm_id": req.storm_id,
        "gemini_ai_bulletin": bulletin_text
    }


@app.get("/api/v1/storage/usage")
def get_r2_storage_usage():
    """
    Returns live Cloudflare R2 storage usage metrics (guaranteed < 9.0 GB).
    """
    from src.storage.r2_quota_manager import r2_quota_manager
    return r2_quota_manager.get_storage_usage()


@app.post("/api/v1/storage/cleanup")
def cleanup_r2_storage(days_to_keep: int = 14):
    """
    Executes storage cleanup, purging objects older than days_to_keep to maintain storage < 9.0 GB.
    """
    from src.storage.r2_quota_manager import r2_quota_manager
    return r2_quota_manager.execute_one_click_cleanup(days_to_keep=days_to_keep)


@app.get("/api/v1/storage/one-click-cleanup")
def one_click_cleanup(token: str = "auto_purge_confirm"):
    """
    One-Click Cleanup Endpoint triggered directly from email notifications or dashboard button.
    Purges data older than 14 days and returns instant HTML confirmation page.
    """
    from src.storage.r2_quota_manager import r2_quota_manager
    from fastapi.responses import HTMLResponse

    result = r2_quota_manager.execute_one_click_cleanup(days_to_keep=14)

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>R2 Storage One-Click Cleanup</title>
        <style>
            body {{ font-family: Arial, sans-serif; padding: 40px; background-color: #f8fafc; color: #1e293b; text-align: center; }}
            .card {{ max-width: 500px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }}
            .icon {{ font-size: 48px; margin-bottom: 10px; }}
            .success {{ color: #16a34a; font-weight: bold; font-size: 22px; }}
            .metric {{ background: #f1f5f9; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 14px; }}
            .btn {{ display: inline-block; padding: 10px 20px; background: #0284c7; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">✅</div>
            <div class="success">One-Click Storage Cleanup Complete!</div>
            <p>Cloudflare R2 storage has been successfully reclaimed.</p>
            
            <div class="metric">
                <p><strong>Purged Objects:</strong> {result['purged_objects_count']} files</p>
                <p><strong>Reclaimed Space:</strong> {result['reclaimed_mb']} MB ({result['reclaimed_gb']} GB)</p>
                <p><strong>Current Storage Usage:</strong> {result['updated_storage']['used_gb']} GB / 9.0 GB Cap</p>
            </div>

            <a href="https://mankhm-cyclone-edge.repo-mankhm.workers.dev" class="btn">Return to Cyclone Dashboard</a>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
