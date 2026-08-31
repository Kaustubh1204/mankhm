"""
Training Script for Realtime (Speed) Lane Models.
Processes 15-minute INSAT-3D/3DR/3DS Thermal & Water Vapor Imagery sequences.
Optimizes OBB Detection, Intensity Estimation, and Short-Term 0-6h Track.
Saves checkpoints strictly to `checkpoints/realtime/`.
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path

from src.ml.config import REALTIME_CONFIG, REALTIME_CHECKPOINT_DIR
from src.ml.dataset_builder import RealtimeCycloneDataset, build_dataloaders
from src.ml.models.detection_obb import CycloneOBBDetector
from src.ml.models.intensity_regressor import CycloneIntensityRegressor
from src.ml.models.track_forecaster import RealtimeTrackForecaster


def train_realtime_pipeline(epochs: int = 5, save_checkpoint: bool = True):
    print("=" * 60)
    print("STARTING REALTIME (SPEED) LANE MODEL TRAINING")
    print("=" * 60)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    # Initialize isolated models for Realtime Lane
    detector = CycloneOBBDetector(model_type="RT-DETRv2-OBB", in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
    intensity_model = CycloneIntensityRegressor(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
    track_forecaster = RealtimeTrackForecaster(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)

    # Optimizers
    opt_detector = optim.AdamW(detector.parameters(), lr=REALTIME_CONFIG["learning_rate"])
    opt_intensity = optim.AdamW(intensity_model.parameters(), lr=REALTIME_CONFIG["learning_rate"])
    opt_track = optim.AdamW(track_forecaster.parameters(), lr=REALTIME_CONFIG["learning_rate"])

    # Synthetic training samples for isolated lane verification
    dummy_samples = [{"storm_id": f"STORM_{i}"} for i in range(32)]
    realtime_loader, _ = build_dataloaders(dummy_samples, dummy_samples, batch_size_realtime=REALTIME_CONFIG["batch_size"])

    for epoch in range(1, epochs + 1):
        detector.train()
        intensity_model.train()
        track_forecaster.train()

        total_loss = 0.0
        for images, targets in realtime_loader:
            images = images.to(device)
            obb_target = targets["obb"].to(device)
            intensity_target = targets["intensity"].to(device)
            track_delta_target = targets["track_delta_6h"].to(device)

            # Forward passes
            det_out = detector(images)
            int_out = intensity_model(images)
            track_out = track_forecaster(images)

            # Losses
            loss_obb = nn.MSELoss()(det_out["obbs"][:, 0, :], obb_target)
            loss_int = nn.MSELoss()(int_out["intensity_reg"], intensity_target)
            loss_track = nn.MSELoss()(track_out, track_delta_target)

            loss = loss_obb + loss_int + loss_track

            opt_detector.zero_grad()
            opt_intensity.zero_grad()
            opt_track.zero_grad()

            loss.backward()

            opt_detector.step()
            opt_intensity.step()
            opt_track.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(realtime_loader)
        print(f"[Realtime Lane Epoch {epoch}/{epochs}] Average Loss: {avg_loss:.6f}")

    if save_checkpoint:
        os.makedirs(REALTIME_CHECKPOINT_DIR, exist_ok=True)
        ckpt_path = Path(REALTIME_CHECKPOINT_DIR) / "realtime_speed_lane.pt"
        torch.save({
            "detector": detector.state_dict(),
            "intensity": intensity_model.state_dict(),
            "track_forecaster": track_forecaster.state_dict(),
            "config": REALTIME_CONFIG
        }, ckpt_path)
        print(f"[SUCCESS] Realtime Checkpoint Saved: {ckpt_path}")

    return ckpt_path


if __name__ == "__main__":
    train_realtime_pipeline(epochs=3)
