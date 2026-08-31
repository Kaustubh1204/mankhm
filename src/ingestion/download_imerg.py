import os
import re
import json
import requests

from pathlib import Path
from dotenv import load_dotenv


# =========================================================
# Load environment variables
# =========================================================

load_dotenv()

PPS_USERNAME = os.getenv("PPS_USERNAME")
PPS_PASSWORD = os.getenv("PPS_PASSWORD")


# =========================================================
# Configuration
# =========================================================

BASE_URL = (
    "https://jsimpsonhttps.pps.eosdis.nasa.gov/"
    "imerg/gis/early/"
)

RAW_DIR = Path("data/raw/imerg")

STATE_FILE = Path(
    "state/ingestion_state.json"
)

# IMERG Early Run temporal resolution
TEMPORAL_RESOLUTION_MINUTES = 30

# ---------------------------------------------------------
# Prototype lane windows
# ---------------------------------------------------------

# Real-time lane:
# Keep only the latest 30-minute observation.
REALTIME_FILES = 1

# Batch lane:
# 12 hours / 30 minutes = 24 observations.
BATCH_FILES = 24


# =========================================================
# Create directories
# =========================================================

RAW_DIR.mkdir(
    parents=True,
    exist_ok=True
)

STATE_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# Get IMERG file listing
# =========================================================

def get_file_list():

    print("Getting IMERG file listing...")
    print(BASE_URL)

    response = requests.get(
        BASE_URL,
        auth=(
            PPS_USERNAME,
            PPS_PASSWORD
        ),
        timeout=60
    )

    response.raise_for_status()

    # Only select 30-minute GeoTIFF files.
    files = re.findall(
        r'href="([^"]+\.30min\.tif)"',
        response.text
    )

    return files


# =========================================================
# Extract timestamp
# =========================================================

def extract_timestamp(filename):

    # Example:
    #
    # 3B-HHR-E.MS.MRG.3IMERG.
    # 20260830-S003000-E005959.0030.
    # V07C.30min.tif

    match = re.search(
        r'\.(\d{8})-S(\d{6})-',
        filename
    )

    if not match:
        return None

    date = match.group(1)
    time = match.group(2)

    return date + time


# =========================================================
# Load ingestion state
# =========================================================

def load_state():

    if not STATE_FILE.exists():

        return {
            "imerg": {
                "last_ingested_timestamp": None,
                "files": []
            }
        }

    try:

        with open(
            STATE_FILE,
            "r"
        ) as file:

            return json.load(file)

    except json.JSONDecodeError:

        print(
            "Warning: state file is empty or invalid."
        )

        print(
            "Creating a new state."
        )

        return {
            "imerg": {
                "last_ingested_timestamp": None,
                "files": []
            }
        }


# =========================================================
# Save ingestion state
# =========================================================

def save_state(state):

    with open(
        STATE_FILE,
        "w"
    ) as file:

        json.dump(
            state,
            file,
            indent=4
        )


# =========================================================
# Download one file
# =========================================================

def download_file(filename):

    url = BASE_URL + filename

    output_path = (
        RAW_DIR / filename
    )

    print()
    print("Downloading:")
    print(filename)

    response = requests.get(
        url,
        auth=(
            PPS_USERNAME,
            PPS_PASSWORD
        ),
        stream=True,
        timeout=120
    )

    response.raise_for_status()

    with open(
        output_path,
        "wb"
    ) as file:

        for chunk in response.iter_content(
            chunk_size=1024 * 1024
        ):

            if chunk:
                file.write(chunk)

    print()
    print("Saved:")
    print(output_path)

    return output_path


# =========================================================
# Download selected files
# =========================================================

