(async function(){
    const dataUrl = `https://fullmoon.azurewebsites.net/api/linechart`;
    const dataResponse = await fetch(dataUrl, {
      mode: "cors",
    });
    const parsedData = await dataResponse.json();
  const filteredData = parsedData.filter(d => d.date.substring(0, 4) !== '2009' && d.date.substring(0, 4) !== '2020');

  const groupedData = d3.rollups(
      filteredData,
      values => ({
          total_waste: d3.sum(values, v => +v.total_waste),
          total_population: d3.sum(values, v => +v.population),
          total_residential: d3.sum(values, v => +v.residential) 
      }),
      d => d.date.substring(0, 4)
  ).sort(([a], [b]) => a - b);

  const finalData = groupedData.map(([year, stats]) => {
      const AnnualMeanPopulation = stats.total_population / 12;
      return {
          year: year,
          waste_per_capita: parseFloat((stats.total_waste / AnnualMeanPopulation).toFixed(2)), 
          residential_per_capita: parseFloat((stats.total_residential / AnnualMeanPopulation).toFixed(2))
      };
  });

  LineChart(finalData);

})();

function LineChart(data) {
  const myChart = echarts.init(document.getElementById('lineChart'));

  const option = {
      title: {
          text: 'Melbourne Annual Waste and Residential Per Capita',
          left: 'center'
      },
      tooltip: {},
      legend: {
          top: '10%',  
          right: '10%', 
          orient: 'vertical' 
      },
      xAxis: {
          data: data.map(d => d.year),
          name: 'Year',
          nameLocation: 'center',
          nameGap: 30 
      },
      yAxis: {
          name: 'Waste Per Capita (tonnes)'
      },
      series: [
          {
              name: 'Annual Total Waste Per Capita',
              type: 'line',
              data: data.map(d => d.waste_per_capita),
              lineStyle: {
                  width: 3,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      { offset: 0, color: '#27B2AA' },  
                      { offset: 1, color: '#33D8CE' }
                  ])
              },
              itemStyle: {
                  color: '#13BBE4'
              },
              symbolSize: 10
          },
          {
              name: 'Annual Residential Waste Per Capita',
              type: 'line',
              data: data.map(d => d.residential_per_capita),
              lineStyle: {
                  width: 3,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      { offset: 0, color: '#2ABD66' },  
                      { offset: 1, color: '#46E83E' }
                  ])
              },
              itemStyle: {
                  color: `#27A134`
              },
              symbolSize: 10
          }
      ]
  };
  myChart.setOption(option);
}
