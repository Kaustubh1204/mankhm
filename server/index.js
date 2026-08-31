/**
 * server/index.js
 * Entry point — validates env, hydrates storage engine, wires routes, starts Express server & scheduler.
 */
"use strict";
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

// --- Boot-time credential validation ---
const REQUIRED_ENV = ["MOSDAC_USERNAME", "MOSDAC_PASSWORD"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[FATAL] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const express = require("express");
const app = express();
app.use(express.json({ limit: "1mb" }));

// ─── Nanosecond Latency Telemetry Middleware ─────────────────────────
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  const timestamp = new Date().toISOString();

  res.locals.telemetry = {
    dataset: "N/A",
    source: "N/A",
    records_fetched: 0,
    upstream_fetch_ms: 0,
  };

  res.on("finish", () => {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = (Number(durationNs) / 1e6).toFixed(3);
    const payloadSizeBytes = res.getHeader("content-length") || "0";
    const payloadKB = (Number(payloadSizeBytes) / 1024).toFixed(2);

    const slaStatus = Number(durationMs) <= 4.0 ? "⚡ SLA PASS" : "⚠️ SLA WARN";

    console.log(
      `[LATENCY] ${timestamp} | ` +
      `${req.method} ${req.originalUrl} | ` +
      `Status: ${res.statusCode} | ` +
      `Time: ${durationMs}ms [${slaStatus}] | ` +
      `Dataset: ${res.locals.telemetry.dataset} | ` +
      `Source: ${res.locals.telemetry.source} | ` +
      `Records: ${res.locals.telemetry.records_fetched} (${payloadKB} KB)`
    );
  });

  next();
});

const satelliteRouter = require("./routes/satellite");
const oceanRouter = require("./routes/ocean");
const atmosphericRouter = require("./routes/atmospheric");
const cycloneRouter = require("./routes/cyclone");

// 1. Health check & index endpoint
app.get("/", (req, res) => res.json({ status: "ok", api_version: "v1" }));
app.get("/health", (req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// 2. Mount API Routers
app.use("/api/v1/satellite", satelliteRouter);
app.use("/api/v1/ocean", oceanRouter);
app.use("/api/v1/atmospheric", atmosphericRouter);
app.use("/api/v1/cyclone", cycloneRouter);

// 3. Catch-all 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requested_path: req.originalUrl,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("[Unhandled]", err);
  res.status(err.statusCode || 500).json({ error: err.message ?? "Internal server error" });
});

const { bootHydrate } = require("./lib/storageEngine");
const { startScheduler } = require("./lib/scheduler");

const PORT = parseInt(process.env.PORT ?? "3000", 10);

async function startServer() {
  // Boot hydration from disk first
  await bootHydrate();

  app.listen(PORT, () => {
    console.log(`[server] Listening on port ${PORT} | MOSDAC User: ${process.env.MOSDAC_USERNAME}`);
    // Start dual-trigger scheduler
    startScheduler();
  });
}

startServer().catch((err) => {
  console.error("[FATAL] Server boot failed:", err);
  process.exit(1);
});