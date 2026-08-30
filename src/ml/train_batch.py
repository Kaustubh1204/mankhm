"""
Training Script for Batch (Deep Synoptic) Lane Models.
Processes 6-hour multi-sensor sequences (INSAT + GPM IMERG + OceanSat + SST).
Optimizes 72-hour track forecast cone and Rapid Intensification (RI) alert binary classification.
Saves checkpoints strictly to `checkpoints/batch/`.
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path

from src.ml.config import BATCH_CONFIG, BATCH_CHECKPOINT_DIR
from src.ml.dataset_builder import BatchCycloneDataset, build_dataloaders
from src.ml.models.track_forecaster import BatchSynopticTrackForecaster


def train_batch_pipeline(epochs: int = 5, save_checkpoint: bool = True):
    print("=" * 60)
    print("STARTING BATCH (DEEP SYNOPTIC) LANE MODEL TRAINING")
    print("=" * 60)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    # Initialize isolated model for Batch Lane
    batch_forecaster = BatchSynopticTrackForecaster(
        in_channels=len(BATCH_CONFIG["input_channels"]),
        hidden_dim=256
    ).to(device)

    optimizer = optim.AdamW(batch_forecaster.parameters(), lr=BATCH_CONFIG["learning_rate"])

    # Loss Functions
    loss_fn_cone = nn.MSELoss()
    loss_fn_ri = nn.BCELoss()

    # Synthetic training samples for isolated batch lane verification
    dummy_samples = [{"storm_id": f"BATCH_STORM_{i}"} for i in range(16)]
    _, batch_loader = build_dataloaders(dummy_samples, dummy_samples, batch_size_batch=BATCH_CONFIG["batch_size"])

    for epoch in range(1, epochs + 1):
        batch_forecaster.train()
        total_loss = 0.0

        for fused_images, targets in batch_loader:
            fused_images = fused_images.to(device)
            track_72h_target = targets["track_72h"].to(device)
            ri_target = targets["rapid_intensification"].unsqueeze(1).to(device)

            out = batch_forecaster(fused_images)

            l_cone = loss_fn_cone(out["track_72h_cone"], track_72h_target)
            l_ri = loss_fn_ri(out["rapid_intensification_prob"], ri_target)

            loss = l_cone + (2.0 * l_ri)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(batch_loader)
        print(f"[Batch Lane Epoch {epoch}/{epochs}] Average Loss: {avg_loss:.6f}")

    if save_checkpoint:
        os.makedirs(BATCH_CHECKPOINT_DIR, exist_ok=True)
        ckpt_path = Path(BATCH_CHECKPOINT_DIR) / "batch_synoptic_lane.pt"
        torch.save({
            "model": batch_forecaster.state_dict(),
            "config": BATCH_CONFIG
        }, ckpt_path)
        print(f"[SUCCESS] Batch Checkpoint Saved: {ckpt_path}")

    return ckpt_path


if __name__ == "__main__":
    train_batch_pipeline(epochs=3)
