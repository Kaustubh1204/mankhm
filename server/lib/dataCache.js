/**
 * server/lib/dataCache.js
 * In-memory volatile cache + background poller.
 *
 * Fetches all upstream datasets on a timer (default 15 min),
 * stores pre-parsed JSON in V8 process memory.
 * Route handlers call getCache(key) for instant (<1ms) reads.
 */
"use strict";
const axios = require("axios");
const https = require("node:https");
const http = require("node:http");
const { getMosdacSession, invalidateSession, MOSDAC_BASE } = require("./mosdacAuth");

// --- Persistent-connection agents for the poller (not client hot path) ---
const keepAliveHttps = new https.Agent({ keepAlive: true, keepAliveMsecs: 30000, maxSockets: 6 });
const keepAliveHttp  = new http.Agent({ keepAlive: true, keepAliveMsecs: 30000, maxSockets: 6 });

const pollerAxios = axios.create({
  httpAgent: keepAliveHttp,
  httpsAgent: keepAliveHttps,
  timeout: 20000,
});

// ─── Global Cache Store ─────────────────────────────────────────────
// Each slot: { data: <JSON-ready object>, fetchedAt: <epoch ms>, fetchDurationMs: <number>, records: <number> }
const globalCache = {};

/** Read a cache slot. Returns { data, fetchedAt, fetchDurationMs, records } or null if cold. */
function getCache(key) {
  return globalCache[key] ?? null;
}

/** Write a cache slot. */
function setCache(key, data, fetchDurationMs, records) {
  globalCache[key] = {
    data,
    fetchedAt: Date.now(),
    fetchDurationMs: Number(fetchDurationMs.toFixed(2)),
    records: records ?? 0,
  };
}

// ─── Dataset Pollers ─────────────────────────────────────────────────

// --- Satellite (MOSDAC INSAT-3D/3DR/3DS) ---
const SAT_DATASETS = [
  { key: "satellite:insat3ds", datasetId: "3SIMG_L1B_STD", satellite: "INSAT-3DS", resolution_km: 4, prefix: "3SIMG" },
  { key: "satellite:insat3dr", datasetId: "3RIMG_L1B_STD", satellite: "INSAT-3DR", resolution_km: 4, prefix: "3RIMG" },
  { key: "satellite:insat3d",  datasetId: "3DIMG_L1B_STD", satellite: "INSAT-3D",  resolution_km: 4, prefix: "3DIMG" },
];

async function pollSatellite() {
  let cookie;
  try {
    cookie = await getMosdacSession();
  } catch (err) {
    console.error(`[poller:satellite] Auth failed: ${err.message}`);
    return;
  }

  for (const ds of SAT_DATASETS) {
    const start = performance.now();
    try {
      const resp = await pollerAxios.post(
        `${MOSDAC_BASE}/mdapi/search`,
        {
          user_credentials: { username: process.env.MOSDAC_USERNAME, password: process.env.MOSDAC_PASSWORD },
          search_parameters: { datasetId: ds.datasetId, channel: "TIR1", count: 3, sortBy: "startTime", sortOrder: "desc" },
        },
        { headers: { Cookie: cookie, "Content-Type": "application/json" }, validateStatus: (s) => s < 500 }
      );

      if (resp.status === 401) { invalidateSession(); continue; }

      const granules = (resp.data?.granules ?? []).map((g) => ({
        granule_id: g.granuleId ?? g.id, satellite: ds.satellite, dataset_id: ds.datasetId,
        channel: "TIR1", resolution_km: ds.resolution_km, start_time: g.startTime, end_time: g.endTime,
        coverage: {
          lat_min: g.spatialExtent?.southBoundingCoordinate ?? null,
          lat_max: g.spatialExtent?.northBoundingCoordinate ?? null,
          lon_min: g.spatialExtent?.westBoundingCoordinate ?? null,
          lon_max: g.spatialExtent?.eastBoundingCoordinate ?? null,
        },
        download_url: g.downloadUrl ?? `${MOSDAC_BASE}/mdapi/download/${g.granuleId ?? g.id}`,
      }));

      const dur = performance.now() - start;
      if (granules.length) {
        setCache(ds.key, {
          source: "ISRO MOSDAC", satellite: ds.satellite, retrieved_at: new Date().toISOString(),
          channel: "TIR1", granules,
        }, dur, granules.length);
        console.log(`[poller:satellite] ${ds.satellite} cached ${granules.length} granules (${dur.toFixed(0)}ms)`);
      }
    } catch (err) {
      console.error(`[poller:satellite] ${ds.satellite} fetch error: ${err.message}`);
    }
  }

  // Composite "all" cache — latest from first available
  const allData = SAT_DATASETS.map((ds) => getCache(ds.key)).find(Boolean);
  if (allData) setCache("satellite:all", allData.data, allData.fetchDurationMs, allData.records);
}

