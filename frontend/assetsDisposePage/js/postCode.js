let postcodes = [];

fetch('/get-postcodes')
    .then(response => response.text())
    .then(data => {
        postcodes = data.split('\n').map(Number).filter(Boolean);
        populateDatalist(postcodes);
    })
    .catch(error => {
        console.error('Error fetching postcodes:', error);
    });

function populateDatalist(postcodes) {
    const dataList = document.getElementById('postcodes');
    postcodes.forEach(code => {
        const option = document.createElement('option');
        option.value = code;
        dataList.appendChild(option);
    });
}
