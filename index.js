const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path')
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

app.get('/person', (req, res) => {
  const { year, council, wasteService } = req.query;
  const query = `
    SELECT ${wasteService}, Population 
    FROM VLGAS 
    WHERE financial_year = ? AND council = ?`;

  db.get(query, [year, council], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Not Found' });
    }
    const value = row[wasteService] / row['Population'];
    res.json({ value });
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

app.get('/total', (req, res) => {
  const { year, council, wasteService } = req.query;
  const query = `
    SELECT ${wasteService} 
    FROM VLGAS 
    WHERE financial_year = ? AND council = ?`;

  db.get(query, [year, council], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Not Found' });
    }
    const value = row[wasteService];
    res.json({ value });
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

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});
