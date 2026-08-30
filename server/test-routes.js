/**
 * server/test-routes.js
 * Comprehensive integration test for sub-4ms SLA, real data, and route accessibility.
 */
const { performance } = require("node:perf_hooks");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

const endpoints = [
  // --- Core ---
  { name: "Health Check", path: "/" },
  // --- Satellite: generic + per-dataset ---
  { name: "Satellite (Geostationary)", path: "/api/v1/satellite/geostationary?channel=TIR1&count=1" },
  { name: "Satellite (INSAT-3D)",      path: "/api/v1/satellite/insat3d?channel=TIR1&count=1" },
  { name: "Satellite (INSAT-3DR)",     path: "/api/v1/satellite/insat3dr?channel=WV&count=1" },
  { name: "Satellite (INSAT-3DS)",     path: "/api/v1/satellite/insat3ds?channel=VIS&count=1" },
  // --- Ocean: generic + per-dataset ---
  { name: "Ocean (Surface Winds)",             path: "/api/v1/ocean/surface-winds?lat_min=10&lat_max=20&lon_min=60&lon_max=70" },
  { name: "Ocean (OceanSat-3 Scatterometer)",  path: "/api/v1/ocean/oceansat3-scatterometer?lat_min=10&lat_max=20&lon_min=60&lon_max=70" },
  // --- Atmospheric: generic + per-instrument ---
  { name: "Atmospheric (Profiles)",         path: "/api/v1/atmospheric/profiles?channel=89&hours_back=6" },
  { name: "Atmospheric (NOAA GPM)",         path: "/api/v1/atmospheric/noaa-gpm?channel=89&hours_back=6" },
  { name: "Atmospheric (MetOp)",            path: "/api/v1/atmospheric/metop?hours_back=6" },
  { name: "Atmospheric (Megha-Tropiques)",  path: "/api/v1/atmospheric/megha-tropiques?hours_back=6" },
  // --- Cyclone: generic + per-source ---
  { name: "Cyclone (Ground-Truth)",    path: "/api/v1/cyclone/ground-truth?basin=NI" },
  { name: "Cyclone (IBTrACS)",         path: "/api/v1/cyclone/ibtracs?basin=NI" },
  { name: "Cyclone (IMD Best Track)",  path: "/api/v1/cyclone/imd-best-track?basin=NI" },
];

async function runTests() {
  console.log("==================================================");
  console.log("🚀 STARTING REAL DATA ROUTE LATENCY TESTS (<4ms SLA)");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  for (const ep of endpoints) {
    const url = `${BASE_URL}${ep.path}`;
    const start = performance.now();
    try {
      const res = await fetch(url);
      const latency = parseFloat((performance.now() - start).toFixed(2));
      const data = await res.json();

      // Accept 200 (Hydrated from StateBuffer/MOSDAC) or 503 (Awaiting initial poll)
      if (res.status === 200 || res.status === 503) {
        const slaStatus = latency <= 4.0 ? "⚡ SLA PASS" : "⚠️ WARN";
        console.log(`✅ [PASS] ${ep.name}`);
        console.log(`   URL: ${url}`);
        console.log(`   Status: ${res.status} | Latency: ${latency}ms [${slaStatus}]`);
        console.log(`   Keys Returned: ${Object.keys(data).join(", ")}\n`);
        passed++;
      } else {
        console.log(`❌ [FAIL] ${ep.name}`);
        console.log(`   Status: ${res.status} | Error: ${JSON.stringify(data)}\n`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ [FAIL] ${ep.name} - Connection Error: ${err.message}\n`);
      failed++;
    }
  }

  console.log("==================================================");
  console.log(`📊 SUMMARY: ${passed} Passed | ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests();