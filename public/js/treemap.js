import '../css/treemap.scss';
import $ from 'jquery';
import * as d3 from 'd3';

const URL_KICKSTARTER = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const URL_MOVIES = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const URL_GAMES = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

const OPTIONS = {
  KICKSTARTER: {
    URL: URL_KICKSTARTER,
    TITLE: "Kickstarter Pledges",
    DESCRIPTION: "Top 100 Most Pledged Kickstarter Campaings Grouped By Category"
  },
  MOVIES: {
    URL: URL_MOVIES,
    TITLE: "Movie Sales",
    DESCRIPTION: "Top 100 Highest Grossing Movies Grouped By Genre"
  },
  GAMES: {
    URL: URL_GAMES,
    TITLE: "Video Game Sales",
    DESCRIPTION: "Top 100 Most Sold Video Games Grouped by Platform"
  }
}

const PADDING_BOTTOM = 300;
const CHART_HEIGHT = 1000;
const CHART_WIDTH = 1250;

const COLORS = ["rgb(31, 119, 180)", "rgb(174, 199, 232)", "rgb(255, 127, 14)", "rgb(255, 187, 120)",
                "rgb(44, 160, 44)", "rgb(152, 223, 138)", "rgb(214, 39, 40)", "rgb(255, 152, 150)",
                "rgb(148, 103, 189)", "rgb(197, 176, 213)", "rgb(140, 86, 75)", "rgb(196, 156, 148)",
                "rgb(227, 119, 194)", "rgb(247, 182, 210)", "rgb(127, 127, 127)", "rgb(199, 199, 199)",
                "rgb(188, 189, 34)", "rgb(219, 219, 141)", "rgb(23, 190, 207)", "rgb(158, 218, 229)"];

const FORMAT  = d3.format(",d");

var urlParams = new URLSearchParams(window.location.search);
const DEFAULT_DATASET = "MOVIES"
var option = OPTIONS[urlParams.get('option') || DEFAULT_DATASET];
console.log("option", option);

var chart = d3.select("#chart")
  .append("svg")
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT)

var tooltip = d3.select("#chart") //tooltip
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "tooltip")
  .style("opacity", 0); //start invisible

var treemap = (data) => d3.treemap()
    .tile(d3.treemapSquarify.ratio(1))
    .size([CHART_WIDTH, CHART_HEIGHT])
  (d3.hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value));

$.getJSON(option.URL, function(data){ //get data from webpage and perform actions once it's loaded
  d3.select("#title").text(option.TITLE);
  d3.select("#description").text(option.DESCRIPTION);
  
  var colorScale = d3.scaleOrdinal(COLORS);
  
  const root = treemap(data);
  
  const leaf = chart.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
  leaf.append("rect")
    .attr("id", d => d.data.name)
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("fill", d => { while (d.depth > 1) d = d.parent; return colorScale(d.data.name); })
    .attr("fill-opacity", 0.6)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .on("mouseover", (d) =>{ //on mouseover, populate div, make visible
        let data = d.data;
        tooltip.transition() //fade in
          .duration(100)
          .attr("data-value", data.value)
          .style("opacity", 0.8); //make div slightly see-through
        tooltip.html("<span> <b>" + data.name + "</b><br>" + data.category + "<br><i>" + data.value + "<i><br></span>")
        .style("left", (d3.event.pageX - ($("#tooltip").width() / 2) + "px")) //x = same as rectange hovered - half of div width
        .style("top", (d3.event.pageY - 85) + "px"); //y = same as rect hovered - 65 so appears above rect hovered
      })
      .on("mouseout", function(d) { //on mouseout, hide tooltip div
      tooltip.transition() //fade out
        .duration(200)
        .style("opacity", 0);
      });
  
  leaf.append("text")
      //.attr("clip-path", d => "url(#"+d.data.name+")")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(FORMAT(d.value)))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("font-size", 12)
      .text(d => d);
  
  var legend = d3.select("#chart")
  .append("svg")
  .attr("id", "legend")
  .attr("height", 30)
  .attr("width", 1250)
  
  legend.selectAll(".rect")
      .data(data.children)
      .enter()
      .append("rect") //add rectangles to symbolize bars in the bar graph
      .attr("class", "legend-item")
      .attr("width", 15)
      .attr("height", 15)
      .attr("y", (d,i) => Math.floor(i/7)*25 + 5)
      .attr("x", (d,i) => i%7 * 180)
      .attr("fill", d => colorScale(d.name))
  
  legend.selectAll(".text")
      .data(data.children)
      .enter()
      .append("text") //add rectangles to symbolize bars in the bar graph
      .attr("class", "legend-text")
      .attr("font-size", 15)
      .attr("y", (d,i) => Math.floor(i/7)*25 + 18)
      .attr("x", (d,i) => i%7 * 180 + 20)
      .text(d => d.name)
 });
