const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/query', (req, res) => {
  const { category, dataset, year, month } = req.query;

  if (!category || !dataset || !year || !month) {
    return res.status(400).json({ error: "Missing required query params: category, dataset, year, month" });
  }

  const filePath = path.join(process.cwd(), 'data', 'archive', category, dataset, `year=${year}`, `month=${month}`, `partition_${year}_${month}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Data partition not found or backfill in progress." });
  }

  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json({ status: "success", partition: fileData });
});

module.exports = router;
