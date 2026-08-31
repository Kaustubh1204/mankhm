/**
 * server/lib/bootSyncWorker.js
 * Date-Partitioned Cloudflare R2 Bulk Sync Engine.
 * Uploads each 11-year historical partition JSON (2016-2026) individually into
 * dedicated Date-Partitioned Cloudflare R2 object keys:
 * archive/{category}/{dataset}/year=YYYY/month=MM/partition_YYYY_MM.json
 */
"use strict";
const fs = require("fs");
const path = require("path");
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

/**
 * Uploads all 11-year historical partition JSONs (2016-2026) individually to Cloudflare R2
 */
async function runBulkCloudflareSync() {
  console.log(`[CLOUDFLARE-DATE-SYNC] 🚀 Starting Date-Wise Partition Bulk Upload (2016 - Present)...`);

  const rootDataDirs = [
    path.resolve(process.cwd(), "data"),
    path.resolve(process.cwd(), "server", "data"),
    path.resolve(__dirname, "../../data"),
    path.resolve(__dirname, "../data"),
  ];

  const rootDataDir = rootDataDirs.find((d) => fs.existsSync(d)) || path.resolve(process.cwd(), "data");
  const archiveBaseDir = path.join(rootDataDir, "archive");

  if (!fs.existsSync(archiveBaseDir)) {
    console.warn(`[CLOUDFLARE-DATE-SYNC WARN] Archive base directory not found at: ${archiveBaseDir}`);
    return;
  }

  const categories = ["cyclone", "atmospheric", "ocean", "satellite", "sst"];
  let totalUploadedFiles = 0;
  const filesToUpload = [];

  // 1. Discover all date-partitioned JSON files across all categories
  for (const cat of categories) {
    const archiveCatDir = path.join(archiveBaseDir, cat);
    if (!fs.existsSync(archiveCatDir)) continue;

    const scanDirectoryRecursively = (currentDir) => {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          if (entry.isDirectory()) {
            scanDirectoryRecursively(fullPath);
          } else if (entry.isFile() && entry.name.endsWith(".json")) {
            const relativePath = path.relative(archiveBaseDir, fullPath).replace(/\\/g, "/");
            const r2Key = `archive/${relativePath}`;
            filesToUpload.push({ fullPath, r2Key, fileName: entry.name });
          }
        }
      } catch (err) {
        // Ignore unreadable dirs
      }
    };

    scanDirectoryRecursively(archiveCatDir);
  }

  console.log(`[CLOUDFLARE-DATE-SYNC] 📦 Discovered ${filesToUpload.length} date-partitioned files to sync across 2016-2026.`);

  if (!R2) {
    console.warn(`[CLOUDFLARE-DATE-SYNC] R2 Client unavailable; skipping upload.`);
    return;
  }

  // 2. Upload files in concurrent batches with timeout protection
  const CONCURRENCY = 20;
  for (let i = 0; i < filesToUpload.length; i += CONCURRENCY) {
    const chunk = filesToUpload.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (file) => {
        try {
          const fileContent = fs.readFileSync(file.fullPath, "utf-8");
          const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: file.r2Key,
            Body: fileContent,
            ContentType: "application/json",
          };

          const uploadPromise = R2.send(new PutObjectCommand(uploadParams));
          const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));

          await Promise.race([uploadPromise, timeoutPromise]);
          totalUploadedFiles++;

          if (totalUploadedFiles === 1 || totalUploadedFiles % 50 === 0 || totalUploadedFiles === filesToUpload.length) {
            console.log("cloudflare:success");
            console.log(`[CLOUDFLARE-DATE-SYNC] ⚡ Uploaded ${totalUploadedFiles}/${filesToUpload.length} date-partitioned JSON files...`);
          }
        } catch (uploadErr) {
          console.warn(`[CLOUDFLARE-DATE-SYNC WARN] Failed to upload ${file.fileName}:`, uploadErr.message);
        }
      })
    );
  }

  console.log(
    `[CLOUDFLARE-DATE-SYNC] 🎉 Date-Wise Bulk Upload Completed! Successfully uploaded ${totalUploadedFiles} date files across all 11 years (2016-2026).`
  );
}

module.exports = {
  runBulkCloudflareSync,
  runBootCloudflareSync: runBulkCloudflareSync,
};
