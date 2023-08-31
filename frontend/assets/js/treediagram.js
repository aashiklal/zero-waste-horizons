document.addEventListener("DOMContentLoaded", async function () {
  const apiUrl = "https://fullmoon.azurewebsites.net/api/classification";
  const response = await fetch(apiUrl, {
    mode: "cors", // no-cors, cors, same-origin
  });
  const data = await response.json();
  const nestedData = d3.group(
    data,
    (d) => d.wpm_material_type,
    (d) => d.wpm_material_name
  );
  const treeData = {
    name: "Waste",
    children: Array.from(nestedData).map(([key, values]) => ({
      name: key,
      children: Array.from(values).map(([key, subValues]) => {
        const total = subValues.reduce(
          (acc, curr) => acc + parseFloat(curr.recovery_rate),
          0
        );
        const averageRate = total / subValues.length;
        return {
          name: key,
          recoveryRate: averageRate,
        };
      }),
    })),
  };

  const root = d3.hierarchy(treeData);

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }
  root.children.forEach(collapse);
  drawTree(root);

  function drawTree(root) {
    d3.select("#treeDiagram").selectAll("*").remove();

    const width = 800;
    const height = 800;

    const svg = d3
      .select("#treeDiagram")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(50,50)");

    const tree = d3.tree().size([height - 100, width - 350]);

    tree(root);

    const link = svg
      .selectAll(".link")
      .data(root.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", function (d) {
        return (
          "M" +
          d.y +
          "," +
          d.x +
          "C" +
          (d.y + d.parent.y) / 2 +
          "," +
          d.x +
          " " +
          (d.y + d.parent.y) / 2 +
          "," +
          d.parent.x +
          " " +
          d.parent.y +
          "," +
          d.parent.x
        );
      });

    const node = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr(
        "class",
        (d) => "node" + (d.children ? " node--internal" : " node--leaf")
      )
      .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")")
      .on("click", function (event, d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        drawTree(root);
      });

    const iconPath = "assets/img/bin.svg";

    node
      .append("image")
      .attr("xlink:href", iconPath)
      .attr("x", -10) 
      .attr("y", -10)
      .attr("width", 20)
      .attr("height", 20);

    node.each(function (d) {
      if (!d.children && !d._children) {
        const recoveryLength = d.data.recoveryRate * 10;
        d3.select(this)
          .append("rect")
          .attr("x", 10)
          .attr("y", -recoveryLength / 2)
          .attr("width", 20)
          .attr("height", recoveryLength)
          .attr("fill", "steelblue");

        d3.select(this)
          .append("text")
          .attr("x", 35)
          .attr("y", 0)
          .attr("fill", "black")
          .text(
            d.data.name +
              "（recovery: " +
              (d.data.recoveryRate * 100).toFixed(2) +
              "%）"
          );
      } else {
        d3.select(this)
          .append("text")
          .attr("dy", "-1em")
          .attr("x", 0)
          .style("text-anchor", "middle")
          .text(d.data.name);
      }
    });
  }
});
