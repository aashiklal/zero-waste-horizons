const width = 800;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load and render the GeoJSON data
d3.json("assets/data/Council.geojson").then(data => {
    // Create a projection
    const projection = d3.geoMercator()
        .fitSize([width, height], data);

    // Create a path generator
    const pathGenerator = d3.geoPath()
        .projection(projection);

    // Draw the map features
    const mapPaths = svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("fill", "white");

    mapPaths.on("mouseover", function () {
        d3.select(this)
            .attr("fill", "blue"); // Change the fill color on mouseover
    })
        .on("mouseout", function () {
            d3.select(this)
                .attr("fill", "white"); // Change back to white on mouseout
        });
});