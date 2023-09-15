(async function () {
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



  function initMap(target) {
    // Your data
    const data = target ?? {
      UniqueId: "VIC00002",
      Latitude: -37.7642345,
      Longitude: 144.9021359,
      // ... other fields
    };

    // Create a map object and specify the DOM element for display.
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: data.Latitude, lng: data.Longitude },
      zoom: 11
    });

    // Create a marker and set its position.
    const marker = new google.maps.Marker({
      map: map,
      position: { lat: data.Latitude, lng: data.Longitude },
      title: data.UniqueId
    });
  }
  initMap()

  document.getElementById("search-postcode").addEventListener("click", () => {
    const postCode = document.getElementById('postcodes').value
    const item = eWasteData.find((item) => item.Postcode == postCode)
    initMap(item)
  })

  function generatePostcodeOptions(data) {
    const dataList = document.getElementById('postcodes');
    data.map(item => item.Postcode).forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      dataList.appendChild(option);
    });
  }
  generatePostcodeOptions(eWasteData)
})()


// Assuming you have fetched and stored data for ewaste, landfill, metal, and transfer

const disposalTypeSelect = document.getElementById('disposal-type-select');

disposalTypeSelect.addEventListener('change', function () {
  const selectedOption = document.querySelector('input[name="options"]:checked').value;

  // Depending on the selected option, you can update your data or perform other actions
  switch (selectedOption) {
    case 'ewaste':
      mapDisplayDisposal(eWasteData);

      break;
    case 'landfill':

      mapDisplayDisposal(landfillData);
      break;
    case 'metal':

      mapDisplayDisposal(metalData);
      break;
    case 'transfer':
      mapDisplayDisposal(transferData);
      break;
    default:
      break;
  }
});

function mapDisplayDisposal() {


}
