const PADDING_LEFT = 52; //needed to account for y-axis
const PADDING_RIGHT = 10; //needed to account for x-axis so last value isn't cut off (2015)
const PADDING_BOTTOM = 20; //neeeded to account for x-axis
const PADDING_TOP = 10; //needed to account for y-axis so last value isn't cut off (18,00)
const GRAPH_HEIGHT = 450; //individual bar graph height
const GRAPH_WIDTH = 900; //individual bar graph width
const CHART_HEIGHT = GRAPH_HEIGHT + PADDING_TOP + PADDING_BOTTOM; //bar graph + x-axis
const CHART_WIDTH = GRAPH_WIDTH + PADDING_LEFT + PADDING_RIGHT; //bar graph + y-axis

$('document').ready(function() {

  const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  $.getJSON(url, function(output){ //get data from webpage and perform actions once it's loaded
    let data = output.data; //contains all the info we need for the chart

    d3.select("h2") //title for chart
      .text("Gross Domestic Product");
    
    var xScale = d3.scaleTime() //x-axis is scaled based on time from first date to last date in data and takes up the width of the graph
      .domain([new Date(data[0][0]), new Date(data[data.length-1][0])])
      .range([0, GRAPH_WIDTH]);
    
    var xAxis = d3.axisBottom() //ticks and values are shown below line
      .scale(xScale)

    var yScale = d3.scaleLinear() //y-axis is scaled based on amount from 0 to max value in data and takes up the height of the graph
      .domain([d3.max(data, (d)=>d[1]), 0]) //go high to low since y=0 is considered the very top
      .range([0, GRAPH_HEIGHT]);
    
    var yAxis = d3.axisLeft() //ticks and values are shown left of line
      .scale(yScale)
    
    var chart = d3.select("svg")
      .attr("width", CHART_WIDTH)
      .attr("height",CHART_HEIGHT)
    
    var tooltip = d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("top", "250px")
      .style("left", "250px")
      .style("opacity", 0);
    
    chart.selectAll(".rect")
      .data(data)
      .enter()
      .append("rect") //add rectangles to symbolize bars in the bar graph
      .attr("class", "bar")
      .attr("data-date", (d)=>d[0])
      .attr("data-gdp", (d)=>d[1])
      .attr("x", (d)=> xScale(new Date(d[0])) + PADDING_LEFT) //use scale and offset by x-axis
      .attr("y", (d)=> yScale(d[1]) + PADDING_TOP) //use scale and offset by y-axis
      .attr("height", (d)=> GRAPH_HEIGHT - yScale(d[1])) //since going top to bottm need to start with graph height and deduct the yscale value
      .attr("width", (GRAPH_WIDTH/data.length)-1) // minus 1 to make gap between each bar
      .on("mouseover", (d)=>{
        console.log("mouseover");
        let amount = d3.format("$,.2f")(d[1]); //convert amount to currency format
        console.log("date", d[0]);
        let curDate = d[0];
        let year = curDate.slice(0,4);
        console.log("year", year);
        let month = curDate.slice(5,7);
        switch (parseInt(month)){
          case 1:
            month = "January";
            break;
          case 2:
            month = "February";
            break;
          case 3:
            month = "March";
            break;
          case 4:
            month = "April";
            break;
          case 5:
            month = "May";
            break;
          case 6:
            month = "June";
            break;
          case 7:
            month = "July";
            break;
          case 8:
            month = "August";
            break;
          case 9:
            month = "September";
            break;
          case 10:
            month = "October";
            break;
          case 11:
            month = "November";
            break;
          case 12:
            month = "December";
            break;            
          }
      console.log("month", month);
        let str = amount + " Billion" + "<br>" + month + ", " + year;
        tooltip
          .style("opacity", 1)
          .attr("data-date", d[0])
          .html(str)
      })
      .on("mouseout", (d)=>{
        tooltip.style("opacity", 0)
      });
    
    
        /*-easier method, but didn't pass test cases
        .append("title") //tool tip
        .attr("data-date", (d)=>d[0])
        .attr("id", "tooltip")
        .style("font-size", 15)
        .text((d)=> {
          let amount = d3.format("$,.2f")(d[1]); //convert amount to currency format
          let curDate = new Date(d[0]);
          let year = curDate.getFullYear();
          let month;
          switch (curDate.getMonth()){
            case 0:
              month = "Janurary";
              break;
            case 1:
              month = "February";
              break;
            case 2:
              month = "March";
              break;
            case 3:
              month = "April";
              break;
            case 4:
              month = "May";
              break;
            case 5:
              month = "June";
              break;
            case 6:
              month = "July";
              break;
            case 7:
              month = "August";
              break;
            case 8:
              month = "September";
              break;
            case 9:
              month = "October";
              break;
            case 10:
              month = "November";
              break;
            case 11:
              month = "December";
              break;            
          }
          return amount + " Billion" + "\n" + month + ", " + year;
      });
    */
    
    chart.append("g") //append x-axis
      .attr("id", "x-axis")
      .attr("class", "axis")
      .call(xAxis)
      .attr("transform", //slide right and down to show just below graph
            "translate(" + (PADDING_LEFT) + "," + (GRAPH_HEIGHT + PADDING_TOP) +")")

    chart.append("g") //append y-axis
      .attr("id", "y-axis")
      .attr("class", "axis")
      .call(yAxis)
      .attr("transform", //slide right and down to show just left of graph
            "translate(" + PADDING_LEFT + "," + PADDING_TOP + ")")
      
    chart.append("text") //label for the y-axis
      .attr("transform", "rotate(-90)") //rotate so it's oriented/facing how it is
      .attr("y", 17 + PADDING_LEFT) // 17 = font-size + 1 
      .attr("x", -PADDING_TOP) //x and y are flipped because of rotation, I believe
      .style("text-anchor", "end") //makes align to end of y-axis
      .text("Gross Domestic Product, USA")
      .style("font-size", 16);
    
    d3.select("#body") //text below the graph
      .append("p")
      .text(output.description)
      .style("font-style", "italic");
  });
});