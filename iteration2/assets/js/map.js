let currentType = "map"
let myChart = echarts.init(document.getElementById("map"));
let data = []
let currentService = "premises_with_garbage_service_residential"
let currentYear = "2010"
async function getMapData(year=2010,wasteService) {
    const dataUrl = `https://fullmoon.azurewebsites.net/api/mapdata?year=${year}&wasteService=${wasteService}`;
    const dataResponse = await fetch(dataUrl, {
      mode: "cors",
    });
    const data = await dataResponse.json();
    return     data;
}
let selectedConcil = []

const colors = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
const minVal = 0;
const maxVal = 800;
const getMapOption = () => {
    return {
        visualMap: {
          left: "right",
          min: minVal,
          max: maxVal,
          inRange: {
            // prettier-ignore
            color: colors,
          },
          text: ["High", "Low"],
          calculable: true,
        },
        series: [
          {
            id: "population",
            type: "map",
            roam: true,
            map: "USA",
            animationDurationUpdate: 1000,
            universalTransition: true,
            data: data,
            selectedMode: 'multiple'
          },
        ]
      };
}
function lerpColor(a, b, amount) {
    const ar = a >> 16,
          ag = a >> 8 & 0xff,
          ab = a & 0xff,
          br = b >> 16,
          bg = b >> 8 & 0xff,
          bb = b & 0xff,
          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);

    return (rr << 16) + (rg << 8) + (rb | 0);
}

function getColorForValue(value, min, max, colors) {
    const range = max - min;
    const step = range / (colors.length - 1);
    const index = Math.min(colors.length - 1, Math.floor((value - min) / step));
    const lerpAmount = ((value - min) - (step * index)) / step;

    // 为防止index超出数组边界，进行检查
    const color1 = colors[index] ? parseInt(colors[index].replace('#',''), 16) : null;
    const color2 = colors[index + 1] ? parseInt(colors[index + 1].replace('#',''), 16) : null;

    // 如果color2不存在，直接使用color1
    if (!color2) {
        return color1 ? '#' + color1.toString(16) : '#000000';  // 使用黑色作为默认颜色
    }

    const lerpedColor = lerpColor(color1, color2, lerpAmount);
    return '#' + (lerpedColor | 0).toString(16);
}

const getBarOption = () => {
    const barData = selectedConcil.length ? selectedConcil:data;
    barData.sort(function (a, b) {
        return a.value - b.value;
      });
    return  {
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          axisLabel: {
            rotate: 30,
          },
          data: barData.map(function (item) {
            return item.name;
          }),
        },
        animationDurationUpdate: 1000,
        series: {
          type: "bar",
          id: "population",
          data: barData.map(function (item) {
            return {
                value: item.value,
                itemStyle: {
                    color: getColorForValue(item.value, minVal, maxVal, colors)
                }
            };
          }),
          universalTransition: true,
        },
      };
}
async function generateMap() {
    myChart.showLoading()
    const apiUrl = "https://fullmoon.azurewebsites.net/api/geojson";
    const response = await fetch(apiUrl, {
      mode: "cors",
    });
    const usaJson = await response.json();
    data = await getMapData(currentYear,currentService)
    myChart.hideLoading()
    echarts.registerMap("USA", usaJson);
    myChart.setOption(currentType === 'map'?getMapOption():getBarOption(), true);
}



function onCharTypeSwitch() {
    const label = document.getElementById("type-switch-label")
    currentType = currentType === "map"?"bar":"map"
    label.innerText = currentType === "map"?"Change to bar":"Change to map"
    const option = currentType === "map"?getMapOption():getBarOption()
    if(currentType === "map") {
        selectedConcil = []
    }
    myChart.setOption(option, true);
}


async function onClickKerbsideRecyclingServiceBtn()  {
    currentService = "premises_with_kerbside_recycling_service_residential"
    generateMap()
}
async function onClickGarbageServiceBtn()  {
    currentService = "premises_with_garbage_service_residential"
    generateMap()
}
async function onYearChange(ele) {
    const yearSelect = document.getElementById("yearSelect");
    currentYear = yearSelect.value;
    generateMap()
}

myChart.on('selectchanged', function (params) {
    console.log(params)
    selectedConcil = params.selected[0].dataIndex.map((index) => data[index])
});

(async function(){
    generateMap()
    myChart.on('selectchanged', function (params) {
        console.log(params)
        selectedConcil = params.selected[0].dataIndex.map((index) => data[index])
    });
})()