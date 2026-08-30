from pathlib import Path

from src.preprocessing.imerg_processor import IMERGProcessor


RAW_DIRECTORY = Path("data/raw/imerg")
PROCESSED_DIRECTORY = Path("data/processed/imerg")
METADATA_DIRECTORY = Path("data/metadata/imerg")


REGION = {
    "name": "Bay of Bengal",
    "min_lat": 5.0,
    "max_lat": 25.0,
    "min_lon": 75.0,
    "max_lon": 100.0
}


def process_all():

    files = sorted(
        RAW_DIRECTORY.glob("*.tif")
    )

    if not files:
        print("No IMERG GeoTIFF files found.")
        return

    print("=" * 60)
    print("IMERG BATCH PROCESSING")
    print("=" * 60)

    print("Files found:", len(files))

    processor_results = []

    for file_path in files:

        print("\n" + "-" * 60)
        print("Processing:", file_path.name)

        processor = IMERGProcessor(
            file_path,
            PROCESSED_DIRECTORY,
            METADATA_DIRECTORY,
            REGION
        )

        array, transform, crs = processor.process()

        timestamp = processor.extract_timestamp()

        filename = (
            "imerg_" +
            timestamp.replace(
                ":", ""
            ).replace(
                "-", ""
            ).replace(
                "T", "_"
            ).replace(
                "Z", ""
            )
        )

        output_path = processor.save_json(
            array,
            transform,
            crs,
            filename
        )

        processor_results.append({
            "timestamp": timestamp,
            "input": str(file_path),
            "output": str(output_path)
        })

    print("\n" + "=" * 60)
    print("BATCH PROCESSING COMPLETE")
    print("=" * 60)

    for result in processor_results:

        print(
            result["timestamp"],
            "→",
            result["output"]
        )


if __name__ == "__main__":
    process_all()
    