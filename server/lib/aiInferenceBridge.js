/**
 * server/lib/aiInferenceBridge.js
 * Bridges Node.js MOSDAC Data Ingestion with Python AI Prediction Server.
 * Sends ingested satellite payloads to http://localhost:8000/api/v1/predict/realtime
 * and /batch, caching predictions into Node.js StateBuffer for sub-4ms WebSocket distribution.
 */

"use strict";

const axios = require("axios");

const AI_SERVER_URL = process.env.AI_INFERENCE_URL || "http://localhost:8000";

/**
 * Triggers Realtime Speed Lane Prediction on incoming satellite frame payload.
 */
async function triggerRealtimeAIInference(payload) {
  try {
    const start = process.hrtime.bigint();
    const response = await axios.post(`${AI_SERVER_URL}/api/v1/predict/realtime`, {
      storm_id: payload.storm_id || "BOB_01_2026",
      ref_lat: payload.coordinates ? payload.coordinates.lat : 16.5,
      ref_lon: payload.coordinates ? payload.coordinates.lon : 87.2,
    }, { timeout: 3000 });

    const durationNs = process.hrtime.bigint() - start;
    const bridgeMs = (Number(durationNs) / 1e6).toFixed(2);

    if (response.data && response.data.status === "SUCCESS") {
      console.log(`[AI BRIDGE] ⚡ Realtime Prediction Received in ${bridgeMs}ms | Category: ${response.data.intensity.imd_category}`);
      return response.data;
    }
  } catch (err) {
    console.error(`[AI BRIDGE WARN] Realtime prediction call failed: ${err.message}`);
    return null;
  }
}

/**
 * Triggers Batch Synoptic Lane Prediction (6-hour cadence).
 */
async function triggerBatchAIInference(payload) {
  try {
    const response = await axios.post(`${AI_SERVER_URL}/api/v1/predict/batch`, {
      storm_id: payload.storm_id || "BOB_01_2026",
      current_lat: payload.current_lat || 16.5,
      current_lon: payload.current_lon || 87.2,
    }, { timeout: 5000 });

    if (response.data && response.data.status === "SUCCESS") {
      console.log(`[AI BRIDGE] 🌊 Batch 72h Track & RI Alert Received | RI Prob: ${response.data.rapid_intensification.ri_probability}`);
      return response.data;
    }
  } catch (err) {
    console.error(`[AI BRIDGE WARN] Batch prediction call failed: ${err.message}`);
    return null;
  }
}

module.exports = {
  triggerRealtimeAIInference,
  triggerBatchAIInference,
};