// --- Ocean (OceanSat-3 Scatterometer) ---
async function pollOcean() {
  let cookie;
  try {
    cookie = await getMosdacSession();
  } catch (err) {
    console.error(`[poller:ocean] Auth failed: ${err.message}`);
    return;
  }

  const start = performance.now();
  try {
    const resp = await pollerAxios.post(
      `${MOSDAC_BASE}/mdapi/search`,
      {
        user_credentials: { username: process.env.MOSDAC_USERNAME, password: process.env.MOSDAC_PASSWORD },
        search_parameters: { datasetId: "OSCAT_L2B_25", count: 1, sortBy: "startTime", sortOrder: "desc", bbox: [75, 5, 100, 25] },
      },
      { headers: { Cookie: cookie, "Content-Type": "application/json" }, validateStatus: (s) => s < 500 }
    );

    if (resp.status === 401) { invalidateSession(); return; }

    const g = resp.data?.granules?.[0];
    if (g) {
      const windPoints = (g.windData ?? []).map((pt) => {
        const u = pt.u_ms ?? 0, v = pt.v_ms ?? 0;
        const speed_ms = Math.sqrt(u * u + v * v);
        return {
          lat: pt.lat, lon: pt.lon, u_ms: u, v_ms: v,
          speed_knots: +(speed_ms * 1.94384).toFixed(2),
          direction_deg: +((Math.atan2(-u, -v) * (180 / Math.PI) + 360) % 360).toFixed(1),
        };
      });

      const dur = performance.now() - start;
      setCache("ocean:oceansat3", {
        source: "ISRO VEDAS / MOSDAC — OceanSat-3 EOS-06", dataset_id: "OSCAT_L2B_25",
        retrieved_at: new Date().toISOString(), granule_id: g.granuleId ?? g.id, pass_time: g.startTime,
        bbox: { lat_min: 5, lat_max: 25, lon_min: 75, lon_max: 100 }, wind_points: windPoints,
      }, dur, windPoints.length);
      console.log(`[poller:ocean] OceanSat-3 cached ${windPoints.length} wind points (${dur.toFixed(0)}ms)`);
    }
  } catch (err) {
    console.error(`[poller:ocean] fetch error: ${err.message}`);
  }
}

// --- Atmospheric (NASA Earthdata CMR) ---
const CMR_SEARCH = "https://cmr.earthdata.nasa.gov/search/granules.json";
const CMR_COLLECTIONS = [
  { key: "atmospheric:gpm",   concept_id: "C1980701369-GES_DISC",  label: "GPM IMERG Passive Microwave",  source: "NASA GPM" },
  { key: "atmospheric:metop", concept_id: "C1214306881-GES_DISC",  label: "MetOp AMSU-B 89GHz",           source: "NOAA MetOp" },
  { key: "atmospheric:megha", concept_id: "C1280177154-LARC_ASDC", label: "Megha-Tropiques MADRAS L2",    source: "CNES/ISRO Megha-Tropiques" },
];

