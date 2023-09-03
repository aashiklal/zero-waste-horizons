d3.csv("../../data/Classification_cleaned.csv").then(data => {
    const processedData = d3.rollups(
        data,
        v => ({
            recycled: parseFloat((d3.sum(v, d => +d.recycled) / 1000000).toFixed(2)),  // transfer to million tonnes
            disposal: parseFloat((d3.sum(v, d => +d.disposal) / 1000000).toFixed(2))
        }),
        d => d.financial_year
    )
    .filter(([year]) => year >= '2010' && year <= '2020')
    .map(([year, values]) => ({ ...values, year }));

    BarChart(processedData);
});


function BarChart(data) {
    const barChart = echarts.init(document.getElementById('barChart'));

    const option = {
        title: {
            text: 'Recycling vs. Disposal: From 2010 to 2020',
            left: 'center'
        },
        tooltip: {
            formatter: function(params) {
                return `${params.name}: ${params.value} Mt`;
            }
        },
        legend: {
            data: ['Recycled', 'Disposal'],
            right: 10,
            top: "5%"

        },
        xAxis: {
            type: 'category',
            data: data.map(d => d.year)
        },
        yAxis: {
            type: 'value',
            name: 'Amount (Mt)'
        },
        series: [
            {
                name: 'Recycled',
                type: 'bar',
                data: data.map(d => d.recycled),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#65F580' },
                        { offset: 0.5, color: '#58E472' },
                        { offset: 1, color: '#3CB252' }
                      ])
                    }
                },
            {
                name: 'Disposal',
                type: 'bar',
                data: data.map(d => d.disposal),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#65E1F5' },
                        { offset: 0.5, color: '#4DCADE' },
                        { offset: 1, color: '#2AA8BD' }
                        ])
                }
            }
        ]
    };

    
    barChart.setOption(option);
}