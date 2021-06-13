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
        bottom: 200,
        right: 50,
        left: 100
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    //adding an svg Area to insert the plot
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // selecting an initial demographic for each axis   
    var xdmg = "poverty";
    
    var ydmg = "healthcare";
    
    function x_scale(data,xdmg){
        let xScale = d3.scaleLinear()
        .domain([d3.min(data,d => d[xdmg]*.9),d3.max(data,d => d[xdmg]*1.1)])
        .range([0, width]);
        return xScale;
    }

    function y_scale(data,ydmg){
        let  yScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d[ydmg]*.9),d3.max(data, d=>d[ydmg]*1.1)])
        .range([height,0]);
        return yScale
    }

    
    
    // x-Labels
    let xlabels= chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`);

    let povertyLabel = xlabels
        .append("text")
        .attr("x",0)
        .attr("y",0)
        .attr("value","poverty")
        .classed("active", true)
        .classed("inactive",false)
        .text("In Poverty (%)");

    let ageLabel = xlabels
        .append("text")
        .attr("x",0)
        .attr("y",25)
        .attr("value","age")
        .classed("active", false)
        .classed("inactive", true)
        .text("Age (Median)");

    let incomeLabel = xlabels
        .append("text")
        .attr("x",0)
        .attr("y",50)
        .attr("value","income")
        .classed("active", false)
        .classed("inactive", true)
        .text("Household Income (Median)");




        
    // y-labels

    let ylabels= chartGroup.append("g")
      .attr("transform", "rotate(-90)");
    
    let healthcareLabel = ylabels
        .append("text")
        .attr("value", "healthcare")
        .attr("y", - margin.left+70)
        .attr("x", -(height/2))
        .classed("active", true)
        .text("Lacking Healthcare (%)");

    let smokeLabel = ylabels
        .append("text")
        .attr("value", "smokes")
        .attr("y", -margin.left + 45)
        .attr("x", -(height/2))
        .classed("inactive", true)
        .text("Smokes (%)");

    let obeseLabel = ylabels
        .append("text")
        .attr("value", "obesity")
        .attr("y", -margin.left + 20)
        .attr("x", -(height/2))
        .classed("inactive", true)
        .text("Obese (%)");

   



   
    //read the data from the csv file
    d3.csv("assets/data/data.csv").then(function(rawData){
        console.log(rawData)

        //parse data 
        rawData.forEach(d=>{
            d.poverty= +d.poverty;
            d.income = +d.income;
            d.age = +d.age;
            d.healthcare = +d.healthcare;
            d.obesity = +d.obesity;
            d.smokes = +d.smokes
        });

        //create scales
        let xScale = x_scale(rawData, xdmg);
        let yScale = y_scale(rawData,ydmg);

        //create axes
        let bottomAxis=d3.axisBottom(xScale).ticks(8);
        let leftAxis=d3.axisLeft(yScale).ticks(8);

        // append axes
        let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        let yAxis = chartGroup.append("g")
        .call(leftAxis);

        // append circles to scatter plot points
        let circlesGroup = chartGroup.append("g")
            .attr("id", "circles")
            .selectAll("circle")
            .data(rawData)
            .enter()
            .append("circle")
            .attr("cx", d=>xScale(d[xdmg]))
            .attr("cy", d=>yScale(d[ydmg]))
            .attr("r",12)
            .classed("stateCircle", true)
            
        //add state label to circles
        let stateId = chartGroup.append("g")
            .attr("id", "stateid")
            .selectAll("text")
            .data(rawData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d=> xScale(d[xdmg]))
            .attr("y", d=> yScale(d[ydmg])+4)
            .classed("stateText", true);
        
        //Initialize Tooltip
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

        // x labels event listener
        xlabels.selectAll("text").on("click",function(){
            let xPrevVal=xdmg;
            xdmg=d3.select(this).attr("value");
          
            if (xPrevVal !== xdmg){
               if(xdmg === "poverty"){
                    povertyLabel.classed("active", true).classed("inactive",false);
                    ageLabel.classed("active",false).classed("inactive",true); 
                    incomeLabel.classed("active",false).classed("inactive",true);
               } else if( xdmg === "age"){
                    ageLabel.classed("active", true).classed("inactive",false);
                    povertyLabel.classed("active",false).classed("inactive",true); 
                    incomeLabel.classed("active",false).classed("inactive",true);
               }else if( xdmg === "income"){
                    incomeLabel.classed("active", true).classed("inactive",false);
                    povertyLabel.classed("active",false).classed("inactive",true); 
                    ageLabel.classed("active",false).classed("inactive",true);
                }
            }

            //update x scale
            xScale = x_scale(rawData, xdmg);
            
            //update x axis
            bottomAxis=d3.axisBottom(xScale).ticks(8)
            
            xAxis.transition()
                .duration(500)
                .call(bottomAxis)

            //update circles
            circlesGroup.transition()
                .duration(500)
                .attr("cx", d=>xScale(d[xdmg]))
                .attr("cy", d=>yScale(d[ydmg]))

            //update state label for circles
            stateId.transition()
                .duration(500)
                .attr("x", d=> xScale(d[xdmg]))
                .attr("y", d=> yScale(d[ydmg])+4)
                

        });

        // y labeles event listener
        ylabels.selectAll("text").on("click",function(){
            let yPrevVal=ydmg;
            ydmg=d3.select(this).attr("value");
            
            if (yPrevVal !== ydmg){
                if(ydmg === "healthcare"){
                    healthcareLabel.classed("active", true).classed("inactive",false);
                    smokeLabel.classed("active",false).classed("inactive",true); 
                    obeseLabel.classed("active",false).classed("inactive",true);
                } else if( ydmg === "smokes"){
                    smokeLabel.classed("active", true).classed("inactive",false);
                    healthcareLabel.classed("active",false).classed("inactive",true); 
                    obeseLabel.classed("active",false).classed("inactive",true);
                }else if( ydmg === "obesity"){
                    obeseLabel.classed("active", true).classed("inactive",false);
                    healthcareLabel.classed("active",false).classed("inactive",true); 
                    smokeLabel.classed("active",false).classed("inactive",true);
                }
            }
            
            //update x scale
            yScale = y_scale(rawData, ydmg);
        
            //update x axis
            leftAxis=d3.axisLeft(yScale).ticks(8)
            
            yAxis.transition()
                .duration(500)
                .call(leftAxis)

            //update circles
            circlesGroup.transition()
                .duration(500)
                .attr("cx", d=>xScale(d[xdmg]))
                .attr("cy", d=>yScale(d[ydmg]))

            //update state label for circles
            stateId.transition()
                .duration(500)
                .attr("x", d=> xScale(d[xdmg]))
                .attr("y", d=> yScale(d[ydmg])+4)

        });
    }).catch(function(error) {
    console.log(error);
    });
}
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);