async function pollAtmospheric() {
  const temporalEnd = new Date().toISOString();
  const temporalStart = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
  const bounding_box = "75,5,100,25";
  const allResults = [];

  for (const col of CMR_COLLECTIONS) {
    const start = performance.now();
    try {
      const resp = await pollerAxios.get(CMR_SEARCH, {
        params: { concept_id: col.concept_id, temporal: `${temporalStart},${temporalEnd}`, bounding_box, page_size: 3, sort_key: "-start_date" },
      });

      const entries = resp.data?.feed?.entry ?? [];
      const granules = entries.map((e) => ({
        collection_label: col.label, source: col.source, granule_id: e.id,
        time_start: e.time_start, time_end: e.time_end, channels_ghz: [37, 89],
        coverage: {
          lat_min: parseFloat(e.boxes?.[0]?.split(" ")[0] ?? 5),
          lat_max: parseFloat(e.boxes?.[0]?.split(" ")[2] ?? 25),
          lon_min: parseFloat(e.boxes?.[0]?.split(" ")[1] ?? 75),
          lon_max: parseFloat(e.boxes?.[0]?.split(" ")[3] ?? 100),
        },
        download_links: (e.links ?? []).filter((l) => l.rel?.includes("data#") || l.type === "application/x-hdfeos").map((l) => l.href).slice(0, 3),
      }));

      const dur = performance.now() - start;
      if (granules.length) {
        setCache(col.key, {
          source: "NASA Earthdata CMR", retrieved_at: new Date().toISOString(),
          query: { temporal_start: temporalStart, temporal_end: temporalEnd, bbox: { lat_min: 5, lat_max: 25, lon_min: 75, lon_max: 100 }, channel_ghz: "both", hours_back: 6 },
          granules,
        }, dur, granules.length);
        allResults.push(...granules);
        console.log(`[poller:atmospheric] ${col.label} cached ${granules.length} granules (${dur.toFixed(0)}ms)`);
      }
    } catch (err) {
      console.error(`[poller:atmospheric] ${col.label} error: ${err.message}`);
    }
  }

  // Composite "all" cache
  if (allResults.length) {
    setCache("atmospheric:all", {
      source: "NASA Earthdata CMR", retrieved_at: new Date().toISOString(),
      query: { temporal_start: temporalStart, temporal_end: new Date().toISOString(), bbox: { lat_min: 5, lat_max: 25, lon_min: 75, lon_max: 100 }, channel_ghz: "both", hours_back: 6 },
      granules: allResults,
    }, 0, allResults.length);
  }
}

// --- Cyclone (IBTrACS + IMD) ---
const IBTRACS_URL = "https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/csv/ibtracs.ACTIVE.list.v04r01.csv";
const IMD_ADVISORY_URL = "https://rsmcnewdelhi.imd.gov.in/json/advisory.json";

function classifyIMD(msw_knots) {
  if (msw_knots >= 120) return { imd: "Super Cyclonic Storm", ss: 5 };
  if (msw_knots >= 90)  return { imd: "Extremely Severe Cyclonic Storm", ss: 4 };
  if (msw_knots >= 64)  return { imd: "Very Severe Cyclonic Storm", ss: 3 };
  if (msw_knots >= 48)  return { imd: "Severe Cyclonic Storm", ss: 2 };
  if (msw_knots >= 34)  return { imd: "Cyclonic Storm", ss: 1 };
  return { imd: "Depression", ss: 0 };
}

