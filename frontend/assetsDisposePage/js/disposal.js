(async function () {
  // Async function to fetch data from E_waste_Table_1
  async function fetchEWasteData() {
    const dataResponse = await fetch("http://localhost:3000/api/e_waste", {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  // Async function to fetch data from Transfer_Station_Table_1
  async function fetchTransferStationData() {
    const dataResponse = await fetch(
      "http://localhost:3000/api/transfer_station",
      { mode: "cors" }
    );
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  // Async function to fetch data from Metals_Table_1
  async function fetchMetalsData() {
    const dataResponse = await fetch("http://localhost:3000/api/metals", {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  // Async function to fetch data from Landfill_Table_1
  async function fetchLandfillData() {
    const dataResponse = await fetch("http://localhost:3000/api/landfill", {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  const eWasteData = await fetchEWasteData();

  const transferStationData = await fetchTransferStationData();

  const metalsData = await fetchMetalsData();

  const landfillData = await fetchLandfillData();
  function generatePostcodeOptions() {
    const dataList = document.getElementById("postcodes");
    const zipCodeSet = new Set();
    eWasteData
      .map((item) => item.Postcode)
      .forEach((code) => zipCodeSet.add(code));
    landfillData
      .map((item) => item.Postcode)
      .forEach((code) => zipCodeSet.add(code));
    metalsData
      .map((item) => item.Postcode)
      .forEach((code) => zipCodeSet.add(code));
    transferStationData
      .map((item) => item.Postcode)
      .forEach((code) => zipCodeSet.add(code));
    console.log(zipCodeSet.values());
    Array.from(zipCodeSet).forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      dataList.appendChild(option);
    });
  }

  function addMarker(map, items, color) {
    // Create a new marker
    currentMarker = new google.maps.Marker({
      map: map,
      position: { lat: item.Latitude, lng: item.Longitude },
      title: item.UniqueId,
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`, // Set color
    });
  }

  function initMap() {
    // Create a map object and specify the DOM element for display.
    return new google.maps.Map(document.getElementById("map"), {
      center: { lat: -37.8100243, lng: 144.9643672 },
      zoom: 11,
    });
  }

  function onCheckBoxChange() {
    const disposalTypeSelect = document.getElementById("checkbox-form");
    const checkboxes = disposalTypeSelect.querySelectorAll(".form-check-input"); // 获取所有具有 'form-check-input' 类的输入元素
    const checkedLabels = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        // 获取与选中复选框关联的标签
        const label = disposalTypeSelect.querySelector(
          `label[for="${checkbox.id}"]`
        );
        // 将标签的文本内容添加到数组中
        if (label) {
          checkedLabels.push(label.textContent.trim());
        }
      }
    });

    console.log(checkedLabels);
  }

  function addMarkerToMap(selectedTypes, postCode) {
    // Remove the previous marker if it exists
    if (currentMarker) {
      currentMarker.setMap(null);
    }
    selectedTypes.forEach((type) => {
      switch (type) {
        case "E-waste":
          eWasteData.filter((item) => item.Postcode === postCode);
          break;
      }
    });
  }

  let map = initMap();
  let markers = []
  let currentSelectedTypes = ["E-Waste"];
  let currentMarker = null;

  document.getElementById("search-postcode").addEventListener("click", () => {
    const postCode = document.getElementById("postcodes").value;
    const item = eWasteData.find((item) => item.Postcode == postCode);
    addMarker(landfillData[0], "red");
  });

  Array.from(document.getElementsByClassName("form-check-input")).forEach(
    (ele) => ele.addEventListener("change", onCheckBoxChange)
  );
  generatePostcodeOptions();
})();

// Assuming you have fetched and stored data for ewaste, landfill, metal, and transfer

function mapDisplayDisposal() {}
