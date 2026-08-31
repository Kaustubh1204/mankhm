from pathlib import Path
from datetime import datetime, timezone
import hashlib


# =========================================================
# Lane configuration
# =========================================================

REALTIME_LANE = "realtime"
BATCH_LANE = "batch"


# =========================================================
# Timestamp extraction
# =========================================================

def extract_timestamp_from_filename(
    filename
):

    import re

    match = re.search(
        r'\.(\d{8})-S(\d{6})-',
        filename
    )

    if not match:

        raise ValueError(
            f"Could not extract timestamp from: {filename}"
        )

    date_part = match.group(1)
    time_part = match.group(2)

    timestamp = datetime.strptime(
        date_part + time_part,
        "%Y%m%d%H%M%S"
    )

    return timestamp.replace(
        tzinfo=timezone.utc
    )


# =========================================================
# Idempotency key
# =========================================================

def create_idempotency_key(
    source,
    product,
    event_time
):

    raw_value = (
        f"{source}|"
        f"{product}|"
        f"{event_time.isoformat()}"
    )

    return hashlib.sha256(
        raw_value.encode("utf-8")
    ).hexdigest()


# =========================================================
# Create ingestion event
# =========================================================

def create_event(
    file_path,
    lane
):

    file_path = Path(file_path)

    event_time = (
        extract_timestamp_from_filename(
            file_path.name
        )
    )

    event = {

        "source": "NASA_PPS",

        "dataset": (
            "GPM IMERG Early Run"
        ),

        "product": "3B-HHR-E",

        "version": "V07",

        "event_time": (
            event_time.isoformat()
        ),

        "ingested_at": (
            datetime.now(
                timezone.utc
            ).isoformat()
        ),

        "lane": lane,

        "region": "Bay of Bengal",

        "file_name": file_path.name,

        "local_path": str(
            file_path
        ),

        "idempotency_key": (
            create_idempotency_key(
                "NASA_PPS",
                "3B-HHR-E",
                event_time
            )
        ),

        "processing_status": (
            "pending"
        )
    }

    return event


# =========================================================
# Route a file
# =========================================================

def route_file(
    file_path,
    lane
):

    if lane not in {
        REALTIME_LANE,
        BATCH_LANE
    }:

        raise ValueError(
            f"Unknown processing lane: {lane}"
        )

    event = create_event(
        file_path,
        lane
    )

    print()
    print(
        "Routing event:"
    )

    print(
        "  Source:",
        event["source"]
    )

    print(
        "  Product:",
        event["product"]
    )

    print(
        "  Event time:",
        event["event_time"]
    )

    print(
        "  Lane:",
        event["lane"]
    )

    print(
        "  File:",
        event["file_name"]
    )

    return event