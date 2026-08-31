"""
CLI tool for preparing 11 years of historical satellite data and performing Cyclone-Wise splits.
"""

import sys
import argparse
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.ml.dataset_builder import CycloneDatasetSplitter


def main():
    parser = argparse.ArgumentParser(description="Prepare 11-year satellite dataset with Cyclone-Wise splitting.")
    parser.add_argument("--start-year", type=int, default=2014, help="Start year of historical dataset")
    parser.add_argument("--end-year", type=int, default=2025, help="End year of historical dataset")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for splitting")
    args = parser.parse_args()

    print("=" * 60)
    print(f"PREPARING HISTORICAL SATELLITE DATASET ({args.start_year} - {args.end_year})")
    print("=" * 60)

    # Simulated unique storm IDs across 11 historical years
    simulated_storms = [f"STORM_{year}_{i:02d}" for year in range(args.start_year, args.end_year + 1) for i in range(1, 6)]
    print(f"Total historical storms identified: {len(simulated_storms)}")

    splitter = CycloneDatasetSplitter(train_ratio=0.70, val_ratio=0.15, test_ratio=0.15, seed=args.seed)
    splits = splitter.split_storms(simulated_storms)

    print(f"[SUCCESS] Train Storms ({len(splits['train'])}): {splits['train'][:3]}...")
    print(f"[SUCCESS] Validation Storms ({len(splits['val'])}): {splits['val'][:3]}...")
    print(f"[SUCCESS] Test Storms ({len(splits['test'])}): {splits['test'][:3]}...")


if __name__ == "__main__":
    main()
