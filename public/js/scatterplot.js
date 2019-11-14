import '../css/scatterplot.scss';
import $ from 'jquery';
import * as d3 from 'd3';

const PADDING_LEFT = 52; //needed to account for y-axis
const PADDING_RIGHT = 101; //needed to account for y-axis and so last value isn't cut off
const PADDING_BOTTOM = 30; //neeeded to account for x-axis
const PADDING_TOP = 10; //needed to account for x-axis so last value isn't cut off
const GRAPH_HEIGHT = 600; //individual bar graph height
const GRAPH_WIDTH = 900; //individual bar graph width
const CHART_HEIGHT = GRAPH_HEIGHT + PADDING_TOP + PADDING_BOTTOM; //scatterplot graph + x-axis
const CHART_WIDTH = GRAPH_WIDTH + PADDING_LEFT + PADDING_RIGHT; //scatterplot graph + y-axis
const CIRCLE_RADIUS = 6; //scatterplot circle radius

$('document').ready(function() {

  const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
  $.getJSON(url, function(data){ //get data from webpage and perform actions once it's loaded
    console.log(data);
    
    let fastestSeconds = data[0]["Seconds"];//fastest time in given data

    d3.select("h2") //title for chart
      .text("Doping in Professional Bicycle Racing");
    
    d3.select("h3") //sub-title for chart
      .text("35 Fastest times up Alpe d'Huez");
    
    d3.select("p") //title comment for chart
      .text("Normalized to 13.8km distance");
    
    var timeFormat = d3.timeFormat("%M:%S");
    
    let test = new Date("2000-01-01T00:"+"23:30" + "Z")
    console.log(d3.max(data,(d)=>new Date("2000-01-01T00:" + d["Time"] + "Z")));
    console.log("seconds", test.seconds);
    
    var xScale = d3.scaleTime() //x-axis is scaled based on time from first date to last date in data and takes up the width of the graph
      .domain([new Date(d3.min(data,(d)=>d["Year"]-1).toString()), //-1 to give cushion
               new Date(d3.max(data,(d)=>d["Year"]+1).toString())]) //+1 to gie cushion
      .range([0, GRAPH_WIDTH]);
    
    var xAxis = d3.axisBottom() //ticks and values are shown below line
      .scale(xScale)
      
    var yScale = d3.scaleTime() //y-axis is scaled based on amount from 1 to number of data points and takes up the height of the graph
      .domain([new Date("2000-01-01T00:" + data[0]["Time"] + "Z"),                                
               new Date("2000-01-01T00:" + data[data.length-1]["Time"] + "Z")]) 
      .range([0, GRAPH_HEIGHT])
    
    var yAxis = d3.axisLeft() //ticks and values are shown left of line
      .scale(yScale)
      .tickFormat(timeFormat);

    var tooltip = d3.select("#chart") //for tooltip
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0); //start as invisible
    
    var chart = d3.select("#chart")
      .append("svg")
      .attr("width", CHART_WIDTH)
      .attr("height",CHART_HEIGHT)
    
    chart.selectAll(".circle")
      .data(data)
      .enter()
      .append("circle") //add circles to symbolize scatterplots 
      .attr("class", "dot")
      .attr("data-xvalue", (d)=>d["Year"])
      .attr("data-yvalue", (d)=>new Date("2000-01-01T00:" + d["Time"] + "Z"))
      .attr("fill", (d)=> {
        if(d["Doping"] == ""){ //if Doping prop is empty, make circle purple, else make circle darkred
          return "blue"
        }
        else{
          return "red";
        }
      })
      .attr("stroke", "black")
      .attr("cx", (d)=> xScale(new Date(d["Year"].toString())) + PADDING_LEFT) //use scale and offset by x-axis
      .attr("cy", (d)=> yScale(new Date("2000-01-01T00:" + d["Time"] + "Z")) + PADDING_TOP) //use scale and offset by y-axis
      .attr("r", (d)=> CIRCLE_RADIUS)
      .on("mouseover", function(d) {//on mouseover populate div, position it, and make it visible
      tooltip.transition() //fade in
        .duration(100) //100 milliseconds
        .attr("data-year", d["Year"])
        .style("opacity", 0.8); //make mostly visible, but somewhat see-through
      tooltip.html("<span>" + d["Name"] + ": " + d["Nationality"] + "</span><br>" + //populate div
               "<span>Year: " + d["Year"] + ", Time: " + d["Time"] + "</span><br>" +
               "<span>" + d["Doping"] + "</span>")
      .style("left", (d3.event.pageX - ($('.tooltip').width()/2)) + "px") //center div horizontally with the circle that was hovered
       .style("top", (d3.event.pageY - 75) + "px"); //position div slightly above circle hovered
    })
    .on("mouseout", function(d) { //on mouseout, hide div
      tooltip.transition()// fade out
        .duration(200)
        .style("opacity", 0); //make invisible
    });
    
     chart.selectAll(".text") //circle labels to show rider name
      .data(data)
      .enter()
      .append("text") //add text to the right of each circle
      .attr("x", (d)=> xScale(d["Seconds"]-fastestSeconds) + PADDING_LEFT + CIRCLE_RADIUS + 2) //same as circle with 2px additional buffer
      .attr("y", (d)=> yScale(d["Place"]) + PADDING_TOP + CIRCLE_RADIUS - 2) //same as cricle with 2px additional buffer
      .text((d)=> d["Name"])
      .style("font-size", 13);
    
    chart.append("circle") //part of legend
      .attr("fill", "blue")
      .attr("cx", GRAPH_WIDTH - 100)
      .attr("cy", GRAPH_HEIGHT - 250)
      .attr("r", (d)=> CIRCLE_RADIUS)
    
    chart.append("circle") //part of legend
      .attr("fill", "red")
      .attr("cx", GRAPH_WIDTH - 100)
      .attr("cy", GRAPH_HEIGHT - 225)
      .attr("r", (d)=> CIRCLE_RADIUS)
    
    chart.append("text") //part of legend
      .attr("id", "legend")
      .attr("x", GRAPH_WIDTH - 100 + CIRCLE_RADIUS + 2)
      .attr("y", GRAPH_HEIGHT - 250 + 4)
      .text("No doping allegations")
      .style("font-size", 13);
    
    chart.append("text") //part of legend
      .attr("x", GRAPH_WIDTH - 100 + CIRCLE_RADIUS + 2)
      .attr("y", GRAPH_HEIGHT - 225 + 4)
      .text("Riders with doping allegations")
      .style("font-size", 13);
    
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
      .attr("transform", "rotate(-90)") //rotate so it's oriented/facing how it is
      .attr("y", 17 + PADDING_LEFT) // 17 = font-size + 1
      .attr("x", -PADDING_TOP) //x and y are switched for some reason
      .style("text-anchor", "end") //makes x,y point positioned at end of text
      .text("Time in Minutes")
      .style("font-size", 16);
    
    chart.append("text") //label for the x-axis
      .attr("y", PADDING_TOP + GRAPH_HEIGHT - 3) // 17 = font-size + 3 was guess and check
      .attr("x", PADDING_LEFT + (GRAPH_WIDTH))
      .style("text-anchor", "end") //makes x,y point positioned at end of text
      .text("Year")
      .style("font-size", 16);
  });
});