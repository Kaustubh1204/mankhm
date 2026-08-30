import os
import sys
import torch
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.ml.config import ONNX_EXPORT_DIR, REALTIME_CONFIG
from src.ml.models.detection_obb import CycloneOBBDetector
from src.ml.models.intensity_regressor import CycloneIntensityRegressor
from src.ml.models.track_forecaster import RealtimeTrackForecaster


def export_to_onnx(output_dir: Path = ONNX_EXPORT_DIR):
    os.makedirs(output_dir, exist_ok=True)
    print("=" * 60)
    print("EXPORTING PYTORCH MODELS TO ONNX FOR GCP CLOUD DEPLOYMENT")
    print("=" * 60)

    device = torch.device("cpu")

    try:
        import onnx
        # 1. Export Realtime OBB Detector
        detector = CycloneOBBDetector(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
        detector.eval()
        dummy_input_det = torch.randn(1, 4, 3, 256, 256)
        onnx_det_path = output_dir / "cyclone_detector_obb.onnx"
        
        torch.onnx.export(
            detector,
            dummy_input_det,
            onnx_det_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=["satellite_sequence"],
            output_names=["logits", "obbs"],
            dynamic_axes={"satellite_sequence": {0: "batch_size"}}
        )
        print(f"[SUCCESS] ONNX Exported: {onnx_det_path}")

        # 2. Export Realtime Track Forecaster
        track_forecaster = RealtimeTrackForecaster(in_channels=len(REALTIME_CONFIG["input_channels"])).to(device)
        track_forecaster.eval()
        dummy_input_track = torch.randn(1, 4, 3, 256, 256)
        onnx_track_path = output_dir / "realtime_track_forecaster.onnx"

        torch.onnx.export(
            track_forecaster,
            dummy_input_track,
            onnx_track_path,
            export_params=True,
            opset_version=14,
            do_constant_folding=True,
            input_names=["satellite_sequence"],
            output_names=["track_delta_6h"],
            dynamic_axes={"satellite_sequence": {0: "batch_size"}}
        )
        print(f"[SUCCESS] ONNX Exported: {onnx_track_path}")
    except Exception as e:
        print(f"[NOTICE] ONNX export skipped ({e}). PyTorch .pt checkpoints remain available in checkpoints/realtime/ and checkpoints/batch/.")
        print("To enable ONNX export, install the optional package: pip install onnx")

    return output_dir


if __name__ == "__main__":
    export_to_onnx()
