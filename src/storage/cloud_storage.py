"""
Dual-Lane Cloud Storage Archiving Engine for Realtime & Batch Cyclone Intelligence.
Supports Cloudflare R2 (100% Free - 10 GB Allowance, 0 Egress Fees), AWS S3, GCP Storage,
and local disk fallback under data/cloud_archive/.
"""

import os
import json
import time
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, Optional

# Base directory for local fallback storage
LOCAL_STORAGE_BASE = Path(__file__).resolve().parent.parent.parent / "data" / "cloud_archive"

# Cloudflare R2 / S3 Credentials from environment
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "cyclone-intelligence-archive")


class CloudStorageArchiver:
    """
    Handles partitioning, indexing, and persistent storage of Realtime & Batch cyclone predictions.
    """

    def __init__(self, local_base: Path = LOCAL_STORAGE_BASE):
        self.local_base = local_base
        self.local_base.mkdir(parents=True, exist_ok=True)
        self._init_s3_client()

    def _init_s3_client(self):
        """Initializes boto3 S3 client for Cloudflare R2 or AWS S3 if credentials are provided."""
        self.s3_client = None
        if R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY and R2_ACCOUNT_ID:
            try:
                import boto3
                endpoint_url = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
                self.s3_client = boto3.client(
                    "s3",
                    endpoint_url=endpoint_url,
                    aws_access_key_id=R2_ACCESS_KEY_ID,
                    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
                    region_name="auto"
                )
                print(f"[CLOUD STORAGE] Connected to Cloudflare R2 Bucket: '{R2_BUCKET_NAME}'")
            except Exception as err:
                print(f"[CLOUD STORAGE WARN] S3/R2 client init failed ({err}). Using local cloud archive fallback.")
        else:
            print("[CLOUD STORAGE] No cloud credentials found. Archiving to local cloud storage pool.")

    def archive_realtime_prediction(self, payload: Dict[str, Any]) -> str:
        """
        Archives 15-minute Realtime Speed Lane prediction data.
        Storage partition: realtime/year=YYYY/month=MM/day=DD/storm_{storm_id}_{timestamp}.json
        """
        now = datetime.now(timezone.utc)
        year = now.strftime("%Y")
        month = now.strftime("%m")
        day = now.strftime("%d")
        ts_str = now.strftime("%Y%m%d_%H%M%S")

        storm_id = payload.get("storm_id", "UNKNOWN_STORM")
        rel_path = f"realtime/year={year}/month={month}/day={day}/storm_{storm_id}_{ts_str}.json"
        
        return self._save_payload(rel_path, payload)

    def archive_batch_prediction(self, payload: Dict[str, Any]) -> str:
        """
        Archives 6-hour Batch Synoptic Lane prediction data (72h track cone & RI alert).
        Storage partition: batch/year=YYYY/month=MM/day=DD/storm_{storm_id}_{timestamp}.json
        """
        now = datetime.now(timezone.utc)
        year = now.strftime("%Y")
        month = now.strftime("%m")
        day = now.strftime("%d")
        ts_str = now.strftime("%Y%m%d_%H%M%S")

        storm_id = payload.get("storm_id", "UNKNOWN_STORM")
        rel_path = f"batch/year={year}/month={month}/day={day}/storm_{storm_id}_{ts_str}.json"

        return self._save_payload(rel_path, payload)

    def _save_payload(self, rel_path: str, payload: Dict[str, Any]) -> str:
        # Add metadata headers
        archive_record = {
            "archived_at_utc": datetime.now(timezone.utc).isoformat(),
            "storage_partition": rel_path,
            "data": payload
        }

        # 1. Save to local cloud storage folder
        local_file = self.local_base / rel_path
        local_file.parent.mkdir(parents=True, exist_ok=True)
        with open(local_file, "w", encoding="utf-8") as f:
            json.dump(archive_record, f, indent=2)

        # 2. Upload to Cloudflare R2 / S3 if client available
        if self.s3_client:
            try:
                self.s3_client.put_object(
                    Bucket=R2_BUCKET_NAME,
                    Key=rel_path,
                    Body=json.dumps(archive_record),
                    ContentType="application/json"
                )
                print(f"[CLOUD STORAGE] Synced {rel_path} to Cloudflare R2")
            except Exception as err:
                print(f"[CLOUD STORAGE WARN] Failed to sync {rel_path} to R2: {err}")

        return str(local_file)


# Singleton instance for simple imports
cloud_archiver = CloudStorageArchiver()
