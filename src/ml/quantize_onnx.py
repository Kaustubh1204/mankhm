"""
ONNX Model Quantization Engine for Zero-Cost Latency & Memory Optimization.
Quantizes PyTorch/ONNX models to INT8 precision, reducing memory size by ~75%
and boosting CPU/GPU inference speed by 2-3x (< 10ms target latency).
"""

import os
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from src.ml.config import ONNX_EXPORT_DIR

try:
    from onnxruntime.quantization import quantize_dynamic, QuantType
    HAS_QUANTIZER = True
except ImportError:
    HAS_QUANTIZER = False


def quantize_onnx_models(output_dir: Path = ONNX_EXPORT_DIR):
    print("=" * 65)
    print("EXECUTING INT8 MODEL QUANTIZATION FOR ZERO-COST LATENCY OPTIMIZATION")
    print("=" * 65)

    if not HAS_QUANTIZER:
        print("[NOTICE] onnxruntime.quantization package not found. Skipping INT8 quantization step.")
        return

    det_onnx = output_dir / "cyclone_detector_obb.onnx"
    det_int8 = output_dir / "cyclone_detector_obb_int8.onnx"

    if det_onnx.exists():
        print(f"[QUANTIZER] Quantizing {det_onnx.name} -> {det_int8.name}...")
        quantize_dynamic(
            model_input=str(det_onnx),
            model_output=str(det_int8),
            weight_type=QuantType.QUInt8,
        )
        orig_mb = os.path.getsize(det_onnx) / (1024 * 1024)
        quant_mb = os.path.getsize(det_int8) / (1024 * 1024)
        print(f"[SUCCESS] {det_int8.name} Created | Size Reduced: {orig_mb:.2f} MB -> {quant_mb:.2f} MB")

    track_onnx = output_dir / "realtime_track_forecaster.onnx"
    track_int8 = output_dir / "realtime_track_forecaster_int8.onnx"

    if track_onnx.exists():
        print(f"[QUANTIZER] Quantizing {track_onnx.name} -> {track_int8.name}...")
        quantize_dynamic(
            model_input=str(track_onnx),
            model_output=str(track_int8),
            weight_type=QuantType.QUInt8,
        )
        orig_mb = os.path.getsize(track_onnx) / (1024 * 1024)
        quant_mb = os.path.getsize(track_int8) / (1024 * 1024)
        print(f"[SUCCESS] {track_int8.name} Created | Size Reduced: {orig_mb:.2f} MB -> {quant_mb:.2f} MB")


if __name__ == "__main__":
    quantize_onnx_models()
