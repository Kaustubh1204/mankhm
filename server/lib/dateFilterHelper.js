/**
 * server/lib/dateFilterHelper.js
 * Date-wise range query and day-bucket grouping helper utility.
 */
"use strict";

/**
 * Filters array of records by date range (startDate to endDate)
 */
function filterRecordsByDateRange(records, startDate, endDate) {
  if (!startDate && !endDate) return records;

  const start = startDate ? new Date(startDate).getTime() : 0;
  let end = Infinity;
  if (endDate) {
    const endObj = new Date(endDate);
    if (!endDate.includes("T")) {
      endObj.setUTCHours(23, 59, 59, 999);
    }
    end = endObj.getTime();
  }

  return records.filter((item) => {
    const rawDate =
      item.timestamp ||
      item.date ||
      item.ingested_at ||
      item.created_at ||
      (item.payload && (item.payload.timestamp || item.payload.date));
    if (!rawDate) return true;
    const itemTime = new Date(rawDate).getTime();
    if (isNaN(itemTime)) return true;
    return itemTime >= start && itemTime <= end;
  });
}

/**
 * Groups records into day-wise structured JSON buckets
 */
function groupRecordsByDate(records) {
  const grouped = {};
  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    const rawDate =
      item.timestamp ||
      item.date ||
      item.ingested_at ||
      (item.payload && (item.payload.timestamp || item.payload.date));
    let dateKey = "unpartitioned";
    if (rawDate) {
      try {
        dateKey = new Date(rawDate).toISOString().split("T")[0];
      } catch {}
    }

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  }
  return grouped;
}

module.exports = {
  filterRecordsByDateRange,
  groupRecordsByDate,
};
