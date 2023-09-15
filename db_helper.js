const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');

const db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the local SQLite database.');
});

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }

  // Drop each table one by one
  rows.forEach((row) => {
    db.run(`DROP TABLE IF EXISTS ${row.name}`, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Table ${row.name} deleted successfully.`);
    });
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
  population REAL,
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

const createEwasteTableQuery = `
CREATE TABLE E_waste_Table_1 (
  UniqueId TEXT,
  FacilityOrSiteName TEXT,
  Owner TEXT,
  ManagementType TEXT,
  InfrastructureType TEXT,
  FacilityStreetAddress TEXT,
  FacilitySuburbLocality TEXT,
  State TEXT,
  Postcode REAL,
  Latitude REAL,
  Longitude REAL,
  BatteriesRechargeable REAL,
  BatteriesSingleUse REAL,
  BatteriesLeadAcid REAL,
  ComputersAndAccessories REAL,
  MobilePhones REAL,
  PrinterCartridges REAL,
  Televisions REAL,
  ElectricalAppliances REAL,
  ElectricalAppliancesBatteryOperated REAL
)`;

const createTransferStationTableQuery = `
CREATE TABLE Transfer_Station_Table_1 (
  UniqueId TEXT,
  FacilityOrSiteName TEXT,
  Owner TEXT,
  ManagementType TEXT,
  InfrastructureType TEXT,
  FacilityStreetAddress TEXT,
  FacilitySuburbLocality TEXT,
  State TEXT,
  Postcode REAL,
  Latitude REAL,
  Longitude REAL,
  BatteriesRechargeable REAL,
  BatteriesSingleUse REAL,
  BatteriesLeadAcid REAL,
  ComputersAccessories REAL,
  MobilePhones REAL,
  PrinterCartridges REAL,
  Televisions REAL,
  ElectricalAppliances REAL,
  ElectricalAppliancesBatteryOperated REAL,
  ChemicalDrums REAL,
  Mercury REAL,
  WhiteGoods REAL
)`;

const createMetalsTableQuery = `
CREATE TABLE Metals_Table_1 (
  UniqueId TEXT,
  FacilityOrSiteName TEXT,
  Owner TEXT,
  ManagementType TEXT,
  InfrastructureType TEXT,
  FacilityStreetAddress TEXT,
  FacilitySuburbLocality TEXT,
  State TEXT,
  Postcode REAL,
  Latitude REAL,
  Longitude REAL,
  ChemicalDrums REAL,
  Lead REAL,
  Mercury REAL
)`;

const createLandfillTableQuery = `
CREATE TABLE Landfill_Table_1 (
  UniqueId TEXT,
  FacilityOrSiteName TEXT,
  Owner TEXT,
  ManagementType TEXT,
  InfrastructureType TEXT,
  FacilityStreetAddress TEXT,
  FacilitySuburbLocality TEXT,
  State TEXT,
  Postcode REAL,
  Latitude REAL,
  Longitude REAL,
  BatteriesRechargeable REAL,
  BatteriesSingleUse REAL,
  BatteriesLeadAcid REAL,
  ComputersAccessories REAL,
  MobilePhones REAL,
  PrinterCartridges REAL,
  Televisions REAL,
  ElectricalAppliances REAL,
  ElectricalAppliancesBatteryOperated REAL,
  ChemicalDrums REAL,
  Mercury REAL,
  WhiteGoods REAL
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

const createTableForIter1 = function() {
  [createVlgasTableQuery, createWasteCollectionTableQuery, createClassificationTableQuery].forEach(query => {
    db.run(query, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Table created successfully.');
    });
  });
}

const createTableForIter2 = function() {
  [createEwasteTableQuery, createTransferStationTableQuery, createMetalsTableQuery,createLandfillTableQuery].forEach(query => {
    db.run(query, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Table created successfully.');
    });
  });
}
setTimeout(() => {
  createTableForIter1()
  createTableForIter2()
},1000)

setTimeout(() => {
// // Import data from WasteCollectionMonthly_cleaned.csv
importData('./data/WasteCollectionMonthly_cleaned.csv', 'WasteCollectionMonthly_cleaned');
// Import data from VLGAS.csv
importData('./data/VLGAS.csv', 'VLGAS');
// // Import data from Classification_cleaned.csv
importData('./data/Classification_cleaned.csv', 'Classification_cleaned');

importData('./data/household_hazardous_waste_new/E_waste-Table 1.csv', 'E_waste_Table_1');
importData('./data/household_hazardous_waste_new/Transfer_Station-Table 1.csv', 'Transfer_Station_Table_1');
importData('./data/household_hazardous_waste_new/Metals-Table 1.csv', 'Metals_Table_1');
importData('./data/household_hazardous_waste_new/Landfill-Table 1.csv', 'Landfill_Table_1');
},2000)