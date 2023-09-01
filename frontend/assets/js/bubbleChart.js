document.addEventListener("DOMContentLoaded", async function () {
  const svgWidth = 800 * 0.7;
  const svgHeight = 400 * 0.7;

  // Bubble plot
  const apiUrl =
    "https://fullmoon.azurewebsites.net/api/wastecollection/details";
  const response = await fetch(apiUrl, {
    mode: "cors", // no-cors, cors, same-origin
  });
  const data = await response.json();
  const filteredData = data.map(function (d) {
    return {
      Residential: +d.residential,
      PublicBins: +d.public_litter_bins,
      Dumped: +d.dumped_rubbish,
      Street: +d.street_sweepings,
      Commingled: +d.commingled_recycling,
      Cardboard: +d.cardboard,
      Hardwaste: +d.hardwaste_total,
      Greenwaste: +d.green_waste,
    };
  });

  let totalData = {};
  filteredData.forEach((d) => {
    for (const [key, value] of Object.entries(d)) {
      totalData[key] = (totalData[key] || 0) + value;
    }
  });

  const bubbleData = Object.keys(totalData).map((key) => {
    return {
      label: key,
      value: totalData[key],
      x: svgWidth / 2,
      y: svgHeight / 2,
    };
  });

  function drawBubbleChart(data) {
    const width = svgWidth;
    const height = svgHeight;

    const color = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
      .range(["#FFDAB9", "#FF4500"]);

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([10, 80]);

    const simulation = d3
      .forceSimulation(data)
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .force(
        "collide",
        d3.forceCollide((d) => radiusScale(d.value) + 3)
      );

    const svg = d3
      .select(".bubble-chart svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const bubbles = svg.selectAll(".bubble").data(data).enter().append("g");

    bubbles
      .append("circle")
      .attr("r", (d) => radiusScale(d.value))
      .attr("fill", (d) => color(d.value));

    const minValueToShowLabel = 10000;

    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .text((d) => (d.value > minValueToShowLabel ? d.label : ""))
      .attr("visibility", (d) =>
        d.value > minValueToShowLabel ? "visible" : "hidden"
      )  
      .style("font-family", "Arial")  // Change the font-family here.
      .style("font-size", "14px")     // Change the font size if needed.

    simulation.nodes(data).on("tick", ticked);

    function ticked() {
      bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    }
  }

  drawBubbleChart(bubbleData);
});
