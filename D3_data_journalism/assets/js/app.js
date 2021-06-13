function makeResponsive() {

    var svgArea =d3.select("body").select("svg");

    // clear svg if not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth*.6;
    var svgHeight = window.innerHeight*.7;

    var margin = {
        top: 50,
        bottom: 100,
        right: 50,
        left: 100
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
            

        let stateId = chartGroup.append("g")
            .attr("id", "stateid")
            .selectAll("text")
            .data(rawData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d=> xScale(d.poverty))
            .attr("y", d=> yScale(d.healthcare)+4)
            .classed("stateText", true);
        
           // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
                return (`<strong>${d.state}</strong><br>Poverty: ${d.poverty}% 
                <br>Healthcare: ${d.healthcare}%`);
            });
            

        // Step 2: Create the tooltip in chartGroup.
        chartGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(d) {
            toolTip.show(d, this);
        })
         // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });
   
        // x- Label
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
            .classed("active", true)
            .text("In Poverty (%)");
        // y label
        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y", -margin.left/2)
            .attr("x", -(height/2))
            .classed("active", true)
            .text("Lacking Healthcare (%)");

        


    }).catch(function(error) {
    console.log(error);
    });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);