/**
 * server/routes/download.js
 * ZIP and Dataset Download Endpoints.
 * GET /api/v1/download/csv-zip
 */
"use strict";
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/**
 * Downloads the full 11-year CSV dataset ZIP archive
 * GET /api/v1/download/csv-zip
 */
router.get("/csv-zip", (req, res) => {
  const rootDataDirs = [
    path.resolve(process.cwd(), "data"),
    path.resolve(process.cwd(), "server", "data"),
    path.resolve(__dirname, "../../data"),
    path.resolve(__dirname, "../data"),
  ];

  const rootDataDir = rootDataDirs.find((d) => fs.existsSync(d)) || path.resolve(process.cwd(), "data");
  const zipPath = path.join(rootDataDir, "weather_dataset_2016_2026_csv.zip");

  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, "weather_dataset_2016_2026_csv.zip");
  } else {
    return res.status(404).json({
      status: "error",
      message: "ZIP file not generated yet",
    });
  }
});

module.exports = router;
