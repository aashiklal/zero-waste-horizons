const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');

const apiRouter = express.Router();
// connect to sql
let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('connetced to sql db');
});




/* GET POSTCODES*/
apiRouter.get('/get-postcodes', (req, res) => {
  const csvFilePath = path.join(__dirname, 'data', 'postcodes.csv');
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send({ error: 'Unable to read CSV file.' });
      }
      res.send(data);
  });
});

apiRouter.get('/mapdata', (req, res) => {
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

apiRouter.get('/classification', (req, res) => {
  const sql = "SELECT * FROM Classification_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});
apiRouter.get('/wastecollection', (req, res) => {
  const sql = "SELECT substr(date, 1, 4) as year, total_waste FROM WasteCollectionMonthly_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.json(rows);
  });
});

// API endpoint to get selected columns from WasteCollectionMonthly_cleaned
apiRouter.get('/wastecollection/details', (req, res) => {
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
apiRouter.get('/geojson', (req, res) => {
  const geojsonPath = path.join(__dirname, '../data/Council.geojson');  // Replace with your actual file path
  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      return console.error(`Error reading GeoJSON file: ${err.message}`);
    }
    const geojsonData = JSON.parse(data);
    res.json(geojsonData);
  });
});


apiRouter.get('/model/:filename', (req, res) => {
  const staticFolder = path.join(__dirname, '../tfjs_model/');
  const filename = req.params.filename;
  const filePath = path.join(staticFolder, filename);
  console.log(filename, filePath)
  // 使用stream来传送文件
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
      res.status(404).send('File not found');
  });
});

// For linechart.js: Returns total_waste, population, residential from WasteCollectionMonthly_cleaned
apiRouter.get('/linechart', (req, res) => {
  const sql = "SELECT date, total_waste, population, residential FROM WasteCollectionMonthly_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// For treemap.js: Returns multiple columns from WasteCollectionMonthly_cleaned
apiRouter.get('/treemap', (req, res) => {
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
apiRouter.get('/donutchart', (req, res) => {
  const sql = "SELECT recycled, export_interstate, export_international, disposal FROM Classification_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// For barchart.js: Returns recycled, disposal from Classification_Cleaned
apiRouter.get('/barchart', (req, res) => {
  const sql = "SELECT financial_year, recycled, disposal FROM Classification_cleaned";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API endpoint for E_waste_Table_1
apiRouter.get('/e_waste', (req, res) => {
  db.all('SELECT * FROM E_waste_Table_1', [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// API endpoint for Transfer_Station_Table_1
apiRouter.get('/transfer_station', (req, res) => {
  db.all('SELECT * FROM Transfer_Station_Table_1', [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// API endpoint for Metals_Table_1
apiRouter.get('/metals', (req, res) => {
  db.all('SELECT * FROM Metals_Table_1', [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// API endpoint for Landfill_Table_1
apiRouter.get('/landfill', (req, res) => {
  db.all('SELECT * FROM Landfill_Table_1', [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

//CLASSIFICATION OF WASTE
// Load model
let model;
(async () => {
  const modelPath = path.resolve(__dirname, '../tfjs_model/model.json');
  model = await tf.loadLayersModel('file://' + modelPath);
})();

const storage = multer.memoryStorage(); // Store the image as buffer in memory
const upload = multer({ storage: storage });

apiRouter.post('/classify', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded.');
  }

  const imageBuffer = req.file.buffer;
  const tensor = tf.node.decodeImage(imageBuffer, 3);
  const resized = tf.image.resizeBilinear(tensor, [150, 150]).toFloat();
  const normalized = resized.div(tf.scalar(255.0));
  const batched = normalized.expandDims(0);

  const prediction = model.predict(batched);
  const isRecyclable = prediction.dataSync()[0] > 0.5;

  // Dispose tensors
  tensor.dispose();
  resized.dispose();
  normalized.dispose();
  batched.dispose();
  
  res.json({
    prediction: isRecyclable ? 'Recyclable' : 'Organic'
  });
});

module.exports = apiRouter