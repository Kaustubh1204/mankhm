import os
import json
import random
from pathlib import Path
from typing import Dict, List, Tuple, Optional

import torch
from torch.utils.data import Dataset, DataLoader
import numpy as np

from src.ml.config import REALTIME_CONFIG, BATCH_CONFIG, REALTIME_DATA_DIR, BATCH_DATA_DIR


class CycloneDatasetSplitter:
    """
    Splits historical cyclone data by storm ID (Cyclone-Wise Split)
    to strictly prevent temporal data leakage across train, val, and test sets.
    """

    def __init__(self, train_ratio: float = 0.70, val_ratio: float = 0.15, test_ratio: float = 0.15, seed: int = 42):
        assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-5, "Ratios must sum to 1.0"
        self.train_ratio = train_ratio
        self.val_ratio = val_ratio
        self.test_ratio = test_ratio
        self.seed = seed

    def split_storms(self, storm_ids: List[str]) -> Dict[str, List[str]]:
        """
        Takes a list of unique storm IDs (e.g. ['BOB012015', 'ARB022019', ...])
        and returns a dictionary with 'train', 'val', and 'test' storm ID lists.
        """
        unique_storms = sorted(list(set(storm_ids)))
        random.seed(self.seed)
        random.shuffle(unique_storms)

        n_total = len(unique_storms)
        n_train = int(n_total * self.train_ratio)
        n_val = int(n_total * self.val_ratio)

        train_storms = unique_storms[:n_train]
        val_storms = unique_storms[n_train:n_train + n_val]
        test_storms = unique_storms[n_train + n_val:]

        return {
            "train": train_storms,
            "val": val_storms,
            "test": test_storms,
        }


class RealtimeCycloneDataset(Dataset):
    """
    Isolated Dataset for the Realtime (Speed) Lane (15-minute Cadence).
    Inputs: Sequence of INSAT-3D/3DR/3DS Thermal & Water Vapor Imagery Tensors (C x H x W).
    Targets:
      - OBB: [center_x, center_y, width, height, theta_rad] (Oriented Bounding Box)
      - Intensity: [msw_knots, central_pressure_hpa]
      - Track Delta: 0–6 hour displacement [delta_lat, delta_lon]
    """

    def __init__(self, samples: List[Dict], sequence_length: int = 4, transform=None):
        self.samples = samples
        self.sequence_length = sequence_length
        self.transform = transform

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        sample = self.samples[idx]

        # Load or generate synthetic tensor if file path provided
        if "image_tensor" in sample:
            image_seq = torch.tensor(sample["image_tensor"], dtype=torch.float32)
        else:
            # Generate shape: [sequence_length, channels, H, W]
            image_seq = torch.randn(
                self.sequence_length,
                len(REALTIME_CONFIG["input_channels"]),
                REALTIME_CONFIG["image_size"][0],
                REALTIME_CONFIG["image_size"][1],
                dtype=torch.float32
            )

        # Targets
        obb_target = torch.tensor(sample.get("obb", [256.0, 256.0, 120.0, 100.0, 0.45]), dtype=torch.float32)
        intensity_target = torch.tensor(sample.get("intensity", [65.0, 980.0]), dtype=torch.float32) # [MSW knots, Pressure hPa]
        track_delta_target = torch.tensor(sample.get("track_delta_6h", [0.4, 0.6]), dtype=torch.float32) # [dLat, dLon]

        targets = {
            "obb": obb_target,
            "intensity": intensity_target,
            "track_delta_6h": track_delta_target,
            "storm_id": sample.get("storm_id", "SYNTHETIC_STORM"),
        }

        return image_seq, targets


class BatchCycloneDataset(Dataset):
    """
    Isolated Dataset for the Batch (Synoptic) Lane (6-hour Cadence).
    Inputs: Multi-Sensor Fused Grid Tensors (INSAT + GPM IMERG + OceanSat Wind + SST).
    Targets:
      - 72-Hour Track Cone: Sequence of 12 coordinates (6-hr interval) [(lat_1, lon_1), ..., (lat_12, lon_12)]
      - Rapid Intensification (RI): Binary flag (1 if MSW increases >= 30 knots in 24 hrs, else 0)
    """

    def __init__(self, samples: List[Dict], sequence_length: int = 12, transform=None):
        self.samples = samples
        self.sequence_length = sequence_length
        self.transform = transform

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        sample = self.samples[idx]

        if "fused_tensor" in sample:
            fused_seq = torch.tensor(sample["fused_tensor"], dtype=torch.float32)
        else:
            # Shape: [sequence_length, multi_sensor_channels, H, W]
            fused_seq = torch.randn(
                self.sequence_length,
                len(BATCH_CONFIG["input_channels"]),
                BATCH_CONFIG["image_size"][0],
                BATCH_CONFIG["image_size"][1],
                dtype=torch.float32
            )

        track_72h = torch.tensor(sample.get("track_72h", [[15.0 + i*0.2, 85.0 + i*0.3] for i in range(12)]), dtype=torch.float32)
        ri_flag = torch.tensor(sample.get("rapid_intensification", 1.0), dtype=torch.float32)

        targets = {
            "track_72h": track_72h,
            "rapid_intensification": ri_flag,
            "storm_id": sample.get("storm_id", "SYNTHETIC_STORM"),
        }

        return fused_seq, targets


def build_dataloaders(
    realtime_samples: List[Dict],
    batch_samples: List[Dict],
    batch_size_realtime: int = 16,
    batch_size_batch: int = 8,
) -> Tuple[DataLoader, DataLoader]:
    """
    Creates isolated data loaders for Realtime and Batch lanes.
    """
    realtime_ds = RealtimeCycloneDataset(realtime_samples)
    batch_ds = BatchCycloneDataset(batch_samples)

    realtime_loader = DataLoader(realtime_ds, batch_size=batch_size_realtime, shuffle=True)
    batch_loader = DataLoader(batch_ds, batch_size=batch_size_batch, shuffle=True)

    return realtime_loader, batch_loader
