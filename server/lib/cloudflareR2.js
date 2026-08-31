/**
 * server/lib/cloudflareR2.js
 * Cloudflare R2 Storage Sync Engine.
 * Syncs dataset payload JSON directly to Cloudflare R2 bucket asynchronously.
 */
"use strict";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const accountId =
  process.env.CLOUDFLARE_R2_ACCOUNT_ID ||
  process.env.R2_ACCOUNT_ID ||
  "9b71ceec4d29765773ad3dcc4b1d57da";

const endpoint =
  process.env.CLOUDFLARE_R2_ENDPOINT ||
  `https://${accountId}.r2.cloudflarestorage.com`;

const accessKeyId =
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
  process.env.R2_ACCESS_KEY_ID ||
  "1cb4e89d7acab6c51887acb43b27ee94";

const secretAccessKey =
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
  process.env.R2_SECRET_ACCESS_KEY ||
  "2f74d4d3e1213e87499ef7bf7f9a35d0f4869ea57f780fbfe2bafe8a7d9e5676";

const BUCKET_NAME =
  process.env.CLOUDFLARE_R2_BUCKET ||
  process.env.R2_BUCKET_NAME ||
  "cyclone-intelligence-archive";

const PUBLIC_DOMAIN =
  process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN ||
  "https://pub-9b71ceec4d29.r2.dev";

// Initialize Cloudflare R2 Client (using S3-compatible API)
let R2 = null;
try {
  R2 = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
} catch (err) {
  console.warn(`[CLOUDFLARE R2] S3Client init warning: ${err.message}`);
}

// In-Memory Sync Memoization to prevent redundant synchronous upload bottlenecks
const syncCache = new Map(); // datasetName -> { result, timestamp }
const SYNC_CACHE_TTL_MS = 60000; // 1 min sync throttle per dataset

/**
 * Syncs dataset payload JSON directly to Cloudflare R2 bucket asynchronously
 * @param {string} datasetName - e.g. "cyclone_ground_truth", "atmospheric_profiles", "ocean_vector", "satellite_geostationary"
 * @param {Array|Object} payloadData - Dataset records array
 */
async function syncPayloadToCloudflareR2(datasetName, payloadData) {
  const dateStr = new Date().toISOString().split("T")[0];
  const fileName = `datasets/${datasetName}/latest_${datasetName}_${dateStr}.json`;
  const cloudflareUrl = `${PUBLIC_DOMAIN}/${fileName}`;

  const now = Date.now();
  const cached = syncCache.get(datasetName);
  if (cached && now - cached.timestamp < SYNC_CACHE_TTL_MS) {
    if (cached.result && cached.result.synced) {
      console.log("cloudflare:success");
    }
    return cached.result;
  }

  // Generate metadata object
  const defaultResult = {
    synced: false,
    storage_status: "LOCAL_STORED_R2_PENDING",
    r2_url: cloudflareUrl,
    bucket: BUCKET_NAME,
    key: fileName,
  };

  if (!R2) {
    return defaultResult;
  }

  const uploadTask = async () => {
    try {
      const bodyString = JSON.stringify(
        {
          dataset: datasetName,
          synced_at: new Date().toISOString(),
          record_count: Array.isArray(payloadData) ? payloadData.length : 1,
          data: payloadData,
        },
        null,
        2
      );

      const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: bodyString,
        ContentType: "application/json",
      };

      await R2.send(new PutObjectCommand(params));
      const successResult = {
        synced: true,
        r2_url: cloudflareUrl,
        bucket: BUCKET_NAME,
        key: fileName,
        synced_at: new Date().toISOString(),
      };
      console.log("cloudflare:success");
      console.log(`[CLOUDFLARE R2] ⚡ cloudflare:success | Synced ${datasetName} -> ${cloudflareUrl}`);
      syncCache.set(datasetName, { result: successResult, timestamp: Date.now() });
      return successResult;
    } catch (error) {
      console.warn(`[CLOUDFLARE R2 WARNING] Cloudflare upload fallback (Local Mode Active): ${error.message}`);
      const fallbackResult = {
        synced: false,
        storage_status: "LOCAL_STORED_R2_PENDING",
        r2_url: cloudflareUrl,
        bucket: BUCKET_NAME,
        key: fileName,
        error: error.message,
      };
      syncCache.set(datasetName, { result: fallbackResult, timestamp: Date.now() });
      return fallbackResult;
    }
  };

  // Perform upload with 1500ms timeout race to ensure API route responses remain sub-millisecond fast
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve(defaultResult), 1500)
  );

  const result = await Promise.race([uploadTask(), timeoutPromise]);
  return result || defaultResult;
}

module.exports = {
  syncPayloadToCloudflareR2,
  R2,
};
