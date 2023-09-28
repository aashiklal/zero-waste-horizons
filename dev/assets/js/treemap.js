(async function (data) {
    const dataUrl = `https://fullmoon.azurewebsites.net/api/treemap`;
    const dataResponse = await fetch(dataUrl, {
      mode: "cors",
    });
    const treedata = await dataResponse.json();
    // return an array of objects
    const filteredData = treedata.map(function(d) {
        return {
            Residential: +d.residential,
            PublicBins: +d.public_litter_bins,
            Dumped: +d.dumped_rubbish,
            Street: +d.street_sweepings,
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

    function Treemap(treedata, total) {
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
                show: false,
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
                data: [treedata],
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
})();

