import json
from pathlib import Path
from datetime import datetime, timezone

import requests


class PMMClient:

    def __init__(self, config_path):

        with open(config_path, "r") as file:
            self.config = json.load(file)

        self.base_url = self.config["api"]["base_url"]
        self.search_endpoint = self.config["api"]["search_endpoint"]

        self.search_url = (
            self.base_url + self.search_endpoint
        )

    def search(self, start_date=None, end_date=None):

        search_config = self.config["search"]

        params = {
            "q": self.config["dataset"]["product"],
            "lat": search_config["latitude"],
            "lon": search_config["longitude"],
            "limit": search_config["limit"]
        }

        if start_date:
            params["startTime"] = start_date

        if end_date:
            params["endTime"] = end_date

        print("\nSending request to:")
        print(self.search_url)

        print("\nParameters:")
        print(params)

        response = requests.get(
            self.search_url,
            params=params,
            timeout=60
        )

        response.raise_for_status()

        print("\n========== NASA RESPONSE DEBUG ==========")
        print("HTTP Status:", response.status_code)
        print("Content-Type:", response.headers.get("Content-Type"))
        print("Final URL:", response.url)
        print("Response length:", len(response.text))

        print("\nResponse body:")
        print(response.text[:5000])

        print("=========================================\n")

        return response.json()

    def get_download_url(self, item):

        actions = item.get("action", [])

        for action in actions:

            if action.get("@type") != "ojo:download":
                continue

            using = action.get("using", [])

            for request in using:

                media_type = request.get(
                    "mediaType",
                    ""
                )

                if media_type == "image/tiff":

                    return request.get("url")

        return None

    def download_file(
        self,
        url,
        output_path
    ):

        output_path = Path(output_path)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        print("\nDownloading:")
        print(url)

        with requests.get(
            url,
            stream=True,
            timeout=120
        ) as response:

            response.raise_for_status()

            total_size = int(
                response.headers.get(
                    "content-length",
                    0
                )
            )

            downloaded = 0

            with open(
                output_path,
                "wb"
            ) as file:

                for chunk in response.iter_content(
                    chunk_size=1024 * 1024
                ):

                    if not chunk:
                        continue

                    file.write(chunk)

                    downloaded += len(chunk)

                    if total_size:
                        percentage = (
                            downloaded /
                            total_size
                        ) * 100

                        print(
                            f"\rDownloaded: "
                            f"{percentage:.1f}%",
                            end=""
                        )

        print("\nDownload complete.")

        return output_path