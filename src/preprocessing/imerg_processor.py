import json
import re
from pathlib import Path
from datetime import datetime

import numpy as np
import rasterio
from rasterio.windows import from_bounds


class IMERGProcessor:

    def __init__(
        self,
        input_file,
        output_directory,
        metadata_directory,
        region
    ):

        self.input_file = Path(
            input_file
        )

        self.output_directory = Path(
            output_directory
        )

        self.metadata_directory = Path(
            metadata_directory
        )

        self.region = region
        
        self.scale_factor = 0.1

        self.output_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        self.metadata_directory.mkdir(
            parents=True,
            exist_ok=True
        )

    def process(self):

        with rasterio.open(self.input_file) as src:

            print("\nInput raster:")
            print(src.width, "x", src.height)

            print("Original bounds:", src.bounds)

            window = from_bounds(
                self.region["min_lon"],
                self.region["min_lat"],
                self.region["max_lon"],
                self.region["max_lat"],
                src.transform
            )

            window = window.round_offsets().round_lengths()

            data = src.read(
                1,
                window=window
            )

            transform = src.window_transform(window)

            print("Cropped shape:", data.shape)

            # Convert to float32 before replacing missing values
            data = data.astype(np.float32)

            # IMERG GIS missing-data value
            # NASA documentation: 29999 = missing data
            missing_value = 29999

            missing_count = np.sum(data == missing_value)

            print("Missing-value pixels:", missing_count)

            # Convert missing values to NaN
            data[data == missing_value] = np.nan

            # IMERG Early 30-minute GeoTIFF:
            # stored values are scaled by 10
            # physical value = stored value * 0.1 mm
            data *= self.scale_factor

            print(
                "Valid precipitation range:",
                np.nanmin(data),
                "to",
                np.nanmax(data),
                "mm"
            )

            print(
                "Valid pixel count:",
                np.sum(np.isfinite(data))
            )

            print(
                "Missing pixel count:",
                np.sum(~np.isfinite(data))
            )

            return (
                data,
                transform,
                src.crs
            )
            
    def extract_timestamp(self):
        """
        Extract the start timestamp from the IMERG filename.

        Example:
        3B-HHR-E.MS.MRG.3IMERG.20260830-S013000-E015959.0090.V07C.30min.tif

        → 2026-08-30T01:30:00Z
        """

        filename = self.input_file.name

        match = re.search(
            r"(\d{8})-S(\d{6})",
            filename
        )

        if not match:
            raise ValueError(
                f"Could not extract timestamp from filename: {filename}"
            )

        date_part = match.group(1)
        time_part = match.group(2)

        timestamp = datetime.strptime(
            date_part + time_part,
            "%Y%m%d%H%M%S"
        )

        return timestamp.strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )
        
    def save_json(
        self,
        array,
        transform,
        crs,
        filename
    ):
        """
        Save processed IMERG raster as JSON.
        """

        height, width = array.shape

        # Calculate pixel-center coordinates
        longitudes = [
            transform.c + (col + 0.5) * transform.a
            for col in range(width)
        ]

        latitudes = [
            transform.f + (row + 0.5) * transform.e
            for row in range(height)
        ]

        # Convert NumPy values into JSON-safe values.
        # NaN becomes None → JSON null.
        precipitation = []

        for row in array:
            precipitation.append([
                None if not np.isfinite(value)
                else float(value)
                for value in row
            ])

        timestamp = self.extract_timestamp()

        output_path = (
            self.output_directory
            / f"{filename}.json"
        )

        json_data = {
            "dataset": "GPM IMERG Early Run",
            "product": "3B-HHR-E",
            "version": "V07",
            "timestamp": timestamp,

            "region": {
                "name": self.region["name"]
                if "name" in self.region
                else "Configured Region",

                "min_lat": self.region["min_lat"],
                "max_lat": self.region["max_lat"],
                "min_lon": self.region["min_lon"],
                "max_lon": self.region["max_lon"]
            },

            "spatial": {
                "width": width,
                "height": height,
                "resolution_degrees": 0.1,
                "crs": str(crs)
            },

            "variable": {
                "name": "precipitation",
                "unit": "mm",
                "temporal_resolution_minutes": 30
            },

            "coordinates": {
                "latitude": latitudes,
                "longitude": longitudes
            },

            "data": precipitation
        }

        with open(
            output_path,
            "w"
        ) as file:

            json.dump(
                json_data,
                file,
                indent=2
            )

        print(
            "\nJSON saved:",
            output_path
        )

        return output_path

    def normalize(self, array):

        valid = np.isfinite(
            array
        )

        if not np.any(valid):
            return array

        minimum = np.nanmin(
            array
        )

        maximum = np.nanmax(
            array
        )

        if maximum == minimum:

            return np.zeros_like(
                array,
                dtype=np.float32
            )

        normalized = (
            array - minimum
        ) / (
            maximum - minimum
        )

        normalized[
            ~valid
        ] = np.nan

        return normalized.astype(
            np.float32
        )

    def save(
        self,
        array,
        filename,
        metadata
    ):

        output_path = (
            self.output_directory
            / f"{filename}.npy"
        )

        metadata_path = (
            self.metadata_directory
            / f"{filename}.json"
        )

        np.save(
            output_path,
            array
        )

        with open(
            metadata_path,
            "w"
        ) as file:

            json.dump(
                metadata,
                file,
                indent=4
            )

        print(
            "\nProcessed array saved:",
            output_path
        )

        print(
            "Metadata saved:",
            metadata_path
        )

        return (
            output_path,
            metadata_path
        )