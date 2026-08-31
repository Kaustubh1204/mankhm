from pathlib import Path
import json

import numpy as np


# =========================================================
# Configuration
# =========================================================

BATCH_DIR = Path("data/processed/batch")

OUTPUT_DIR = Path("data/ml/sequences")

SEQUENCE_LENGTH = 12


# =========================================================
# Find processed batch files
# =========================================================

def get_batch_files():

    files = sorted(
        BATCH_DIR.glob("*.npy")
    )

    return files


# =========================================================
# Load one observation
# =========================================================

def load_observation(file_path):

    array = np.load(
        file_path
    )

    if array.shape != (200, 250):

        raise ValueError(
            f"Unexpected shape in {file_path}: "
            f"{array.shape}"
        )

    return array.astype(
        np.float32
    )


# =========================================================
# Create temporal sequences
# =========================================================

def create_sequences():

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    files = get_batch_files()

    print("=" * 60)
    print("ML DATASET CREATION")
    print("=" * 60)

    print(
        "Batch files found:",
        len(files)
    )

    if len(files) < SEQUENCE_LENGTH:

        print(
            f"Not enough observations."
        )

        print(
            f"Required: {SEQUENCE_LENGTH}"
        )

        return

    observations = []

    for file_path in files:

        print(
            "Loading:",
            file_path.name
        )

        array = load_observation(
            file_path
        )

        observations.append(
            array
        )

    observations = np.stack(
        observations,
        axis=0
    )

    print()
    print(
        "Combined observation shape:",
        observations.shape
    )

    # -----------------------------------------------------
    # Create sliding-window sequences
    # -----------------------------------------------------

    sequence_count = (
        len(observations)
        - SEQUENCE_LENGTH
        + 1
    )

    print(
        "Sequences to create:",
        sequence_count
    )

    metadata = []

    for index in range(
        sequence_count
    ):

        start = index

        end = (
            index
            + SEQUENCE_LENGTH
        )

        sequence = observations[
            start:end
        ]

        first_file = files[
            start
        ]

        last_file = files[
            end - 1
        ]

        output_name = (
            f"sequence_{index + 1:03d}.npy"
        )

        output_path = (
            OUTPUT_DIR
            / output_name
        )

        np.save(
            output_path,
            sequence
        )

        record = {

            "sequence_id":
                index + 1,

            "file":
                str(output_path),

            "observation_count":
                SEQUENCE_LENGTH,

            "shape":
                list(sequence.shape),

            "start_file":
                first_file.name,

            "end_file":
                last_file.name,

            "min":
                float(np.nanmin(sequence)),

            "max":
                float(np.nanmax(sequence)),

            "mean":
                float(np.nanmean(sequence))
        }

        metadata.append(
            record
        )

        print()
        print(
            f"Sequence {index + 1}:"
        )

        print(
            "  Shape:",
            sequence.shape
        )

        print(
            "  Start:",
            first_file.name
        )

        print(
            "  End:",
            last_file.name
        )

        print(
            "  Saved:",
            output_path
        )

    # -----------------------------------------------------
    # Save dataset metadata
    # -----------------------------------------------------

    metadata_path = (
        OUTPUT_DIR
        / "dataset_metadata.json"
    )

    with open(
        metadata_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            {
                "dataset":
                    "GPM IMERG Early Run",

                "source":
                    "NASA PPS",

                "region":
                    "Bay of Bengal",

                "temporal_resolution_minutes":
                    30,

                "sequence_length":
                    SEQUENCE_LENGTH,

                "spatial_shape":
                    [200, 250],

                "sequence_count":
                    sequence_count,

                "sequences":
                    metadata
            },
            file,
            indent=4
        )

    print()
    print("=" * 60)
    print("ML DATASET CREATION COMPLETE")
    print("=" * 60)

    print(
        "Sequences created:",
        sequence_count
    )

    print(
        "Metadata:",
        metadata_path
    )


# =========================================================
# Main
# =========================================================

if __name__ == "__main__":

    create_sequences()