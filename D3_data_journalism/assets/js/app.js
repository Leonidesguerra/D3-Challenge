function makeResponsive() {

    var svgArea =d3.select("body").select("svg");

   // clear svg if not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

 // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth*.6;
  var svgHeight = window.innerHeight*.5;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };


  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //read the data from the csv file
  d3.csv("assets/data/data.csv").then(function(rawData){
    console.log(rawData)

    //parse data 
    rawData.forEach(d=>{
        d.poverty= +d.poverty;
        d.healthcare = +d.healthcare;
    });

    //create scales
    let xScale = d3.scaleLinear()
        .domain([8,d3.max(rawData,d => d.poverty+4)])
        .range([0, width]);
    
    let  yScale = d3.scaleLinear()
        .domain([4,d3.max(rawData, d=>d.healthcare +4)])
        .range([height,0]);


    //create axes
    let xAxis=d3.axisBottom(xScale).ticks(8);
    let yAxis=d3.axisLeft(yScale).ticks(8);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // append circles to scatter plot points
    let circlesGroup = chartGroup.append("g")
        .attr("id", "circles")
        .selectAll("circle")
        .data(rawData)
        .enter()
        .append("circle")
        .attr("cx", d=>xScale(d.poverty))
        .attr("cy", d=>yScale(d.healthcare))
        .attr("r",12)
        .classed("stateCircle", true)
        .text(d => d.abbr)
        .classed("stateText", true);

   






    }).catch(function(error) {
    console.log(error);
    });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);