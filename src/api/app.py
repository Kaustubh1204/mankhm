from pathlib import Path
import json

import numpy as np
from fastapi import FastAPI, HTTPException


# =========================================================
# Application
# =========================================================

app = FastAPI(
    title="Cyclone Prediction Data API",
    version="1.0.0"
)


# =========================================================
# Data directories
# =========================================================

BATCH_DIR = Path(
    "data/processed/batch"
)

REALTIME_DIR = Path(
    "data/processed/realtime"
)

SEQUENCE_DIR = Path(
    "data/ml/sequences"
)


# =========================================================
# Helper functions
# =========================================================

def load_npy_file(file_path):

    try:

        array = np.load(
            file_path
        )

        return array

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Could not load {file_path.name}: {error}"
        )


def get_batch_files():

    return sorted(
        BATCH_DIR.glob("*.npy")
    )


def get_sequence_files():

    return sorted(
        SEQUENCE_DIR.glob("sequence_*.npy")
    )


# =========================================================
# API status
# =========================================================

@app.get("/api/v1/status")
def get_status():

    batch_files = get_batch_files()

    realtime_files = list(
        REALTIME_DIR.glob("*.npy")
    )

    sequence_files = get_sequence_files()

    return {

        "status": "online",

        "dataset": "GPM IMERG Early Run",

        "source": "NASA PPS",

        "region": "Bay of Bengal",

        "data": {

            "batch_observations":
                len(batch_files),

            "realtime_observations":
                len(realtime_files),

            "ml_sequences":
                len(sequence_files)
        },

        "spatial_shape": [
            200,
            250
        ],

        "temporal_resolution_minutes": 30
    }


# =========================================================
# Latest realtime observation
# =========================================================

@app.get("/api/v1/realtime/latest")
def get_latest_realtime():

    files = sorted(
        REALTIME_DIR.glob("*.npy")
    )

    if not files:

        raise HTTPException(
            status_code=404,
            detail="No realtime IMERG data available."
        )

    latest_file = files[-1]

    array = load_npy_file(
        latest_file
    )

    return {

        "dataset":
            "GPM IMERG Early Run",

        "source":
            "NASA PPS",

        "region":
            "Bay of Bengal",

        "file":
            latest_file.name,

        "shape":
            list(array.shape),

        "dtype":
            str(array.dtype),

        "min":
            float(np.nanmin(array)),

        "max":
            float(np.nanmax(array)),

        "mean":
            float(np.nanmean(array))
    }


# =========================================================
# Batch observations
# =========================================================

@app.get("/api/v1/batch")
def get_batch_observations():

    files = get_batch_files()

    if not files:

        raise HTTPException(
            status_code=404,
            detail="No batch IMERG data available."
        )

    observations = []

    for file_path in files:

        array = load_npy_file(
            file_path
        )

        observations.append({

            "file":
                file_path.name,

            "shape":
                list(array.shape),

            "dtype":
                str(array.dtype),

            "min":
                float(np.nanmin(array)),

            "max":
                float(np.nanmax(array)),

            "mean":
                float(np.nanmean(array))
        })

    return {

        "dataset":
            "GPM IMERG Early Run",

        "source":
            "NASA PPS",

        "region":
            "Bay of Bengal",

        "observation_count":
            len(observations),

        "observations":
            observations
    }


# =========================================================
# Forecast input
# =========================================================

@app.get("/api/v1/forecast-input")
def get_forecast_input():

    files = get_batch_files()

    if len(files) < 12:

        raise HTTPException(
            status_code=404,
            detail=(
                "At least 12 batch observations "
                "are required."
            )
        )

    latest_files = files[-12:]

    observations = []

    for file_path in latest_files:

        array = load_npy_file(
            file_path
        )

        observations.append({

            "file":
                file_path.name,

            "shape":
                list(array.shape),

            "data":
                array.tolist()
        })

    return {

        "dataset":
            "GPM IMERG Early Run",

        "source":
            "NASA PPS",

        "region":
            "Bay of Bengal",

        "temporal_resolution_minutes":
            30,

        "window_hours":
            6,

        "observation_count":
            len(observations),

        "observations":
            observations
    }


# =========================================================
# ML sequences
# =========================================================

@app.get("/api/v1/sequences")
def get_sequences():

    metadata_path = (
        SEQUENCE_DIR
        / "dataset_metadata.json"
    )

    if not metadata_path.exists():

        raise HTTPException(
            status_code=404,
            detail="ML dataset metadata not found."
        )

    try:

        with open(
            metadata_path,
            "r",
            encoding="utf-8"
        ) as file:

            metadata = json.load(
                file
            )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Could not read metadata: {error}"
        )

    return metadata