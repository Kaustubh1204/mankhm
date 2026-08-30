from pathlib import Path
import json
from fastapi import FastAPI, HTTPException


app = FastAPI(
    title="Cyclone Prediction Data API",
    version="1.0.0"
)


PROCESSED_DIR = Path("data/processed/imerg")


def load_processed_files():

    files = list(
        PROCESSED_DIR.glob("*.json")
    )

    records = []

    for file_path in files:

        try:

            with open(
                file_path,
                "r",
                encoding="utf-8"
            ) as file:

                data = json.load(file)

            timestamp = data.get(
                "timestamp"
            )

            if timestamp:

                records.append(
                    (
                        timestamp,
                        data
                    )
                )

        except Exception as error:

            print(
                f"Skipping {file_path}: {error}"
            )

    records.sort(
        key=lambda x: x[0]
    )

    return records


@app.get("/api/v1/forecast-input")
def get_forecast_input():

    records = load_processed_files()

    if not records:

        raise HTTPException(
            status_code=404,
            detail="No processed IMERG data available."
        )

    latest_records = records[-12:]

    return {
        "dataset": "GPM IMERG Early Run",
        "source": "NASA PPS",
        "region": "Bay of Bengal",
        "temporal_resolution_minutes": 30,
        "window_hours": 6,
        "observation_count": len(
            latest_records
        ),
        "observations": [
            data
            for timestamp, data
            in latest_records
        ]
    }