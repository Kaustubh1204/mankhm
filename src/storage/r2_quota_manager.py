"""
Cloudflare R2 Storage Quota Manager & One-Click Purge Engine.
Enforces strict storage quota < 9.0 GB (out of 10.0 GB free tier allowance).
Provides automated cleanup and 1-click purge links for email notifications & forecaster dashboards.
"""

import os
import json
import time
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Tuple

# Storage Limits (in Bytes)
MAX_R2_STORAGE_LIMIT_BYTES = 9.0 * 1024 * 1024 * 1024  # 9.0 GB Cap
WARNING_THRESHOLD_BYTES = 8.5 * 1024 * 1024 * 1024     # 8.5 GB Trigger Warning

LOCAL_STORAGE_BASE = Path(__file__).resolve().parent.parent.parent / "data" / "cloud_archive"


class R2QuotaManager:
    """
    Monitors Cloudflare R2 / local cloud archive bucket size and executes one-click purges.
    """

    def __init__(self):
        self._init_s3_client()

    def _init_s3_client(self):
        self.s3_client = None
        r2_account_id = os.getenv("R2_ACCOUNT_ID")
        r2_access_key_id = os.getenv("R2_ACCESS_KEY_ID")
        r2_secret_access_key = os.getenv("R2_SECRET_ACCESS_KEY")
        r2_bucket_name = os.getenv("R2_BUCKET_NAME", "cyclone-intelligence-archive")

        if r2_access_key_id and r2_secret_access_key and r2_account_id:
            try:
                import boto3
                import urllib3
                urllib3.disable_warnings()
                from botocore.config import Config
                endpoint_url = f"https://{r2_account_id}.r2.cloudflarestorage.com"
                self.s3_client = boto3.client(
                    "s3",
                    endpoint_url=endpoint_url,
                    aws_access_key_id=r2_access_key_id,
                    aws_secret_access_key=r2_secret_access_key,
                    region_name="auto",
                    config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
                    verify=False
                )
                self.bucket_name = r2_bucket_name
            except Exception as err:
                print(f"[R2 QUOTA WARN] S3/R2 client init failed ({err})")

    def get_storage_usage(self) -> Dict[str, Any]:
        """
        Calculates total stored bytes and object count in Cloudflare R2 / Local Archive.
        """
        total_bytes = 0
        total_objects = 0

        if self.s3_client:
            try:
                paginator = self.s3_client.get_paginator('list_objects_v2')
                for page in paginator.paginate(Bucket=getattr(self, 'bucket_name', 'cyclone-intelligence-archive')):
                    for obj in page.get('Contents', []):
                        total_bytes += obj['Size']
                        total_objects += 1
            except Exception as err:
                print(f"[R2 QUOTA WARN] Error calculating R2 bucket size: {err}")

        # If 0 objects found in R2 or using local fallback, check local storage
        if total_bytes == 0 and LOCAL_STORAGE_BASE.exists():
            for f in LOCAL_STORAGE_BASE.glob("**/*"):
                if f.is_file():
                    total_bytes += f.stat().st_size
                    total_objects += 1

        used_gb = round(total_bytes / (1024 ** 3), 4)
        pct_used = round((total_bytes / MAX_R2_STORAGE_LIMIT_BYTES) * 100.0, 2)
        warning_triggered = total_bytes >= WARNING_THRESHOLD_BYTES

        return {
            "status": "HEALTHY" if not warning_triggered else "WARNING_QUOTA_HIGH",
            "total_bytes": total_bytes,
            "total_objects": total_objects,
            "used_gb": used_gb,
            "quota_limit_gb": 9.0,
            "percent_used": pct_used,
            "warning_threshold_exceeded": warning_triggered
        }

    def execute_one_click_cleanup(self, days_to_keep: int = 14) -> Dict[str, Any]:
        """
        Purges archived satellite predictions older than `days_to_keep` (default 14 days)
        to keep storage < 9.0 GB.
        """
        deleted_count = 0
        reclaimed_bytes = 0
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_to_keep)

        # 1. Purge from Cloudflare R2
        if self.s3_client:
            try:
                paginator = self.s3_client.get_paginator('list_objects_v2')
                bucket = getattr(self, 'bucket_name', 'cyclone-intelligence-archive')
                delete_keys = []
                
                for page in paginator.paginate(Bucket=bucket):
                    for obj in page.get('Contents', []):
                        if obj['LastModified'] < cutoff_date:
                            delete_keys.append({'Key': obj['Key']})
                            reclaimed_bytes += obj['Size']

                if delete_keys:
                    # Delete in batches of 1000
                    for i in range(0, len(delete_keys), 1000):
                        batch = delete_keys[i:i+1000]
                        self.s3_client.delete_objects(Bucket=bucket, Delete={'Objects': batch})
                        deleted_count += len(batch)
                    print(f"[R2 CLEANUP SUCCESS] Deleted {deleted_count} old R2 objects. Reclaimed {round(reclaimed_bytes / (1024**2), 2)} MB.")
            except Exception as err:
                print(f"[R2 CLEANUP WARN] R2 deletion error: {err}")

        # 2. Purge local cloud archive
        if LOCAL_STORAGE_BASE.exists():
            for f in LOCAL_STORAGE_BASE.glob("**/*.json"):
                if f.is_file():
                    mtime = datetime.fromtimestamp(f.stat().st_mtime, tz=timezone.utc)
                    if mtime < cutoff_date:
                        size = f.stat().st_size
                        f.unlink()
                        deleted_count += 1
                        reclaimed_bytes += size

        return {
            "status": "SUCCESS",
            "purged_objects_count": deleted_count,
            "reclaimed_mb": round(reclaimed_bytes / (1024 ** 2), 2),
            "reclaimed_gb": round(reclaimed_bytes / (1024 ** 3), 4),
            "updated_storage": self.get_storage_usage()
        }


# Singleton instance
r2_quota_manager = R2QuotaManager()
