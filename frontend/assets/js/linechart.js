document.addEventListener("DOMContentLoaded", async function () {
  const apiUrl = "https://fullmoon.azurewebsites.net/api/wastecollection"
  const response = await fetch(apiUrl, {
    mode: "cors", // no-cors, cors, same-origin
  });
  const data = await response.json();
  const filteredData = data
    .map(function (d) {
      return {
        Year: +d.year,
        total_waste: +d.total_waste,
      };
    })
    // filter data
    .filter((d) => d.Year > 2009 && d.Year < 2020);

  const aggregatedData = d3.rollups(
    filteredData,
    (group) => d3.sum(group, (d) => d.total_waste),
    (d) => d.Year
  );
  const formattedData = aggregatedData.map((d) => ({
    Year: new Date(d[0], 0),
    totalWaste: parseFloat(d[1].toFixed(2)),
  }));

  // set the dimensions and margins of the graph
  const originalWidth = 800;
  const originalHeight = 400;

  const svgWidth = originalWidth;
  const svgHeight = originalHeight;
  const margin = { top: 60, right: 30, bottom: 60, left: 60 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3
    .select(".line-chart svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style("display", "block")
    .style("margin", "auto");

  const g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3
    .scaleTime()
    .domain([new Date(2009, 0), new Date(2020, 0)])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(formattedData, (d) => d.totalWaste)])
    .nice()
    .range([height, 0]);

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g.append("g").call(yAxis);

  const line = d3
    .line()
    .x((d) => x(d.Year))
    .y((d) => y(d.totalWaste));

  g.append("path")
    .datum(formattedData)
    .attr("fill", "none")
    .attr("stroke", "#FFDAB9")
    .attr("stroke-width", 5)
    .attr("d", line);

  const points = g
    .selectAll("circle")
    .data(formattedData)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.Year))
    .attr("cy", (d) => y(d.totalWaste))
    .attr("r", 5)
    .attr("fill", "#FF4500");

  svg
    .append("text")
    .attr("x", svgWidth / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .text("Total Waste Production (2009-2020)");

  svg
    .append("text")
    .attr("x", svgWidth / 2)
    .attr("y", svgHeight - margin.bottom / 3)
    .attr("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -svgHeight / 2)
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .text("Total Waste (tonnes)");

  points
    .on("mouseover", (event, d) => {
      const mouseX = event.pageX;
      const mouseY = event.pageY;

      d3.select(event.target).attr("r", 8);

      const tooltip = g
        .append("text")
        .attr("class", "tooltip")
        .attr("x", x(d.Year))
        .attr("y", y(d.totalWaste) - 10)
        .text(d.totalWaste)
        .attr("text-anchor", "middle");
    })
    .on("mouseout", () => {
      d3.select(event.target).attr("r", 5);

      g.selectAll(".tooltip").remove();
    });
});
