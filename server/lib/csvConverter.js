/**
 * server/lib/csvConverter.js
 * Utility to convert nested JSON objects and record arrays into tabular RFC-4180 CSV strings.
 */
"use strict";

/**
 * Flattens nested JSON objects into a single-level key-value map
 */
function flattenObject(obj, prefix = "") {
  if (obj === null || obj === undefined) return {};
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}_` : "";
    if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = Array.isArray(obj[k]) ? JSON.stringify(obj[k]) : obj[k];
    }
    return acc;
  }, {});
}

/**
 * Converts JSON payload into RFC-4180 compliant CSV string
 */
function jsonToCsv(jsonPayload) {
  let records = [];

  if (Array.isArray(jsonPayload)) {
    records = jsonPayload;
  } else if (jsonPayload && Array.isArray(jsonPayload.data)) {
    records = jsonPayload.data;
  } else if (jsonPayload && Array.isArray(jsonPayload.records)) {
    records = jsonPayload.records;
  } else if (jsonPayload && Array.isArray(jsonPayload.granules)) {
    records = jsonPayload.granules;
  } else if (jsonPayload && Array.isArray(jsonPayload.wind_points)) {
    records = jsonPayload.wind_points;
  } else if (jsonPayload && Array.isArray(jsonPayload.active_storms)) {
    records = jsonPayload.active_storms;
  } else if (jsonPayload && typeof jsonPayload === "object") {
    records = [jsonPayload];
  }

  if (!records || records.length === 0) return "";

  const flattenedRecords = records.map((r) => flattenObject(r));
  const headers = Array.from(new Set(flattenedRecords.flatMap((r) => Object.keys(r))));

  if (headers.length === 0) return "";

  const csvRows = [];
  csvRows.push(headers.join(","));

  for (let i = 0; i < flattenedRecords.length; i++) {
    const row = flattenedRecords[i];
    const values = headers.map((header) => {
      const val = row[header] === undefined || row[header] === null ? "" : row[header];
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

module.exports = {
  flattenObject,
  jsonToCsv,
};
