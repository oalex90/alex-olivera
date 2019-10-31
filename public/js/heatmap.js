const PADDING_LEFT = 100; //needed to account for y-axis and label
const PADDING_RIGHT = 10; //needed to account last tick of y axis
const PADDING_BOTTOM = 90; //needed to account for x-axis and label and legend
const PADDING_TOP = 10; //needed to account for x-axis so last value isn't cut off
const GRAPH_HEIGHT = 500; //individual heat map height
const GRAPH_WIDTH = 1250; //individual heat map width
const CHART_HEIGHT = GRAPH_HEIGHT + PADDING_TOP + PADDING_BOTTOM; //heat map + x-axis
const CHART_WIDTH = GRAPH_WIDTH + PADDING_LEFT + PADDING_RIGHT; //heat map + y-axis

$('document').ready(function() {
  
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const colors = ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  
  $.getJSON(url, function(jsonData){ //get data from webpage and perform actions once it's loaded
    let data = jsonData.monthlyVariance; //main data array we will be accessing
    console.log(data);

    let baseTemp = jsonData.baseTemperature; 
    let minYear = data[0]["year"];
    let maxYear = data[data.length-1]["year"];
    var timeFormat = d3.timeFormat("%Y");

    d3.select("h2") //title for chart
      .text("Monthly Global Land-Surface Temperature");

    d3.select("h3") //sub-title for chart
      .text(minYear + " - " + maxYear);

    //quantile scale will create 10 quantiles to split the data into 11 groups based on variance value
    var colorScale = d3.scaleQuantile() //scale to determine color based on variance
    .domain([
      d3.min(data, (d)=> d.variance + baseTemp),
      d3.max(data, (d)=> d.variance + baseTemp)
    ])
    .range([0,1,2,3,4,5,6,7,8,9,10]); // 11 colors in colors array

    var xScale = d3.scaleTime() //x-axis is scaled based on time from min year to max year
    .domain([new Date(minYear, 0), 
             new Date(maxYear, 0)])
    .range([0, GRAPH_WIDTH]);

    var xAxis = d3.axisBottom() //ticks and values are shown below line
    .scale(xScale)
    .tickFormat(timeFormat)
    .ticks(20); //tick every 10 years
    
    var timeFormat = d3.timeFormat("%B");

    var yScale = d3.scaleBand()
      .domain([1,2,3,4,5,6,7,8,9,10,11,12]) //months
      .range([0, GRAPH_HEIGHT]);
    
    var yAxis = d3.axisLeft()
      .scale(yScale)
      .tickFormat(function(month){
        var date = new Date(0);
        date.setUTCMonth(month);
        return timeFormat(date);
      })

    var tooltip = d3.select("#chart") //tooltip
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0); //start invisible

    var chart = d3.select("#chart")
    .append("svg")
    .attr("width", CHART_WIDTH)
    .attr("height",CHART_HEIGHT)

    chart.selectAll(".rect")
      .data(data)
      .enter()
      .append("rect") //add rectangles to symbolize bars in the heat map
      .attr("class", "cell")
      .attr("data-month", (d)=>d.month-1)
      .attr("data-year", (d)=>d.year)
      .attr("data-temp", (d)=>d.variance + baseTemp)
      .attr("x", (d)=> xScale(new Date(d.year, 0)) + PADDING_LEFT) //use scale and offset by x-axis
      .attr("y", (d)=> yScale(d.month) + PADDING_TOP) //use scale and offset by y-axis
      .attr("height", (d)=> GRAPH_HEIGHT / months.length) //since 12 sections make each rect 1/12 of graph height
      .attr("width", Math.ceil(GRAPH_WIDTH / (maxYear-minYear))) //round so chart appears fully filled
      .attr("fill", (d)=> colors[colorScale(d.variance + baseTemp)]) //use colorScae to determine color
      .on("mouseover", function(d) { //on mouseover, populate div, make visible, and move to near corresponding rectangle
        tooltip.transition() //fade in
          .duration(100)
          .attr("data-year", d.year)
          .style("opacity", 0.8); //make div slightly see-through
        tooltip.html("<span><b>" + d.year + " - " + months[d.month-1] + "</b></span><br>" +  //populate div
                 "<span><b>" + (baseTemp + d.variance).toFixed(3) + "&#8451</b></span><br>" +
                 "<span>" + d.variance + "&#8451</span>")
        .style("left", (d3.event.pageX - ($('.tooltip').width()/2)) + "px") //x = same as rectange hovered - half of div width
        .style("top", (d3.event.pageY - 75) + "px"); //y = same as rect hovered - 75 so appears above rect hovered
    })
      .on("mouseout", function(d) { //on mouseout, hide tooltip div
      tooltip.transition() //fade out
        .duration(200)
        .style("opacity", 0);
    });

    /*
    chart.selectAll(".months") //add month labels to y axis
      .data([0,1,2,3,4,5,6,7,8,9,10,11]) //12 months in months array
      .enter()
      .append("text") //month labels
      .attr("x", PADDING_LEFT - 4) //offset by 4 so not touching axis
      .attr("y", (d)=> PADDING_TOP + d*GRAPH_HEIGHT/12 + GRAPH_HEIGHT/12/2 + 6) //place in the cetner of corresponding section
      .text((d)=> months[d])
      .style("font-size", 16)
      .style("text-anchor", "end"); // x and y of text is at end of text
      */

    let legendRectWidth = 40;
    let legend = chart.append("g")
      .attr("id", "legend")
    
    legend.selectAll(".legend-bars") //add legend rectangles
      .data([0,1,2,3,4,5,6,7,8,9,10]) //11 colors in colors array
      .enter()
      .append("rect")
      .attr("x", (d)=> PADDING_LEFT + GRAPH_WIDTH - (d+1)*legendRectWidth) //place in horizontal line starting at end of graph
      .attr("y", PADDING_TOP + GRAPH_HEIGHT + 40) //offset so space between axis and rectangles
      .attr("height", 20)
      .attr("width", legendRectWidth)
      .attr("fill", (d)=> colors[10-d]) //since created rects from right-to-left, need to add colros in reverse order

    let quantiles = colorScale.quantiles(); //10 quantiles created to split data to 11 sections/colors
    chart.selectAll(".legend-labels") //create labels for legend rectangles
      .data([0,1,2,3,4,5,6,7,8,9]) //10 quantiles
      .enter()
      .append("text") //part of legend
      .attr("x", (d)=> PADDING_LEFT + GRAPH_WIDTH - (d+1)*legendRectWidth) //same x placement as legend rectangles
      .attr("y", PADDING_TOP + GRAPH_HEIGHT + 75) //slightly below legend rectangles
      .text((d)=> quantiles[9-d].toFixed(1)) //cut value to 1 decimal place
      .style("font-size", 14)
      .style("text-anchor", "middle"); //x and y o ftext is at middle of text

    chart.append("g") //append x-axis
      .attr("id", "x-axis")
      .attr("class", "axis")
      .call(xAxis)
      .attr("transform", //slide right and down to show just below graph
            "translate(" + (PADDING_LEFT) + "," + (GRAPH_HEIGHT + PADDING_TOP) +")");

    chart.append("g") //append y-axis
      .attr("id", "y-axis")
      .attr("class", "axis")
      .call(yAxis)
      .attr("transform", //slide right and down to show just left of graph
            "translate(" + PADDING_LEFT + "," + PADDING_TOP + ")")

    chart.append("text") //label for the y-axis
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)") //rotate so it's oriented/facing how it is
      .attr("y", 15) //x and y are switched for some reason
      .attr("x", -PADDING_TOP - (GRAPH_HEIGHT/2)) // place in center of graph
      .style("text-anchor", "middle") //makes x,y point positioned at middle of text
      .text("Months")

    chart.append("text") //label for the x-axis
      .attr("class", "axis-label")
      .attr("y", PADDING_TOP + GRAPH_HEIGHT + 55) // position below y-axis
      .attr("x", PADDING_LEFT + (GRAPH_WIDTH/2))
      .style("text-anchor", "middle") //makes x,y point positioned at middle of text
      .text("Years")
  });
});