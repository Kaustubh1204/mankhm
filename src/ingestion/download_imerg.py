import os
import re
import json
import requests
from pathlib import Path
from dotenv import load_dotenv


# ---------------------------------------------------------
# Load environment variables
# ---------------------------------------------------------

load_dotenv()

PPS_USERNAME = os.getenv("PPS_USERNAME")
PPS_PASSWORD = os.getenv("PPS_PASSWORD")


# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------

BASE_URL = "https://jsimpsonhttps.pps.eosdis.nasa.gov/imerg/gis/early/"

RAW_DIR = Path("data/raw/imerg")
STATE_FILE = Path("state/ingestion_state.json")

# For our first test
NUMBER_OF_FILES = 12


# ---------------------------------------------------------
# Create required directories
# ---------------------------------------------------------

RAW_DIR.mkdir(parents=True, exist_ok=True)
STATE_FILE.parent.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# Get IMERG file listing
# ---------------------------------------------------------

def get_file_list():

    print("Getting IMERG file listing...")
    print(BASE_URL)

    response = requests.get(
        BASE_URL,
        auth=(PPS_USERNAME, PPS_PASSWORD),
        timeout=60
    )

    response.raise_for_status()

    # Find only 30-minute GeoTIFF files
    files = re.findall(
        r'href="([^"]+\.30min\.tif)"',
        response.text
    )

    return files


# ---------------------------------------------------------
# Extract timestamp from IMERG filename
# ---------------------------------------------------------

def extract_timestamp(filename):

    # Example:
    # 3B-HHR-E.MS.MRG.3IMERG.20260830-S003000-E005959.0030.V07C.30min.tif

    match = re.search(
        r'\.(\d{8})-S(\d{6})-',
        filename
    )

    if not match:
        return None

    date = match.group(1)
    time = match.group(2)

    return date + time


# ---------------------------------------------------------
# Load ingestion state
# ---------------------------------------------------------

def load_state():

    if not STATE_FILE.exists():
        return {
            "imerg": {
                "last_ingested_timestamp": None,
                "files": []
            }
        }

    try:
        with open(STATE_FILE, "r") as file:
            return json.load(file)

    except json.JSONDecodeError:
        print("Warning: state file is empty or invalid.")
        print("Creating a new state.")

        return {
            "imerg": {
                "last_ingested_timestamp": None,
                "files": []
            }
        }


# ---------------------------------------------------------
# Save ingestion state
# ---------------------------------------------------------

def save_state(state):

    with open(STATE_FILE, "w") as file:
        json.dump(
            state,
            file,
            indent=4
        )


# ---------------------------------------------------------
# Download one file
# ---------------------------------------------------------

def download_file(filename):

    url = BASE_URL + filename

    output_path = RAW_DIR / filename

    print()
    print("Downloading:")
    print(filename)

    response = requests.get(
        url,
        auth=(PPS_USERNAME, PPS_PASSWORD),
        stream=True,
        timeout=120
    )

    response.raise_for_status()

    # Write file in chunks
    with open(output_path, "wb") as file:

        for chunk in response.iter_content(chunk_size=1024 * 1024):

            if chunk:
                file.write(chunk)

    print("Saved:")
    print(output_path)

    return output_path


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

def main():

    print("=" * 60)
    print("IMERG LATEST FILE DOWNLOAD TEST")
    print("=" * 60)

    # -----------------------------------------------------
    # 1. Get files
    # -----------------------------------------------------

    files = get_file_list()

    print()
    print("Total 30-minute files found:", len(files))

    if not files:
        print("No IMERG files found.")
        return

    # -----------------------------------------------------
    # 2. Sort chronologically
    # -----------------------------------------------------

    files_with_timestamp = []

    for filename in files:

        timestamp = extract_timestamp(filename)

        if timestamp:

            files_with_timestamp.append(
                (timestamp, filename)
            )

    files_with_timestamp.sort(
        key=lambda x: x[0]
    )

    # -----------------------------------------------------
    # 3. Select latest few files
    # -----------------------------------------------------

    latest_files = files_with_timestamp[-NUMBER_OF_FILES:]

    print()
    print("Latest files selected:")

    for timestamp, filename in latest_files:

        print(timestamp, "->", filename)

    # -----------------------------------------------------
    # 4. Load state
    # -----------------------------------------------------

    state = load_state()

    imerg_state = state["imerg"]

    if "files" not in imerg_state:
        imerg_state["files"] = []

    # -----------------------------------------------------
    # 5. Download selected files
    # -----------------------------------------------------

    for timestamp, filename in latest_files:

        # Already recorded in state
        if filename in imerg_state["files"]:

            print()
            print("Already ingested - skipping:")
            print(filename)

            continue

        # File already exists locally
        output_path = RAW_DIR / filename

        if output_path.exists():

            print()
            print("File already exists locally - skipping:")
            print(filename)

            # Record it in state
            imerg_state["files"].append(filename)
            imerg_state["last_ingested_timestamp"] = timestamp

            save_state(state)

            continue

        # Download
        try:

            download_file(filename)

            # Only update state after successful download
            imerg_state["files"].append(filename)
            imerg_state["last_ingested_timestamp"] = timestamp

            save_state(state)

            print("State updated successfully.")

        except Exception as error:

            print()
            print("DOWNLOAD FAILED:")
            print(filename)
            print("Error:", error)

    print()
    print("=" * 60)
    print("DOWNLOAD TEST COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()