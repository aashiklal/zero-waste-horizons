const yearSelect = document.getElementById('yearSelect');
let selectedYear = "";
yearSelect.addEventListener('change', () => {
    selectedYear = yearSelect.value;
    console.log('Selected Year:', selectedYear);
});

const councilInput = document.getElementById('councilInput');
const councilList = document.getElementById('councilList');
const allCouncil = ['Alpine Shire', 'Ararat Rural City', 'Ballarat City',
    'Banyule City', 'Bass Coast Shire', 'Baw Baw Shire',
    'Bayside City', 'Benalla Rural City', 'Boroondara City',
    'Brimbank City', 'Buloke Shire', 'Campaspe Shire',
    'Cardinia Shire', 'Casey City', 'Central Goldfields Shire',
    'Colac Otway Shire', 'Corangamite Shire', 'Darebin City',
    'East Gippsland Shire', 'Frankston City', 'Gannawarra Shire',
    'Glen Eira City', 'Glenelg Shire', 'Golden Plains Shire',
    'Greater Bendigo City', 'Greater Dandenong City',
    'Greater Geelong City', 'Greater Shepparton City', 'Hepburn Shire',
    'Hindmarsh Shire', 'Hobsons Bay City', 'Horsham Rural City',
    'Hume City', 'Indigo Shire', 'Kingston City', 'Knox City',
    'Latrobe City', 'Loddon Shire', 'Macedon Ranges Shire',
    'Manningham City', 'Mansfield Shire', 'Maribyrnong City',
    'Maroondah City', 'Melbourne City', 'Melton City',
    'Merri-Bek City', 'Mildura Rural City', 'Mitchell Shire',
    'Moira Shire', 'Monash City', 'Moonee Valley City',
    'Moorabool Shire', 'Mornington Peninsula Shire',
    'Mount Alexander Shire', 'Moyne Shire', 'Murrindindi Shire',
    'Nillumbik Shire', 'Northern Grampians Shire', 'Port Phillip City',
    'Pyrenees Shire', 'Queenscliffe Borough', 'South Gippsland Shire',
    'Southern Grampians Shire', 'Stonnington City',
    'Strathbogie Shire', 'Surf Coast Shire', 'Swan Hill Rural City',
    'Towong Shire', 'Wangaratta Rural City', 'Warrnambool City',
    'Wellington Shire', 'West Wimmera Shire', 'Whitehorse City',
    'Whittlesea City', 'Wodonga City', 'Wyndham City', 'Yarra City',
    'Yarra Ranges Shire', 'Yarriambiack Shire'];
let councilName = "";

function filterCouncils() {
    const inputText = councilInput.value.toLowerCase();
    councilList.innerHTML = '';

    const filteredCouncils = allCouncil.filter(council => council.toLowerCase().includes(inputText));

    filteredCouncils.forEach(council => {
        const li = document.createElement('li');
        li.textContent = council;
        li.addEventListener('click', () => {
            councilInput.value = council;
            councilName = council;
            councilList.style.display = 'none';
            console.log('council name:', councilName);
        });
        councilList.appendChild(li);
    });
    if (filteredCouncils.length > 0) {
        councilList.style.display = 'block';
    } else {
        councilList.style.display = 'none';
    }
}
document.addEventListener('click', (event) => {
    if (!councilList.contains(event.target) && event.target !== councilInput) {
        councilList.style.display = 'none';
    }
});


const personGenerateRadio = document.getElementById('person-generate');
const totalGenerateRadio = document.getElementById('total-generate');
let personOrTotalValue = ''; // Initialize a variable to store the selected value

personGenerateRadio.addEventListener('change', () => {
    if (personGenerateRadio.checked) {
        personOrTotalValue = personGenerateRadio.value;
        console.log('Selected Value:', personOrTotalValue);
    }
});
totalGenerateRadio.addEventListener('change', () => {
    if (totalGenerateRadio.checked) {
        personOrTotalValue = totalGenerateRadio.value;
        console.log('Selected Value:', personOrTotalValue);
    }
});

const wasteServiceSelect = document.getElementById('wasteServiceSelect');
let selectedWasteService = "";
wasteServiceSelect.addEventListener('change', () => {
    selectedWasteService = wasteServiceSelect.value;
    console.log('Selected Waste Service:', selectedWasteService);
});

let wasteGenerateData = 20; 