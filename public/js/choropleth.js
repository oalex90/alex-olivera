import '../css/choropleth.scss';
import $ from 'jquery';
import * as topojson from "topojson-client";
import * as d3 from 'd3';

const URL_DATA = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'; //contains state, county, and bachlors or higher data
const URL_COUNTY = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'; //contains info for drawing country and county figures

const CHART_HEIGHT = 625; // guess and check 
const CHART_WIDTH = 950; // guess and check

const REDS = d3.schemeReds[9]; //array of 9 array colors from light to dark

var path = d3.geoPath();//needed to draw map

var chart = d3.select("#chart") //main svg component
  .append("svg")
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT);

var tooltip = d3.select("#chart") //tooltip
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0); //start invisible

let urls = [URL_DATA, URL_COUNTY];
let promises = [];

urls.forEach(function(url) {
  promises.push(d3.json(url)) //does json calls for each url in array
});

Promise.all(promises).then(function(values) { //once all json calls are finished, peform this function...
  const data = values[0]; //first element is data returned from first url json call
  const us = values[1]; //seceond element is data reutrned from second url json call
  console.log("data", data);
  console.log("us", us);

  var colorScale = d3.scaleQuantile() //scale to determine color based on variance
    .domain(d3.extent(data, (d)=>d.bachelorsOrHigher)) //extent used instead of using min() and max() [same thing]
    .range(REDS); // 9 colors in colors array
  
  chart.append("g") //draw shapes for individual counties
    .attr("class", "counties")
    .selectAll("path") //used to draw map
    .data(topojson.feature(us, us.objects.counties).features) //again, used to draw map
    .enter()
    .append("path") //used to draw map
      .attr("class", "county")
      .attr("data-fips", (d)=> d.id)
      .attr("data-education", (d)=> {
        let matches = data.filter((val)=> d.id == val.fips); //since we have to url data objects, need to match the two by their id/fips values
        if(matches[0]){
          return matches[0].bachelorsOrHigher;
        }
      })
      .attr("fill", (d)=> {
        let matches = data.filter((val)=> d.id == val.fips);//since we have to url data objects, need to match the two by their id/fips values
        if(matches[0]){
          return colorScale(matches[0].bachelorsOrHigher); //use colorScale to determine color
        } else{
          return "grey"; //if not match foind, turn color to grey
        }
      })
      .attr("d", path)
      .on("mouseover", (d) =>{ //on mouseover, populate div, make visible
        let match = data.filter((val)=> d.id == val.fips)[0];
        tooltip.transition() //fade in
          .duration(100)
          .attr("data-education", match.bachelorsOrHigher)
          .style("opacity", 0.8); //make div slightly see-through
        tooltip.html("<span>" + match.area_name + ", " + match.state + ": <b>" + match.bachelorsOrHigher + "%</b></span>")
        .style("left", (d3.event.pageX - ($("#tooltip").width() / 2) + "px")) //x = same as rectange hovered - half of div width
        .style("top", (d3.event.pageY - 65) + "px"); //y = same as rect hovered - 65 so appears above rect hovered
      })
      .on("mouseout", function(d) { //on mouseout, hide tooltip div
      tooltip.transition() //fade out
        .duration(200)
        .style("opacity", 0);
      });
      
  chart.append("path") //draw shapes for individual states
      .datum(topojson.mesh(us, us.objects.states))
      .attr("class", "states")
      .attr("d", path)
  
  var legend = (g) => { 
    const x = d3.scaleLinear()
        .domain([2.6, 75.1])
        .rangeRound([0, 240]);

    g.selectAll("rect")
      .data(colorScale.range().map(d => colorScale.invertExtent(d)))
      .join("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("fill", d => colorScale(d[0]));

    g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat((d)=> Math.round(d) + "%" ) //round value and add % at end
      .tickValues(colorScale.quantiles())) //tick values should be each colorSqual cutoff (quantile)
      .select(".domain")
        .remove();
  }
  
  chart.append("g")
      .attr("id", "legend")
      .attr("transform", "translate(600,40)")
      .call(legend);
      
});
 