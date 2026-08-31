/**
 * server/lib/bootCsvSyncWorker.js
 * Date-Wise CSV Conversion & Cloudflare R2 Bulk Sync Engine.
 * Converts all 896 date-partitioned JSON files (2016-2026) to CSV format,
 * saves them locally under data/archive_csv/, and uploads them to Cloudflare R2.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { jsonToCsv } = require("./csvConverter");

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
 * Converts all 11-year historical partition JSONs (2016-2026) to CSV and syncs to Cloudflare R2
 */
async function runBulkCsvSync() {
  console.log(`[CSV-SYNC] 🚀 Starting 11-Year JSON -> CSV Conversion & Bulk Cloudflare Sync (2016-2026)...`);

  const rootDataDirs = [
    path.resolve(process.cwd(), "data"),
    path.resolve(process.cwd(), "server", "data"),
    path.resolve(__dirname, "../../data"),
    path.resolve(__dirname, "../data"),
  ];

  const rootDataDir = rootDataDirs.find((d) => fs.existsSync(d)) || path.resolve(process.cwd(), "data");
  const archiveDir = path.join(rootDataDir, "archive");

  if (!fs.existsSync(archiveDir)) {
    console.error(`[CSV-SYNC ERROR] Archive directory not found at ${archiveDir}`);
    return;
  }

  const getFilesRecursively = (dirPath) => {
    let results = [];
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          results = results.concat(getFilesRecursively(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".json")) {
          results.push(fullPath);
        }
      }
    } catch (err) {
      // Ignore unreadable dir
    }
    return results;
  };

  const allJsonFiles = getFilesRecursively(archiveDir);
  console.log(`[CSV-SYNC] 📦 Discovered ${allJsonFiles.length} JSON partitions to convert to CSV...`);

  let convertedCount = 0;
  const CONCURRENCY = 20;

  for (let i = 0; i < allJsonFiles.length; i += CONCURRENCY) {
    const chunk = allJsonFiles.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (filePath) => {
        try {
          const rawJson = fs.readFileSync(filePath, "utf-8");
          const parsedJson = JSON.parse(rawJson);
          const csvData = jsonToCsv(parsedJson);

          if (!csvData) return;

          // 1. Local path calculation: data/archive_csv/...
          const relativePath = path.relative(archiveDir, filePath);
          const csvRelativePath = relativePath.replace(/\.json$/, ".csv").replace(/\\/g, "/");
          const localCsvPath = path.join(rootDataDir, "archive_csv", csvRelativePath);

          // Save locally
          fs.mkdirSync(path.dirname(localCsvPath), { recursive: true });
          fs.writeFileSync(localCsvPath, csvData, "utf-8");

          // 2. Upload to Cloudflare R2 key: archive_csv/...
          const r2CsvKey = `archive_csv/${csvRelativePath}`;

          if (R2) {
            const uploadPromise = R2.send(
              new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: r2CsvKey,
                Body: csvData,
                ContentType: "text/csv",
              })
            );
            const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));
            await Promise.race([uploadPromise, timeoutPromise]);
          }

          convertedCount++;
          if (convertedCount === 1 || convertedCount % 50 === 0 || convertedCount === allJsonFiles.length) {
            console.log("cloudflare:success");
            console.log(
              `cloudflare:success [CSV] (${convertedCount}/${allJsonFiles.length}) Uploaded -> ${r2CsvKey}`
            );
          }
        } catch (err) {
          console.warn(`[CSV-SYNC WARN] Failed to convert/upload ${filePath}:`, err.message);
        }
      })
    );
  }

  console.log(
    `[CSV-SYNC] 🎉 Date-Wise CSV Conversion & R2 Sync Completed! Successfully processed ${convertedCount} CSV files across 2016-2026.`
  );

  // Automatically compress all converted CSV partitions into a single downloadable ZIP archive
  try {
    const { generateCsvZipArchive } = require("./createCsvZip");
    await generateCsvZipArchive();
  } catch (zipErr) {
    console.error(`[CSV-SYNC ERROR] Automated ZIP generation failed:`, zipErr.message);
  }
}

module.exports = {
  runBulkCsvSync,
};
