from pathlib import Path

from src.ingestion.download_imerg import (
    get_latest_files,
    download_selected_files
)

from src.ingestion.router import (
    route_file,
    REALTIME_LANE
)

from src.preprocessing.imerg_processor import (
    IMERGProcessor
)


# =========================================================
# Directories
# =========================================================

OUTPUT_DIRECTORY = Path(
    "data/processed/realtime"
)

METADATA_DIRECTORY = Path(
    "data/metadata/realtime"
)


# =========================================================
# Region
# =========================================================

REGION = {

    "name": "Bay of Bengal",

    "min_lat": 5.0,

    "max_lat": 25.0,

    "min_lon": 75.0,

    "max_lon": 100.0
}


# =========================================================
# Process latest real-time observation
# =========================================================

def process_realtime():

    print()
    print("=" * 70)
    print("REAL-TIME LANE")
    print("=" * 70)

    # -----------------------------------------------------
    # Find latest available IMERG file
    # -----------------------------------------------------

    files = get_latest_files()

    if not files:

        print(
            "No IMERG files available."
        )

        return None

    latest_timestamp, latest_filename = (
        files[-1]
    )

    print()
    print(
        "Latest observation:"
    )

    print(
        latest_timestamp,
        "->",
        latest_filename
    )

    # -----------------------------------------------------
    # Download latest file
    # -----------------------------------------------------

    downloaded = (
        download_selected_files(
            [
                (
                    latest_timestamp,
                    latest_filename
                )
            ]
        )
    )

    if not downloaded:

        print(
            "Real-time file was not downloaded."
        )

        return None

    input_file = downloaded[0]

    # -----------------------------------------------------
    # Create router event
    # -----------------------------------------------------

    event = route_file(
        input_file,
        REALTIME_LANE
    )

    # -----------------------------------------------------
    # Preprocessing
    # -----------------------------------------------------

    processor = IMERGProcessor(

        input_file,

        OUTPUT_DIRECTORY,

        METADATA_DIRECTORY,

        REGION
    )

    array, transform, crs = (
        processor.process()
    )

    timestamp = (
        processor.extract_timestamp()
    )

    # -----------------------------------------------------
    # Output filename
    # -----------------------------------------------------

    filename = (
        "realtime_imerg_"
        + timestamp
        .replace(":", "")
        .replace("-", "")
        .replace("T", "_")
        .replace("Z", "")
    )

    # -----------------------------------------------------
    # Metadata
    # -----------------------------------------------------

    metadata = {

        "pipeline": (
            "Cyclone Data Pipeline"
        ),

        "pipeline_version": "0.1.0",

        "lane": REALTIME_LANE,

        "source": event["source"],

        "dataset": event["dataset"],

        "product": event["product"],

        "version": event["version"],

        "event_time": event["event_time"],

        "ingested_at": event["ingested_at"],

        "region": REGION,

        "input_file": str(
            input_file
        ),

        "idempotency_key": (
            event["idempotency_key"]
        ),

        "spatial": {

            "width": int(
                array.shape[1]
            ),

            "height": int(
                array.shape[0]
            ),

            "resolution_degrees": 0.1,

            "crs": str(crs)
        },

        "variable": {

            "name": "precipitation",

            "unit": "mm",

            "temporal_resolution_minutes": 30
        },

        "processing": {

            "missing_value": 29999,

            "scale_factor": 0.1,

            "missing_values_handled": True
        }
    }

    # -----------------------------------------------------
    # Save ML-ready NumPy array
    # -----------------------------------------------------

    output_path, metadata_path = (
        processor.save(
            array,
            filename,
            metadata
        )
    )

    print()
    print("=" * 70)
    print("REAL-TIME LANE COMPLETE")
    print("=" * 70)

    print()
    print(
        "ML input:",
        output_path
    )

    print(
        "Metadata:",
        metadata_path
    )

    print()
    print(
        "This output is ready for the ML team."
    )

    return {

        "lane": REALTIME_LANE,

        "event": event,

        "data_path": str(
            output_path
        ),

        "metadata_path": str(
            metadata_path
        )
    }


if __name__ == "__main__":

    process_realtime()