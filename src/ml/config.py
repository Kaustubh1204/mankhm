import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
CHECKPOINT_DIR = BASE_DIR / "checkpoints"

# Checkpoint Sub-Directories for Isolated Lanes
SSL_CHECKPOINT_DIR = CHECKPOINT_DIR / "ssl"
REALTIME_CHECKPOINT_DIR = CHECKPOINT_DIR / "realtime"
BATCH_CHECKPOINT_DIR = CHECKPOINT_DIR / "batch"
ONNX_EXPORT_DIR = CHECKPOINT_DIR / "onnx"

# Ensure directories exist
for folder in [DATA_DIR, CHECKPOINT_DIR, SSL_CHECKPOINT_DIR, REALTIME_CHECKPOINT_DIR, BATCH_CHECKPOINT_DIR, ONNX_EXPORT_DIR]:
    folder.mkdir(parents=True, exist_ok=True)

# Dataset Paths
REALTIME_DATA_DIR = DATA_DIR / "split" / "realtime"
BATCH_DATA_DIR = DATA_DIR / "split" / "batch"
IBTRACS_DATA_PATH = DATA_DIR / "raw" / "ibtracs" / "ibtracs_active.csv"

# Model Selection Configuration
# Options: "RT-DETRv2-OBB", "YOLOv8-OBB"
DETECTION_MODEL_TYPE = os.getenv("DETECTION_MODEL_TYPE", "RT-DETRv2-OBB")

# Realtime (Speed Lane) Configuration
REALTIME_CONFIG = {
    "cadence_minutes": 15,
    "input_channels": ["TIR1", "TIR2", "WV"],
    "image_size": (256, 256),
    "sequence_length": 4,  # 4 x 15-min = 1 hour history
    "forecast_horizon_hours": 6,  # 0-6 hour kinematic prediction
    "batch_size": 4,
    "learning_rate": 1e-4,
    "epochs": 50,
}

# Batch (Deep Synoptic Lane) Configuration
BATCH_CONFIG = {
    "cadence_hours": 6,
    "input_channels": ["INSAT_TIR", "GPM_IMERG", "OCEANSAT_WIND", "INCOIS_SST", "ERA5_PRESSURE"],
    "image_size": (256, 256),
    "sequence_length": 12,  # 12 x 30-min = 6 hours history
    "forecast_horizon_hours": 72,  # 72 hour track forecast cone
    "batch_size": 2,
    "learning_rate": 5e-5,
    "epochs": 100,
    "rapid_intensification_threshold_knots": 30,  # +30 knots in 24 hours
}

# Self-Supervised Learning (SSL) Pretraining Config
SSL_CONFIG = {
    "mask_ratio": 0.75,
    "patch_size": 16,
    "encoder_embed_dim": 768,
    "epochs": 100,
    "batch_size": 32,
    "learning_rate": 1e-3,
}

# GCP Cloud & Storage Config
GCP_CONFIG = {
    "gcs_bucket_name": os.getenv("GCP_STORAGE_BUCKET", "mankhm-cyclone-checkpoints"),
    "use_gcs_checkpoints": os.getenv("USE_GCS_CHECKPOINTS", "False").lower() in ("true", "1"),
    "target_latency_ms": 15.0,  # Sub-15ms inference target
}