def download_selected_files(
    files_with_timestamp
):

    state = load_state()

    imerg_state = state.setdefault(
        "imerg",
        {
            "last_ingested_timestamp": None,
            "files": []
        }
    )

    imerg_state.setdefault(
        "files",
        []
    )

    downloaded_paths = []

    for timestamp, filename in files_with_timestamp:

        output_path = (
            RAW_DIR / filename
        )

        # ---------------------------------------------
        # Already tracked
        # ---------------------------------------------

        if filename in imerg_state["files"]:

            print()
            print(
                "Already ingested - skipping:"
            )
            print(filename)

            downloaded_paths.append(
                output_path
            )

            continue

        # ---------------------------------------------
        # Already exists locally
        # ---------------------------------------------

        if output_path.exists():

            print()
            print(
                "File already exists locally - skipping:"
            )
            print(filename)

            imerg_state["files"].append(
                filename
            )

            imerg_state[
                "last_ingested_timestamp"
            ] = timestamp

            save_state(state)

            downloaded_paths.append(
                output_path
            )

            continue

        # ---------------------------------------------
        # Download
        # ---------------------------------------------

        try:

            download_file(filename)

            imerg_state["files"].append(
                filename
            )

            imerg_state[
                "last_ingested_timestamp"
            ] = timestamp

            save_state(state)

            downloaded_paths.append(
                output_path
            )

            print(
                "State updated successfully."
            )

        except Exception as error:

            print()
            print(
                "DOWNLOAD FAILED:"
            )

            print(filename)

            print(
                "Error:",
                error
            )

    return downloaded_paths


# =========================================================
# Get latest files
# =========================================================

def get_latest_files():

    files = get_file_list()

    print()
    print(
        "Total 30-minute files found:",
        len(files)
    )

    if not files:

        return []

    files_with_timestamp = []

    for filename in files:

        timestamp = extract_timestamp(
            filename
        )

        if timestamp:

            files_with_timestamp.append(
                (
                    timestamp,
                    filename
                )
            )

    files_with_timestamp.sort(
        key=lambda x: x[0]
    )

    return files_with_timestamp


# =========================================================
# Main
# =========================================================

def main():

    print("=" * 70)
    print("CYCLONE DATA PIPELINE - IMERG INGESTION")
    print("=" * 70)

    print()
    print(
        "Source:",
        "NASA PPS IMERG Early Run"
    )

    print(
        "Source resolution:",
        f"{TEMPORAL_RESOLUTION_MINUTES} minutes"
    )

    print()
    print(
        "Real-time lane:",
        "latest 30-minute observation"
    )

    print(
        "Batch lane:",
        "latest 12 hours"
    )

    print(
        "Batch observations:",
        BATCH_FILES
    )

    # -----------------------------------------------------
    # Get available files
    # -----------------------------------------------------

    files_with_timestamp = (
        get_latest_files()
    )

    if not files_with_timestamp:

        print()
        print(
            "No IMERG files found."
        )

        return []

    # -----------------------------------------------------
    # Select latest 24 files.
    #
    # These 24 files represent the latest
    # 12 hours of IMERG data.
    # -----------------------------------------------------

    latest_batch = (
        files_with_timestamp[-BATCH_FILES:]
    )

    # -----------------------------------------------------
    # Latest one is the real-time observation.
    # -----------------------------------------------------

    latest_realtime = (
        latest_batch[-REALTIME_FILES:]
    )

    print()
    print("=" * 70)
    print("REAL-TIME LANE INPUT")
    print("=" * 70)

    for timestamp, filename in latest_realtime:

        print(
            timestamp,
            "->",
            filename
        )

    print()
    print("=" * 70)
    print("BATCH LANE INPUT")
    print("=" * 70)

    print(
        "Number of observations:",
        len(latest_batch)
    )

    for timestamp, filename in latest_batch:

        print(
            timestamp,
            "->",
            filename
        )

    # -----------------------------------------------------
    # Download the 24 files required for the batch lane.
    #
    # The latest real-time observation is already
    # included in these 24 files.
    # -----------------------------------------------------

    downloaded_paths = (
        download_selected_files(
            latest_batch
        )
    )

    print()
    print("=" * 70)
    print("IMERG INGESTION COMPLETE")
    print("=" * 70)

    print()
    print(
        "Files available locally:",
        len(downloaded_paths)
    )

    return downloaded_paths


if __name__ == "__main__":
    main()