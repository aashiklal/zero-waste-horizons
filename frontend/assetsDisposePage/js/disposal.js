(async function () {
  // Async function to fetch data from E_waste_Table_1
  async function fetchEWasteData() {
    const dataResponse = await fetch("https://fullmoon.azurewebsites.net/api/e_waste", {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  // Async function to fetch data from Transfer_Station_Table_1
  async function fetchTransferStationData() {
    const dataResponse = await fetch(
      "https://fullmoon.azurewebsites.net/api/transfer_station",
      { mode: "cors" }
    );
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  // Async function to fetch data from Metals_Table_1
  async function fetchMetalsData() {
    const dataResponse = await fetch("https://fullmoon.azurewebsites.net/api/metals", {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  // Async function to fetch data from Landfill_Table_1
  async function fetchLandfillData() {
    const dataResponse = await fetch("https://fullmoon.azurewebsites.net/api/landfill", {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
    return parsedData;
  }

  const eWasteData = await fetchEWasteData();

  const transferStationData = await fetchTransferStationData();

  const metalsData = await fetchMetalsData();

  const landfillData = await fetchLandfillData();

  const dataTypeDict = {
    landfill: landfillData,
    transfer: transferStationData,
    metal: metalsData,
    ewaste: eWasteData,
  };
  function generatePostcodeOptions(types) {
    const dataList = document.getElementById("postcodes");
    const zipCodeSet = new Set();
    types.forEach((type) => {
      dataTypeDict[type]
        .map((item) => item.Postcode)
        .forEach((code) => zipCodeSet.add(code));
    });
    Array.from(zipCodeSet).forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      dataList.appendChild(option);
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
    const checkedKeys = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const key = checkbox.getAttribute("data-key");
        if (key) {
          checkedKeys.push(key);
        }
      }
    });
    currentSelectedTypes = checkedKeys;
    generatePostcodeOptions(checkedKeys);
  }

  function setItemsCenter(locations) {
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;
    locations.forEach((location) => {
      totalLat += location.Latitude;
      totalLng += location.Longitude;
      count++;
    });

    const centerLat = totalLat / count;
    const centerLng = totalLng / count;
    map.setZoom(13)
    map.setCenter(new google.maps.LatLng(centerLat, centerLng));
  }

  function addSingleMarker(locationItem,color,type) {
    const marker = new google.maps.Marker({
      map: map,
      position: { lat: locationItem.Latitude, lng: locationItem.Longitude },
      title: locationItem.UniqueId,
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`, // Set color
    });
    const infoContent = `
    <div>
    
      <h4>${locationItem.FacilityOrSiteName}</h4>
      <p>Type:${type}</p>
      <p>Owner: ${locationItem.Owner}</p>
      <p>Management Type: ${locationItem.ManagementType}</p>
      <p>Infrastructure Type: ${locationItem.InfrastructureType}</p>
      <p>Address: ${locationItem.FacilityStreetAddress}, ${locationItem.FacilitySuburbLocality}, ${locationItem.State}, ${locationItem.Postcode}</p>
    </div>
  `;

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });
    marker.addListener("mouseover", () => {
      infoWindow.open(map, marker);
    });

    marker.addListener("mouseout", () => {
      infoWindow.close();
    });
    return marker
  }

  function addMarkerToMap(selectedTypes, postCode) {
    // Remove the previous marker if it exists
    currentMarkers.forEach((marker) => marker.setMap(null));
    currentMarkers = [];
    const allItems = [];
    selectedTypes.forEach((type) => {
      let items = dataTypeDict[type].filter(
        (item) => item.Postcode == postCode
      );
      let color = undefined;
      switch (type) {
        case "ewaste":
          color = "red";
          break;
        case "landfill":
          color = "blue";
          break;
        case "transfer":
          color = "green";
          break;
        case "metal":
          color = "black";
          break;
      }

      items.forEach((locationItem) => {
        const marker = addSingleMarker(locationItem,color,type)
        currentMarkers.push(marker);
      });

      allItems.push(...items);
    });
    if (allItems.length) {
      setItemsCenter(allItems);
    }
  }

  let map = initMap();
  let currentMarkers = [];
  let currentSelectedTypes = ["ewaste", "landfill", "metal", "transfer"];

  document.getElementById("search-postcode").addEventListener("click", () => {
    const postCode = document.getElementById("post-code-field").value;
    addMarkerToMap(currentSelectedTypes, postCode, currentMarkers);
  });

  Array.from(document.getElementsByClassName("form-check-input")).forEach(
    (ele) => ele.addEventListener("change", onCheckBoxChange)
  );
  generatePostcodeOptions(currentSelectedTypes);
})();

// Assuming you have fetched and stored data for ewaste, landfill, metal, and transfer

function mapDisplayDisposal() {}
