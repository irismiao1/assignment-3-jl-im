import * as d3 from "d3";


d3.csv("../police_killings.csv").then((table) => {

  var vals = Array.from(d3.rollup(table, v => v.length, d => d.state))
  //console.log(vals)

  var barDiv = document.querySelector("#d3-div");
  var padding = 30;

  var xScale = d3
    .scaleBand()
    .domain(vals.map((d) => d[0]))
    .range([0 + padding, barDiv.clientWidth - padding])
    .paddingInner(0.1);

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(vals, (d) => d[1])])
    .range([500, 0]);

  var svg = d3
    .select(barDiv)
    .append("svg")
    .attr("width", barDiv.clientWidth)
    .attr("height", 600);

  var barTip = d3.select("body").append("d3-div")
    .attr("class", "toolTip")
    .style("opacity", 0);

  svg
    .selectAll("rect")
    .data(vals)
    .enter()
    .append("rect")
    .attr("fill", "pink")
    .attr("x", (d) => xScale(d[0]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => 500-yScale(d[1]))

    .on('mouseover', function(d, i) {
      d3.select(this).transition()
        .duration("50")
        .attr("opacity", "0.85")
      barTip.transition()
          .duration(50)
          .style("opacity", 1);
      barTip.html(i)
        .style("left", (d3.pointer(d))-50+"px")
        .style("top", (d3.pointer(d))-70+"px")
        .style("display", "inline-block")
        .text("State: " + i[0] + ", Count: " + i[1])
    })

      .on('mouseout', function(d, i) {
      d3.select(this).transition()
        .duration("50")
        .attr("opacity", "1")
      barTip.transition()
          .duration("50")
          .style("opacity", 0);
    }); 
     

  let xAxis = d3.axisBottom(xScale);
  svg.append("g").attr("transform", "translate(0, 500)").call(xAxis);

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.format("0"));
  svg.append("g").attr("transform", `translate(${padding}, 0)`).call(yAxis);
});
