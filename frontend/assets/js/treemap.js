d3.csv("../../data/WasteCollectionMonthly_cleaned.csv").then(function (data) {
    // return an array of objects
    const filteredData = data.map(function(d) {
        return {
            Residential: +d.residential,
            PublicBins: +d.public_litter_bins,
            Dumped: +d.dumped_rubbish,
            Street: +d.street_sweepings,
            Commingled: +d.commingled_recycling,
            Cardboard: +d.cardboard,
            Hardwaste: +d.hardwaste_total,
            Greenwaste: +d.green_waste
        };
    });

    let totalData = {};
    // for each object in the array, if the key is already in the totalData object, 
    // add the value to the existing value
    filteredData.forEach((d) => {
        for (const [key, value] of Object.entries(d)) {
            totalData[key] = (totalData[key] || 0) + value;
        }
    });

    // Calculate the total for all waste types
    const grandTotal = Object.values(totalData).reduce((acc, curr) => acc + curr, 0);

    // Format data for treemap
    const treemapData = {
        name: "Waste Classification",
        children: Object.keys(totalData).map((key) => ({
            name: key,
            value: totalData[key]
        }))
    };
    Treemap(treemapData, grandTotal);

    function Treemap(data, total) {
        const myChart = echarts.init(document.getElementById('Treemap'));

        const option = {
            title: {
                text: 'Waste collection channels',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    const percentage = ((params.data.value / total) * 100).toFixed(2);
                    return `${params.name}: ${percentage}%`;
                }
            },
            visualMap: {
                type: 'continuous',
                min: 0,
                max: Math.max(...Object.values(totalData)),
                inRange: {
                    color: ['#5AB84E', '#29731F'] // Display the module using gradient colors.
                }
            },
            series: [{
                name: 'Waste Type',
                type: 'treemap',
                data: [data],
                leafDepth: 1,
                label: {
                    show: true,
                    formatter: function(params) {
                        const percentage = ((params.data.value / total) * 100).toFixed(2);
                        return `${params.name}\n${percentage}%`;
                    }
                }
            }]
        };

        myChart.setOption(option);
    }
});

