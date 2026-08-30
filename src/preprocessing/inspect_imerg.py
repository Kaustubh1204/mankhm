import rasterio
from pathlib import Path


def inspect_file(file_path):

    file_path = Path(file_path)

    print("=" * 60)
    print("IMERG FILE INSPECTION")
    print("=" * 60)

    print("File:")
    print(file_path)

    with rasterio.open(file_path) as src:

        print("\nDriver:")
        print(src.driver)

        print("\nWidth:")
        print(src.width)

        print("\nHeight:")
        print(src.height)

        print("\nBands:")
        print(src.count)

        print("\nData type:")
        print(src.dtypes)

        print("\nCRS:")
        print(src.crs)

        print("\nBounds:")
        print(src.bounds)

        print("\nNoData:")
        print(src.nodata)

        print("\nTransform:")
        print(src.transform)

        print("\nResolution:")
        print(src.res)

        print("\nMetadata:")
        for key, value in src.tags().items():
            print(
                f"  {key}: {value}"
            )


if __name__ == "__main__":

    inspect_file(
        "data/raw/imerg/YOUR_FILE.tif"
    )
    