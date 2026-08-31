/**
 * server/lib/createCsvZip.js
 * Automated ZIP Compression Engine for all 11-Year CSV Datasets.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

/**
 * Compresses the data/archive_csv directory into a single ZIP file
 */
async function generateCsvZipArchive() {
  return new Promise((resolve, reject) => {
    console.log(`[ZIP-ENGINE] 📦 Creating compressed ZIP archive of all CSV datasets...`);

    const rootDataDirs = [
      path.resolve(process.cwd(), "data"),
      path.resolve(process.cwd(), "server", "data"),
      path.resolve(__dirname, "../../data"),
      path.resolve(__dirname, "../data"),
    ];

    const rootDataDir = rootDataDirs.find((d) => fs.existsSync(d)) || path.resolve(process.cwd(), "data");

    const csvSourceDir = path.join(rootDataDir, "archive_csv");
    const zipOutputPath = path.join(rootDataDir, "weather_dataset_2016_2026_csv.zip");
    const desktopPath = "C:\\Users\\kingk\\Desktop\\weather_dataset_2016_2026_csv.zip";

    if (!fs.existsSync(csvSourceDir)) {
      console.error(`[ZIP-ENGINE ERROR] CSV source folder not found at ${csvSourceDir}`);
      return reject(new Error("CSV Directory missing"));
    }

    const output = fs.createWriteStream(zipOutputPath);
    const archive =
      typeof archiver === "function"
        ? archiver("zip", { zlib: { level: 9 } })
        : new archiver.ZipArchive({ zlib: { level: 9 } }); // Maximum compression

    output.on("close", () => {
      const sizeMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
      console.log(`[ZIP-ENGINE] 🎉 ZIP Created Successfully! Size: ${sizeMB} MB`);
      console.log(`[ZIP-ENGINE] 📍 Saved at: ${zipOutputPath}`);

      // Copy to Desktop for direct access
      try {
        fs.copyFileSync(zipOutputPath, desktopPath);
        console.log(`[ZIP-ENGINE] 💻 Copied ZIP directly to Desktop: ${desktopPath}`);
      } catch (err) {
        console.warn(`[ZIP-ENGINE WARN] Could not copy to Desktop: ${err.message}`);
      }

      resolve(zipOutputPath);
    });

    archive.on("error", (err) => {
      console.error(`[ZIP-ENGINE ERROR] Archiving error:`, err);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(csvSourceDir, "archive_csv");
    archive.finalize();
  });
}

module.exports = {
  generateCsvZipArchive,
};
