function DonutChart(data) {
  const pieChart = echarts.init(document.getElementById('donutChart'));

  const option = {
      title: {
          text: 'Waste disposal methods and their respective percentages',
          top: '5%',
          left: 'center'
      },
      tooltip: {
          trigger: 'item',
          formatter: '{b}: {d}%'
      },
      legend: {
          orient: 'vertical',
          left: 10,
          top: "10%",
          data: data.map(d => d.name)
      },
      series: [
          {
              name: 'Waste Type',
              type: 'pie',
              radius: ['40%', '70%'], // inner and outer radius
              center: ['50%', '58%'],
              data: data
          }
      ]
  };
  
  pieChart.setOption(option)
}


(async function(){
    const dataUrl = `https://fullmoon.azurewebsites.net/api/donutchart`;
    const dataResponse = await fetch(dataUrl, {
      mode: "cors",
    });
    const data = await dataResponse.json();

    const totalRecycled = d3.sum(data, d => +d.recycled);
    const totalExportInterstate = d3.sum(data, d => +d.export_interstate);
    const totalExportInternational = d3.sum(data, d => +d.export_international);
    const totalDisposal = d3.sum(data, d => +d.disposal);
  
    const grandTotal = totalRecycled + totalExportInterstate + totalExportInternational + totalDisposal;
  
    const processedData = [
        { name: 'Recycled', value: totalRecycled, percentage: (totalRecycled / grandTotal) * 100 },
        { name: 'Export Interstate', value: totalExportInterstate, percentage: (totalExportInterstate / grandTotal) * 100 },
        { name: 'Export International', value: totalExportInternational, percentage: (totalExportInternational / grandTotal) * 100 },
        { name: 'Disposal', value: totalDisposal, percentage: (totalDisposal / grandTotal) * 100 }
    ];
    DonutChart(processedData);
})()