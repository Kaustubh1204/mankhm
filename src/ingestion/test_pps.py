import json

from src.ingestion.pps_client import PPSClient


def main():

    with open(
        "config/imerg.json",
        "r"
    ) as file:

        config = json.load(file)

    client = PPSClient(config)

    response = client.test_connection()

    print("\nPPS CONNECTION SUCCESSFUL")

    print(
        "\nFirst 1000 characters of response:"
    )

    print(
        response.text[:1000]
    )


if __name__ == "__main__":
    main()
    