function parseIBTraCS(csvText) {
  const lines = csvText.split("\n").filter(Boolean);
  if (lines.length < 3) return [];
  const rawHeaders = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const storms = [];
  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < rawHeaders.length) continue;
    const row = {};
    rawHeaders.forEach((h, idx) => { row[h] = cols[idx]?.trim() ?? ""; });
    const lat = parseFloat(row["lat"]), lon = parseFloat(row["lon"]);
    const msw = parseFloat(row["usa_wind"] || row["wmo_wind"] || "0");
    const pres = parseFloat(row["wmo_pres"] || row["usa_pres"] || "0");
    if (isNaN(lat) || isNaN(lon)) continue;
    const category = classifyIMD(msw);
    storms.push({
      storm_id: row["sid"], name: row["name"] !== "NOT_NAMED" ? row["name"] : null,
      basin: row["basin"], timestamp: row["iso_time"], center: { lat, lon },
      msw_knots: isNaN(msw) ? null : msw, pressure_hpa: isNaN(pres) ? null : pres,
      imd_category: category.imd, saffir_simpson: category.ss, source: "NOAA IBTrACS",
    });
  }
  return storms;
}

async function pollCyclone() {
  // IBTrACS
  const startIbt = performance.now();
  try {
    const resp = await pollerAxios.get(IBTRACS_URL, { responseType: "text" });
    const storms = parseIBTraCS(resp.data);
    const dur = performance.now() - startIbt;
    setCache("cyclone:ibtracs", {
      sources: ["NOAA IBTrACS v04r01"], retrieved_at: new Date().toISOString(),
      active_storms: storms, imd_advisory: null,
    }, dur, storms.length);
    console.log(`[poller:cyclone] IBTrACS cached ${storms.length} storms (${dur.toFixed(0)}ms)`);
  } catch (err) {
    console.error(`[poller:cyclone] IBTrACS error: ${err.message}`);
  }

  // IMD Advisory
  const startImd = performance.now();
  try {
    const imdResp = await pollerAxios.get(IMD_ADVISORY_URL, { timeout: 8000 });
    const dur = performance.now() - startImd;
    setCache("cyclone:imd", {
      sources: ["IMD RSMC New Delhi"], retrieved_at: new Date().toISOString(),
      active_storms: [], imd_advisory: imdResp.data ?? null,
    }, dur, 1);
    console.log(`[poller:cyclone] IMD advisory cached (${dur.toFixed(0)}ms)`);
  } catch {
    // IMD endpoint is optional — suppress
  }

  // Composite "all" — merge ibtracs storms + imd advisory
  const ibtCache = getCache("cyclone:ibtracs");
  const imdCache = getCache("cyclone:imd");
  const allStorms = ibtCache?.data?.active_storms ?? [];
  const advisory = imdCache?.data?.imd_advisory ?? null;
  setCache("cyclone:all", {
    sources: ["NOAA IBTrACS v04r01", "IMD RSMC New Delhi"], retrieved_at: new Date().toISOString(),
    active_storms: allStorms, imd_advisory: advisory,
  }, 0, allStorms.length);
}

// ─── Master Poll Orchestrator ────────────────────────────────────────
async function pollAll() {
  const start = performance.now();
  console.log("[poller] Starting upstream data refresh...");

  // Run all pollers concurrently — they are independent
  await Promise.allSettled([pollSatellite(), pollOcean(), pollAtmospheric(), pollCyclone()]);

  const dur = (performance.now() - start).toFixed(0);
  console.log(`[poller] Refresh complete in ${dur}ms. Cache keys: ${Object.keys(globalCache).join(", ")}`);
}

/** Boot the background poller. Runs an immediate poll, then repeats on interval. */
function startPoller(intervalMs = 15 * 60 * 1000) {
  // Immediate first poll (non-blocking — don't await)
  pollAll().catch((err) => console.error("[poller] Initial poll failed:", err.message));

  setInterval(() => {
    pollAll().catch((err) => console.error("[poller] Poll cycle failed:", err.message));
  }, intervalMs);

  console.log(`[poller] Background poller started (interval: ${(intervalMs / 60000).toFixed(0)}min)`);
}

module.exports = { getCache, startPoller };
