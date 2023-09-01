const width = 800;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const apiUrl = "http://localhost:3000/api/geojson";
const response = await fetch(apiUrl, {
  mode: "cors", // no-cors, cors, same-origin
});
const usaJson = await response.json();

const dataUrl = "http://localhost:3000/person?year=2012&wasteService=premises_with_garbage_service_residential";
const dataResponse = await fetch(dataUrl, {
  mode: "cors", // no-cors, cors, same-origin
});
const data = await dataResponse.json();

var myChart = echarts.init(document.getElementById("map"));
echarts.registerMap("USA", usaJson);
data.sort(function (a, b) {
  return a.value - b.value;
});
const mapOption = {
  visualMap: {
    left: "right",
    min: 0,
    max: 800,
    inRange: {
      // prettier-ignore
      color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
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
    },
  ],
};
const barOption = {
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    axisLabel: {
      rotate: 30,
    },
    data: data.map(function (item) {
      return item.name;
    }),
  },
  animationDurationUpdate: 1000,
  series: {
    type: "bar",
    id: "population",
    data: data.map(function (item) {
      return item.value;
    }),
    universalTransition: true,
  },
};
let currentOption = mapOption;
myChart.setOption(mapOption);
setInterval(function () {
  currentOption = currentOption === mapOption ? barOption : mapOption;
  myChart.setOption(currentOption, true);
}, 2000);
