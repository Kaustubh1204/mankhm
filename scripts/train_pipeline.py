"""
Master Runner Script for the End-to-End Cyclone ML Training Pipeline.
Executes:
1. Self-Supervised Learning (SSL) pretraining on unlabelled satellite imagery
2. Realtime (Speed) Lane model training
3. Batch (Deep Synoptic) Lane model training
4. ONNX model export for GCP cloud deployment
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.ml.ssl_pretrain import train_ssl_pretraining
from src.ml.train_realtime import train_realtime_pipeline
from src.ml.train_batch import train_batch_pipeline
from src.ml.export_onnx import export_to_onnx


def run_full_pipeline(ssl_epochs: int = 2, realtime_epochs: int = 2, batch_epochs: int = 2):
    print("\n" + "#" * 60)
    print("STARTING COMPLETE TROPICAL CYCLONE ML TRAINING & EXPORT PIPELINE")
    print("#" * 60 + "\n")

    # Step 1: Self-Supervised Pretraining (MAE)
    print("STEP 1: Executing Self-Supervised Pretraining (SSL)...")
    train_ssl_pretraining(num_epochs=ssl_epochs)

    # Step 2: Realtime Speed Lane Training
    print("\nSTEP 2: Training Realtime Speed Lane Models...")
    train_realtime_pipeline(epochs=realtime_epochs)

    # Step 3: Batch Deep Synoptic Lane Training
    print("\nSTEP 3: Training Batch Deep Synoptic Lane Models...")
    train_batch_pipeline(epochs=batch_epochs)

    # Step 4: ONNX Model Export
    print("\nSTEP 4: Exporting Models to ONNX for GCP Cloud Deployment...")
    export_to_onnx()

    print("\n" + "=" * 60)
    print("[SUCCESS] Full ML Architecture Training Pipeline Complete!")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    run_full_pipeline(ssl_epochs=2, realtime_epochs=2, batch_epochs=2)
