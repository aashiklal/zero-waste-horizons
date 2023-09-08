const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
const fs = require('fs')
const app = express();

const port = process.env.PORT || 3000;

// connect to sql
let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('connetced to sql db');
});
app.use(cors())
app.use(express.static(path.join(__dirname, './frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/index.html'));
});

app.get('/statistic', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/statistic.html'));
});


app.get('/api/mapdata', (req, res) => {
  const { year, wasteService } = req.query;

  const query = `
    SELECT council, ${wasteService}, Population 
    FROM VLGAS 
    WHERE financial_year = ?`;

  db.all(query, [year], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Not Found' });
    }
    const result = rows.map(row => {
      const value = row[wasteService] / row['Population'];
      return { name: row['council'], value:value*1000 };
    });

    res.json(result);
  });
});

app.get('/api/classification', (req, res) => {
  const sql = "SELECT * FROM Classification_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});
app.get('/api/wastecollection', (req, res) => {
  const sql = "SELECT substr(date, 1, 4) as year, total_waste FROM WasteCollectionMonthly_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

// API endpoint to get selected columns from WasteCollectionMonthly_cleaned
app.get('/api/wastecollection/details', (req, res) => {
  const sql = `
    SELECT 
      residential, 
      public_litter_bins, 
      dumped_rubbish, 
      street_sweepings, 
      commingled_recycling, 
      cardboard, 
      hardwaste_total, 
      green_waste 
    FROM WasteCollectionMonthly_cleaned
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});
app.get('/api/geojson', (req, res) => {
  const geojsonPath = path.join(__dirname, './data/Council.geojson');  // Replace with your actual file path
  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      return console.error(`Error reading GeoJSON file: ${err.message}`);
    }
    const geojsonData = JSON.parse(data);
    res.json(geojsonData);
  });
});
// For linechart.js: Returns total_waste, population, residential from WasteCollectionMonthly_cleaned
app.get('/api/linechart', (req, res) => {
  const sql = "SELECT date, total_waste, population, residential FROM WasteCollectionMonthly_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// For treemap.js: Returns multiple columns from WasteCollectionMonthly_cleaned
app.get('/api/treemap', (req, res) => {
  const sql = `
    SELECT residential, public_litter_bins, dumped_rubbish, street_sweepings, cardboard, hardwaste_total, green_waste 
    FROM WasteCollectionMonthly_cleaned`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// For donutchart.js: Returns specific columns from Classification_Cleaned
app.get('/api/donutchart', (req, res) => {
  const sql = "SELECT recycled, export_interstate, export_international, disposal FROM Classification_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// For barchart.js: Returns recycled, disposal from Classification_Cleaned
app.get('/api/barchart', (req, res) => {
  const sql = "SELECT financial_year, recycled, disposal FROM Classification_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
