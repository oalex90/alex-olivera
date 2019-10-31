const GRAPH_HEIGHT =800; //force directed graph height
const GRAPH_WIDTH = 900; //force directed graph width

$('document').ready(() => {
  
  const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
  console.log("url", url);
  
  $.getJSON(url, function(data){ //get data from webpage and perform actions once it's loaded
    console.log(data);
    
    d3.select("h2") //title for chart
      .text("Force Directed Graph of State Contiguity");

    var div = d3.select("#graph") //tooltip
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0); //start invisible

    //create force directed graph simulation
    var simulation = d3.forceSimulation(data.nodes) //add nodes
    .force("charge", d3.forceManyBody()) //create net force on nodes
    .force("link", d3.forceLink(data.links)) //add links
    .force("collision", d3.forceCollide(25)) // keep nodes from being ontop of each other
    .force("center", d3.forceCenter(GRAPH_WIDTH/2, GRAPH_HEIGHT/2)) //put center at center of graph

    simulation.force("charge").strength(10) //low net inner force on all nodes
    simulation.on('tick', ticked); //on each time increment place nodes and links based on force
    
    var chart = d3.select("#graph")
    .append("svg") //svg for the link lines
    .attr("width", GRAPH_WIDTH)
    .attr("height",GRAPH_HEIGHT)
    
    var link = chart.selectAll('.link') //create lines to represent links between nodes
		.data(data.links)
		.enter()
		.append('line')
		.attr('stroke', 'black')
    .attr('stroke-width', '1px');
    
    var node = d3.select("#flags") //create images to represent nodes as flags
    .selectAll('.node')
    .data(data.nodes)
    .enter()
    .append("img")
      .attr("class", "flag") //required to show flag 
      .attr("class", (d)=> "flag flag-" + d.code) //required to show flag for specific country
      .on("mouseover", function(d) { //on mouseover, populate div, make visible, and move to near corresponding image
          div.transition() //fade in
            .duration(100)
            .style("opacity", 0.8); //make div slightly see-through
          div.html("<span><b>" + d.country + "</b></span>")
          .style("left", (d3.event.pageX - ($('.tooltip').width()/2)-5) + "px") //x = same as rectange hovered - half of div width
          .style("top", (d3.event.pageY - 42) + "px"); //y = same as rect hovered - 75 so appears above rect hovered
      })
      .on("mouseout", function(d) { //on mouseout, hide tooltip div
        div.transition() //fade out
          .duration(200)
          .style("opacity", 0);
      })
    
    .call(d3.drag() //on node click and drag
          .on("start", dragstarted) //mouse-click-down
          .on("drag", dragged) //mouse-move
          .on("end", dragended)); //mouse-click-up
    
    
    function ticked(d) {
      node //move node based on position after force effects
        .style('left', (d) => (d.x-4) + "px") // -4 to compensate for the image width
        .style('top', (d) => (d.y-2) + "px"); // -2 to compensate for the image height

      link //move link based on positon after forec effects
        .attr('x1', (d) => d.source.x)
        .attr('x2', (d) => d.target.x)
        .attr('y1', (d) => d.source.y)
        .attr('y2', (d) => d.target.y);
      
    }
    
    function dragstarted(d) { //standard dragstarted
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) { //standard dragged
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) { //standard dragended
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  });
});