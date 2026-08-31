from pathlib import Path

from src.ingestion.download_imerg import (
    get_latest_files,
    download_selected_files,
    BATCH_FILES
)

from src.ingestion.router import (
    route_file,
    BATCH_LANE
)

from src.preprocessing.imerg_processor import (
    IMERGProcessor
)


# =========================================================
# Directories
# =========================================================

OUTPUT_DIRECTORY = Path(
    "data/processed/batch"
)

METADATA_DIRECTORY = Path(
    "data/metadata/batch"
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
# Process latest 12 hours
# =========================================================

def process_batch():

    print()
    print("=" * 70)
    print("BATCH LANE")
    print("=" * 70)

    print()
    print(
        "Target window:",
        "12 hours"
    )

    print(
        "Expected observations:",
        BATCH_FILES
    )

    # -----------------------------------------------------
    # Get available files
    # -----------------------------------------------------

    files = get_latest_files()

    if not files:

        print(
            "No IMERG files available."
        )

        return []

    # -----------------------------------------------------
    # Select latest 24 observations
    # -----------------------------------------------------

    latest_files = (
        files[-BATCH_FILES:]
    )

    print()
    print(
        "Batch observations selected:",
        len(latest_files)
    )

    # -----------------------------------------------------
    # Download files
    # -----------------------------------------------------

    downloaded_files = (
        download_selected_files(
            latest_files
        )
    )

    if not downloaded_files:

        print(
            "No batch files available."
        )

        return []

    # -----------------------------------------------------
    # Process every observation
    # -----------------------------------------------------

    results = []

    for input_file in downloaded_files:

        print()
        print("-" * 70)

        print(
            "Processing batch observation:"
        )

        print(
            input_file.name
        )

        # -------------------------------------------------
        # Router
        # -------------------------------------------------

        event = route_file(
            input_file,
            BATCH_LANE
        )

        # -------------------------------------------------
        # Preprocessing
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Output filename
        # -------------------------------------------------

        filename = (
            "batch_imerg_"
            + timestamp
            .replace(":", "")
            .replace("-", "")
            .replace("T", "_")
            .replace("Z", "")
        )

        # -------------------------------------------------
        # Metadata
        # -------------------------------------------------

        metadata = {

            "pipeline": (
                "Cyclone Data Pipeline"
            ),

            "pipeline_version": "0.1.0",

            "lane": BATCH_LANE,

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

            "batch_window": {

                "duration_hours": 12,

                "expected_observations": BATCH_FILES
            },

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

        # -------------------------------------------------
        # Save ML-ready array
        # -------------------------------------------------

        output_path, metadata_path = (
            processor.save(
                array,
                filename,
                metadata
            )
        )

        results.append({

            "lane": BATCH_LANE,

            "event_time": event[
                "event_time"
            ],

            "data_path": str(
                output_path
            ),

            "metadata_path": str(
                metadata_path
            )
        })

    # -----------------------------------------------------
    # Completion
    # -----------------------------------------------------

    print()
    print("=" * 70)
    print("BATCH LANE COMPLETE")
    print("=" * 70)

    print()
    print(
        "Observations processed:",
        len(results)
    )

    print()
    print(
        "ML-ready batch data:"
    )

    for result in results:

        print(
            result["event_time"],
            "->",
            result["data_path"]
        )

    return results


if __name__ == "__main__":

    process_batch()