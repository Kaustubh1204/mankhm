import os
import re
import requests

from pathlib import Path
from dotenv import load_dotenv


class PPSClient:

    def __init__(self, config):

        load_dotenv()

        self.username = os.getenv("PPS_USERNAME")
        self.password = os.getenv("PPS_PASSWORD")

        if not self.username or not self.password:
            raise RuntimeError(
                "PPS_USERNAME and PPS_PASSWORD must be present in .env"
            )

        self.base_url = config["source"]["base_url"]
        self.directory = config["source"]["directory"]

        self.session = requests.Session()

        self.session.auth = (
            self.username,
            self.password
        )

        self.session.headers.update({
            "User-Agent": "CycloneDataPipeline/1.0"
        })

    # ---------------------------------------------------------
    # TEST CONNECTION
    # ---------------------------------------------------------

    def test_connection(self):

        url = self.base_url + self.directory + "/"

        print("\nTesting PPS connection...")
        print(url)

        response = self.session.get(
            url,
            timeout=60
        )

        print("HTTP Status:", response.status_code)

        response.raise_for_status()

        return response

    # ---------------------------------------------------------
    # GET DIRECTORY LISTING
    # ---------------------------------------------------------

    def get_directory_listing(self):

        url = self.base_url + self.directory + "/"

        print("\nGetting IMERG directory listing...")
        print(url)

        response = self.session.get(
            url,
            timeout=60
        )

        print("HTTP Status:", response.status_code)

        response.raise_for_status()

        return response.text

    # ---------------------------------------------------------
    # FIND 30-MINUTE FILES
    # ---------------------------------------------------------

    def find_30min_files(self, html):

        # Find href="filename"
        hrefs = re.findall(
            r'href=["\']([^"\']+)["\']',
            html,
            flags=re.IGNORECASE
        )

        files = []

        for href in hrefs:

            filename = href.split("/")[-1]

            # We only want IMERG Early Run files
            if not filename.startswith("3B-HHR-E"):
                continue

            # We only want 30-minute products
            if not filename.lower().endswith(".30min.tif"):
                continue

            files.append(filename)

        # Remove duplicates and sort
        files = sorted(set(files))

        return files

    # ---------------------------------------------------------
    # DOWNLOAD FILE
    # ---------------------------------------------------------

    def download_file(
        self,
        filename,
        output_directory
    ):

        output_directory = Path(
            output_directory
        )

        output_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        url = (
            self.base_url
            + self.directory
            + "/"
            + filename
        )

        output_path = (
            output_directory
            / filename
        )

        print("\nDownloading:")
        print(url)

        print("\nSaving to:")
        print(output_path)

        # Don't download if already present
        if output_path.exists():

            print(
                "\nFile already exists. "
                "Skipping download."
            )

            return output_path

        response = self.session.get(
            url,
            stream=True,
            timeout=300
        )

        print(
            "HTTP Status:",
            response.status_code
        )

        response.raise_for_status()

        total = int(
            response.headers.get(
                "Content-Length",
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

                if total:

                    percentage = (
                        downloaded / total
                    ) * 100

                    print(
                        f"\rDownloaded: "
                        f"{percentage:.1f}%",
                        end=""
                    )

        print("\nDownload complete.")

        return output_path