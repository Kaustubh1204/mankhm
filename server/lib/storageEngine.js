/**
 * server/lib/storageEngine.js
 * On-Disk Append-Only Storage & In-Memory StateBuffer Indexer.
 *
 * Stores raw ingested payloads under:
 *   data/raw/year=YYYY/month=MM/day=DD/{dataset_id}_{timestamp}.json
 *
 * Maintains an in-memory StateBuffer index for zero-latency (<4ms) route responses,
 * with automatic boot hydration from existing files on disk.
 */
"use strict";
const fs = require("node:fs/promises");
const path = require("node:path");
const EventEmitter = require("node:events");

const DATA_DIR = path.resolve(__dirname, "../../data/raw");
const eventBus = new EventEmitter();

// In-Memory Index for Instant Sub-4ms Reads
const StateBuffer = {
  latest: {},      // datasetKey -> { data, appendedAt, storagePath, records }
  seenGranules: new Set(), // Set of granule_ids already stored
};

/** Ensure target directory exists */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}

/** Get structured file path for dataset payload */
function getStoragePath(datasetId, dateObj = new Date()) {
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const timestamp = dateObj.toISOString().replace(/[:.]/g, "-");

  const subDir = path.join(DATA_DIR, `year=${year}`, `month=${month}`, `day=${day}`);
  const fileName = `${datasetId.toLowerCase()}_${timestamp}.json`;
  return { dirPath: subDir, filePath: path.join(subDir, fileName) };
}

/**
 * Appends a raw dataset payload to disk and updates StateBuffer memory index.
 * @param {string} datasetKey - e.g. "satellite:insat3ds", "ocean:oceansat3", "atmospheric:gpm", "cyclone:ibtracs"
 * @param {string} datasetId - e.g. "3SIMG_L1B_STD", "OSCAT_L2B_25"
 * @param {object} payload - real raw data JSON
 * @param {number} recordsCount - record count
 */
async function appendDataset(datasetKey, datasetId, payload, recordsCount = 0) {
  const { dirPath, filePath } = getStoragePath(datasetId);
  await ensureDir(dirPath);

  const fileContent = JSON.stringify({
    dataset_key: datasetKey,
    dataset_id: datasetId,
    appended_at: new Date().toISOString(),
    records_count: recordsCount,
    payload,
  }, null, 2);

  await fs.writeFile(filePath, fileContent, "utf8");

  // Track seen granule IDs if present
  if (Array.isArray(payload?.granules)) {
    payload.granules.forEach((g) => {
      if (g.granule_id) StateBuffer.seenGranules.add(g.granule_id);
    });
  } else if (payload?.granule_id) {
    StateBuffer.seenGranules.add(payload.granule_id);
  }

  // Update In-Memory Index
  StateBuffer.latest[datasetKey] = {
    data: payload,
    appendedAt: Date.now(),
    storagePath: filePath,
    records: recordsCount,
  };

  eventBus.emit("dataset_appended", { datasetKey, datasetId, filePath, recordsCount });
  console.log(`[STORAGE] Appended ${datasetKey} (${recordsCount} rec) → ${path.relative(process.cwd(), filePath)}`);
  return filePath;
}

/** Get latest entry from StateBuffer index */
function getLatest(datasetKey) {
  return StateBuffer.latest[datasetKey] ?? null;
}

/** Check if a granule_id has already been appended */
function hasGranule(granuleId) {
  return StateBuffer.seenGranules.has(granuleId);
}

/** Helper: Recursive file scanner for boot hydration */
async function scanFiles(dir) {
  let results = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of list) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const sub = await scanFiles(fullPath);
        results = results.concat(sub);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        results.push(fullPath);
      }
    }
  } catch (err) {
    // If directory doesn't exist yet, ignore
  }
  return results;
}

/** Hydrate StateBuffer on server boot from stored files in data/raw */
async function bootHydrate() {
  console.log("[STORAGE] Hydrating StateBuffer from disk...");
  const files = await scanFiles(DATA_DIR);
  if (!files.length) {
    console.log("[STORAGE] No existing stored datasets found on disk.");
    return;
  }

  // Sort files by name/timestamp ascending so latest overwrites earlier
  files.sort();

  let count = 0;
  for (const filePath of files) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const record = JSON.parse(content);
      if (record.dataset_key && record.payload) {
        StateBuffer.latest[record.dataset_key] = {
          data: record.payload,
          appendedAt: new Date(record.appended_at).getTime(),
          storagePath: filePath,
          records: record.records_count ?? 0,
        };

        // Re-populate seen granules
        if (Array.isArray(record.payload?.granules)) {
          record.payload.granules.forEach((g) => {
            if (g.granule_id) StateBuffer.seenGranules.add(g.granule_id);
          });
        } else if (record.payload?.granule_id) {
          StateBuffer.seenGranules.add(record.payload.granule_id);
        }

        count++;
      }
    } catch (err) {
      console.error(`[STORAGE] Error reading ${filePath}: ${err.message}`);
    }
  }

  console.log(`[STORAGE] Hydrated ${count} stored datasets across ${Object.keys(StateBuffer.latest).length} keys (${StateBuffer.seenGranules.size} granules tracked).`);
}

module.exports = {
  appendDataset,
  getLatest,
  hasGranule,
  bootHydrate,
  eventBus,
  StateBuffer,
};
