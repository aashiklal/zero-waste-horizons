// Set the map's width, height, and margin
var width = 800;
var height = 500;
var margin = { top: 20, right: 20, bottom: 20, left: 20 };

// Create an SVG element
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load your GeoJSON data
var geojsonUrl = 'assets/data/Council.geojson';

// Create a GeoJSON projection
var projection = d3.geoMercator();

// Create a path generator
var pathGenerator = d3.geoPath().projection(projection);

// Load and display the GeoJSON data
d3.json(geojsonUrl).then(function (data) {
    // Fit the projection to the GeoJSON data
    projection.fitSize([width, height], data);

    // Append a path for each GeoJSON feature
    svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator);
});