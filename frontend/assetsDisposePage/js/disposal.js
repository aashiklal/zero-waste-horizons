(async  function(){
  // Async function to fetch data from E_waste_Table_1
async function fetchEWasteData() {
  const dataResponse = await fetch('https://fullmoon.azurewebsites.net/api/e_waste', { mode: 'cors' });
  const parsedData = await dataResponse.json();
  return parsedData;
}

// Async function to fetch data from Transfer_Station_Table_1
async function fetchTransferStationData() {
  const dataResponse = await fetch('https://fullmoon.azurewebsites.net/api/transfer_station', { mode: 'cors' });
  const parsedData = await dataResponse.json();
  return parsedData;
}

// Async function to fetch data from Metals_Table_1
async function fetchMetalsData() {
  const dataResponse = await fetch('https://fullmoon.azurewebsites.net/api/metals', { mode: 'cors' });
  const parsedData = await dataResponse.json();
  return parsedData;
}

// Async function to fetch data from Landfill_Table_1
async function fetchLandfillData() {
  const dataResponse = await fetch('https://fullmoon.azurewebsites.net/api/landfill', { mode: 'cors' });
  const parsedData = await dataResponse.json();
  return parsedData;
}

const eWasteData = await fetchEWasteData();
console.log('E_waste_Table_1 data:', eWasteData);

const transferStationData = await fetchTransferStationData();
console.log('Transfer_Station_Table_1 data:', transferStationData);

const metalsData = await fetchMetalsData();
console.log('Metals_Table_1 data:', metalsData);

const landfillData = await fetchLandfillData();
console.log('Landfill_Table_1 data:', landfillData);

})()