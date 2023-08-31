const width = 800;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

import { councilName } from './map-select.js';
import { wasteGenerateData } from './map-select.js';

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
        .attr("fill", d => d.properties.LGA_NAME === councilName ? "red" : "white") // Change fill color conditionally
        .attr("opacity", d => d.properties.LGA_NAME === councilName ? 0.7 : 1) // Set opacity conditionally

    // Add labels (initially hidden)
    const labels = svg.selectAll("text")
        .data(data.features)
        .enter()
        .append("text")
        .text(d => d.properties.LGA_NAME) // Use the LGA_NAME property as the label
        .attr("x", d => pathGenerator.centroid(d)[0]) // Position the label at the centroid of the path
        .attr("y", d => pathGenerator.centroid(d)[1])
        .style("text-anchor", "middle")
        .style("font-size", "x-larger")
        .style("font-weight", "bold")
        .style("fill", "black")
        .style("display", "none"); // Hide labels by default

    // Add interactivity to show labels on hover
    mapPaths
        .on("mouseover", function () {
            d3.select(this)
                .attr("fill", "blue"); // Change the fill color on mouseover

            labels.style("display", "none"); // Hide all labels initially
            const feature = d3.select(this).data()[0];
            const correspondingLabel = labels.filter(d => d === feature);
            correspondingLabel.style("display", "block"); // Show the label for the hovered feature
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("fill", "white"); // Change back to white on mouseout

            labels.style("display", "none"); // Hide all labels on mouseout
        });

    // Update mapPaths on councilName change
    function updateMap() {
        mapPaths
            .attr("fill", d => d.properties.LGA_NAME === councilName ? "red" : "white")
            .attr("opacity", d => d.properties.LGA_NAME === councilName ? 0.7 : 1);

        // Display LGA-NAME and wasteGenerateData
        if (councilName !== "") {
            labels.style("display", "none");
            const matchingFeature = data.features.find(feature => feature.properties.LGA_NAME === councilName);
            if (matchingFeature) {
                const correspondingLabel = labels.filter(d => d === matchingFeature);
                correspondingLabel.style("display", "block");

                // Here you can use wasteGenerateData to display the data
                // For example, you can append it to the correspondingLabel
                correspondingLabel.text(d => `${d.properties.LGA_NAME}: ${wasteGenerateData}`);
            }
        } else {
            labels.style("display", "none");
        }
    }

    // Call the updateMap function when councilName changes
    window.addEventListener('councilNameChange', updateMap);

    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'none';
});

