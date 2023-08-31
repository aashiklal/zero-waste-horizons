const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

const db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the local SQLite database.');
});

// Drop existing tables if they exist
['VLGAS', 'WasteCollectionMonthly_cleaned', 'Classification_cleaned'].forEach(table => {
  db.run(`DROP TABLE IF EXISTS ${table}`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Table ${table} deleted successfully.`);
  });
});
// Create new tables
const createVlgasTableQuery = `
CREATE TABLE VLGAS (
  id INT,
  financial_year INT,
  council TEXT,
  Population REAL,
  premises_residential REAL,
  premises_with_garbage_service_residential REAL,
  garbage_collected_total_tonnes REAL,
  premises_with_kerbside_recycling_service_residential REAL,
  kerbside_recycling_total_collected_tonnes REAL,
  kerbside_recycling_total_recycled_tonnes REAL,
  kerbside_recycling_total_contamination_tonnes REAL,
  kerbside_recycling_glass_all_collected_tonnes REAL,
  kerbside_recycling_glass_all_recycled_tonnes REAL,
  kerbside_recycling_cans_aluminium_collected_tonnes REAL,
  kerbside_recycling_cans_aluminium_recycled_tonnes REAL,
  kerbside_recycling_cans_steel_collected_tonnes REAL,
  kerbside_recycling_cans_steel_recycled_tonnes REAL,
  kerbside_recycling_paper_all_collected_tonnes REAL,
  kerbside_recycling_paper_all_recycled_tonnes REAL,
  kerbside_recycling_plastics_all_collected_tonnes REAL,
  kerbside_recycling_plastics_all_recycled_tonnes REAL,
  kerbside_organics_premises_residential REAL,
  kerbside_organics_collected_tonnes REAL,
  kerbside_organics_processed_tonnes REAL,
  premises_with_access_to_hardwaste_service_residential REAL,
  hardwaste_collected_tonnes REAL,
  hardwaste_disposed_tonnes REAL
)`;

const createWasteCollectionTableQuery = `
CREATE TABLE WasteCollectionMonthly_cleaned (
  date TEXT,
  residential REAL,
  public_litter_bins REAL,
  dumped_rubbish REAL,
  street_sweepings REAL,
  mattresses REAL,
  commingled_recycling REAL,
  cardboard REAL,
  hardwaste_to_landfill REAL,
  hardwaste_recovered REAL,
  hardwaste_total REAL,
  green_waste REAL,
  total_waste REAL
)`;

const createClassificationTableQuery = `
CREATE TABLE Classification_cleaned (
  financial_year INT,
  wpm_material_type TEXT,
  wpm_material_name TEXT,
  waste_stream TEXT,
  recycled REAL,
  export_interstate REAL,
  export_international REAL,
  disposal REAL,
  recovery_rate REAL
)`;

function importData(filename, tableName) {
  fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (row) => {
      const columns = Object.keys(row).join(',');
      const placeholders = Object.keys(row).map(() => '?').join(',');
      const insertQuery = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      db.run(insertQuery, Object.values(row), (err) => {
        if (err) {
          return console.error(err.message);
        }
      });
    })
    .on('end', () => {
      console.log(`CSV file ${filename} successfully processed.`);
    });
}
setTimeout(() => {
  [createVlgasTableQuery, createWasteCollectionTableQuery, createClassificationTableQuery].forEach(query => {
    db.run(query, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Table created successfully.');
    });
  });
},1000)

setTimeout(() => {
// // Import data from WasteCollectionMonthly_cleaned.csv
importData('./data/WasteCollectionMonthly_cleaned.csv', 'WasteCollectionMonthly_cleaned');
// Import data from VLGAS.csv
importData('./data/VLGAS.csv', 'VLGAS');

// // Import data from Classification_cleaned.csv
importData('./data/Classification_cleaned.csv', 'Classification_cleaned');
},2000)