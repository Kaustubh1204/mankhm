from pathlib import Path
from datetime import datetime, timedelta, timezone

from src.ingestion.pmm_client_old import PMMClient


CONFIG_PATH = "config/imerg.json"


def main():

    client = PMMClient(CONFIG_PATH)

    # Use today's date and yesterday's date.
    # PMM API documentation says recent data
    # are available for the latest 60 days.

    today = datetime.now(
        timezone.utc
    ).date()

    yesterday = today - timedelta(days=1)

    start_date = yesterday.isoformat()
    end_date = today.isoformat()

    print("=" * 60)
    print("GPM IMERG INGESTION TEST")
    print("=" * 60)

    response = client.search(
        start_date=start_date,
        end_date=end_date
    )

    print("\nTotal items:")
    print(
        response.get(
            "totalItems",
            0
        )
    )

    items = response.get(
        "items",
        []
    )

    if not items:

        print(
            "\nNo datasets found."
        )

        return

    for item in items:

        print("\n--------------------------------")

        print(
            "Dataset:",
            item.get(
                "displayName"
            )
        )

        print(
            "ID:",
            item.get("@id")
        )

        download_url = (
            client.get_download_url(
                item
            )
        )

        if not download_url:

            print(
                "No GeoTIFF download URL found."
            )

            continue

        print(
            "GeoTIFF URL:",
            download_url
        )

        filename = (
            item.get(
                "displayName",
                "imerg"
            ) + ".tif"
        )

        output_path = (
            Path("data/raw/imerg")
            / filename
        )

        client.download_file(
            download_url,
            output_path
        )

        print(
            "\nSaved:",
            output_path
        )

        # Only download one file during
        # our first test.
        break


if __name__ == "__main__":
    main()