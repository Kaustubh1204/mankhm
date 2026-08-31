const fs = require('fs/promises');
const path = require('path');
const { fetchMosdacDynamicDataset, fetchIbtracsActive, fetchMosdacSatelliteArchive } = require('./mosdacClient.js');

const BACKFILL_DATASETS = ['insat3d', 'insat3dr', 'insat3ds', 'oceansat3', 'ibtracs'];

/**
 * Historical Backfill Engine: Iterates through past dates and archives all datasets
 */
async function runHistoricalBackfill(daysBack = 30) {
  console.log(`[BACKFILL] 📦 Initializing Historical Backfill for past ${daysBack} days...`);
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysBack);

  for (const datasetKey of BACKFILL_DATASETS) {
    console.log(`[BACKFILL] 🔍 Processing dataset archive: ${datasetKey}...`);
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      
      const archiveDir = path.join(__dirname, '..', '..', 'data', 'archive', `year=${year}`, `month=${month}`, `day=${day}`);
      await fs.mkdir(archiveDir, { recursive: true });

      const archiveFilePath = path.join(archiveDir, `${datasetKey}_${year}${month}${day}.json`);

      // Skip if already downloaded (Idempotent Backfill)
      try {
        await fs.access(archiveFilePath);
        // File exists, skip
      } catch {
        try {
          let data;
          if (datasetKey === 'ibtracs') {
             // IBTrACS is not from MOSDAC
             data = await fetchIbtracsActive();
          } else if (datasetKey.startsWith('insat')) {
             // Fetch historical satellite frames with channels (fallback generated if fail)
             const dateStr = `${year}-${month}-${day}`;
             data = await fetchMosdacSatelliteArchive(datasetKey, dateStr);
          } else {
             // Fetch historical slice from MOSDAC for non-satellite like oceansat3
             // Calculate 00:00:00 to 23:59:59 window for target day
             const dayStart = new Date(currentDate);
             dayStart.setHours(0, 0, 0, 0);
             
             const dayEnd = new Date(currentDate);
             dayEnd.setHours(23, 59, 59, 999);
             
             data = await fetchMosdacDynamicDataset(datasetKey, {
               date_from: dayStart.toISOString(),
               date_to: dayEnd.toISOString()
             });
          }

          if (data) {
            await fs.writeFile(archiveFilePath, JSON.stringify(data, null, 2));
            console.log(`[BACKFILL] ✅ Saved historical archive: ${archiveFilePath}`);
          }
        } catch (err) {
          console.warn(`[BACKFILL WARN] Failed archive chunk for ${datasetKey} on ${year}-${month}-${day}: ${err.message}`);
        }
      }

      // Advance date by 1 day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  console.log(`[BACKFILL] 🎉 Historical Backfill completed successfully! Total datasets ready for model training.`);
}

module.exports = { runHistoricalBackfill };
