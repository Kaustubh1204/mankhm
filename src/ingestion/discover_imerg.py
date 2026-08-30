import json

from src.ingestion.pps_client import PPSClient


def main():

    print("=" * 60)
    print("IMERG FILE DISCOVERY TEST")
    print("=" * 60)

    # ---------------------------------------------------------
    # Load configuration
    # ---------------------------------------------------------

    with open(
        "config/imerg.json",
        "r"
    ) as file:

        config = json.load(file)

    # ---------------------------------------------------------
    # Create PPS client
    # ---------------------------------------------------------

    client = PPSClient(config)

    # ---------------------------------------------------------
    # Get NASA directory listing
    # ---------------------------------------------------------

    html = client.get_directory_listing()

    # ---------------------------------------------------------
    # Find 30-minute files
    # ---------------------------------------------------------

    files = client.find_30min_files(html)

    print("\n30-minute IMERG files found:")
    print(len(files))

    # ---------------------------------------------------------
    # Display first 10
    # ---------------------------------------------------------

    for filename in files[-10:]:

        print(filename)

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()