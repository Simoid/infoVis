/*
var dataset = [100,200,300,50,30,40,10,500];
var svgWidth = 1000;
var svgHeight = 600;
var barpadding = 5;
var barWidth = (svgWidth / dataset.length);
*/
var svgWidth = 25;
var svgHeight = 25;
var svgRadius = 10;
var svgColor = "#009933";
var graphWidth = 900;
var graphHeight = 500;
const MAX_TOTAL = 110;
const MAX_COMPSCI = 30;
const MAX_ART = 10;
const MAX_MATH = 20;
const MAX_TEAM = 20;
const MAX_INTERACION = 30;

var radarWidth = 500;
var radarHeight = 500;

var selectedUser = null;

var maxArray = [];
maxArray["CompSci"] = MAX_COMPSCI;
maxArray["Art"] = MAX_ART;
maxArray["Math"] = MAX_MATH;
maxArray["Team"] = MAX_TEAM;
maxArray["Interaction"] = MAX_INTERACION;

var horizontalMult = graphWidth/MAX_TOTAL;
var verticalMult = graphHeight/MAX_COMPSCI;
var selectedCategory = "CompSci";
var currentMax = MAX_COMPSCI;
var y_offset = 40 + graphHeight;
var x_scale;
var y_scale;
var x_axis;
var y_axis;
//var svg = d3.select('svg').attr('width', svgWidth).attr('height', svgHeight);

//select the graph svg
var graph = d3.select('.graph-svg').attr('width', graphWidth+100).attr('height', graphHeight+100);
var bigData;

init();
console.log();
update_data(selectedCategory);

/*
var barChart = svg.selectAll('rect').data(dataset).enter().append('rect')
    .attr('fill', 'grey')
    .attr('y',function(d) { return svgHeight - d;})
    .attr('height', function(d) { return d;})
    .attr('width', barWidth - barpadding)
    .attr('transform', function (d,i) {
        var translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
    });

var texts = svg.selectAll("text")
    .data(bigData)
    .enter()
    .append("text")
    .text(function(d) {return d;})
    .attr("y", function(d,i) {
        return svgHeight - d - 2;
    })
    .attr("x", function(_, i){
        return barWidth*i;
    })
    .attr("fill", "red");
*/
function init(){
  get_data();
  format_data(bigData);
  add_total_skills(bigData);
  console.log(selectedCategory);
  selectedUser = bigData[0];
  console.log(bigData[0]);

  d3.select('.radar-svg').attr('height', radarHeight).attr('width', radarWidth);


  x_scale = d3.scaleLinear().domain([0,MAX_TOTAL]).range([0,graphWidth]);
  y_scale = d3.scaleLinear().domain([currentMax,0]).range([0,graphHeight]);
  x_axis = d3.axisBottom().ticks(currentMax).scale(x_scale);
  y_axis = d3.axisLeft().ticks(MAX_TOTAL/11).scale(y_scale);
  graph.append('g').attr('class','x-axis').attr('transform','translate(50,' + y_offset + ')').call(x_axis);
  graph.append('g').attr('class', 'y-axis').attr('transform','translate(50,10)').call(y_axis);
  graph.append('text').text('Total skillpoints').attr('x',graphWidth- 20).attr('y',graphHeight+80);

  graph.append("g")			
  .attr("class", "grid-lines-x")
  .attr("transform", "translate(50," + y_offset + ")")
  .call(make_x_gridlines()
      .tickSize(-graphHeight)
      .tickFormat("")
  )

  // add the Y gridlines
  graph.append("g")			
    .attr("class", "grid-lines-y")
    .attr("transform", "translate(50, "+ 40+")")
    .call(make_y_gridlines()
        .tickSize(-graphWidth)
        .tickFormat("")
    )

  var dataSkills = graph.selectAll('circle').data(bigData).enter().append('g').attr('class','circle-g').append('circle')
    .attr('r', svgRadius)
    .attr('fill', svgColor)
    .attr('id', function(d,i){
      return i;
    })
    .attr('cx', function(d){
      return d.Total * horizontalMult;
    })
    .attr('cy', function(d){
      console.log(d[selectedCategory]);
      return graphHeight + 10 - d[selectedCategory] * verticalMult;
    })
    .on("mouseover",handleMouseOver)
    .on('mouseout',handleMouseOut)
    .on('click', handleGraphClick);

    drawRadar();
    
}

function drawRadar(){

  var stringList = ["Total", "Teamwork", "Art", "Computer Science", "Interaction", "Mathematics"];

  for(var i = 0; i < 6; i++){
    var newX = Math.cos(i*2*Math.PI/6 - Math.PI/2)* radarWidth/2.5 + radarWidth/2; 
    var newY = Math.sin(i*2*Math.PI/6 - Math.PI/2)*radarWidth/2.5 + radarHeight/2;
    d3.select(".radar-svg").append('line')
    .attr('x2', newX)
    .attr('y2', newY)
    .attr('x1',radarWidth/2)
    .attr('y1',radarHeight/2)
    .attr('stroke','black')
    .attr('stroke-width', 2)
    .attr('opacity', 1); 

    d3.select(".radar-svg").append('text').text(stringList[i]).attr('class','radar-text')
    .attr('z-index',-100)
    .attr('y', newY)
    .attr('x', newX);
  }

  updateRadar();
}

function updateRadar(){
  if(selectedUser == null){
    return;
  }
  var compSciRatio = selectedUser.CompSci/MAX_COMPSCI;
  var artRatio = selectedUser.Art/MAX_ART;
  var teamRatio = selectedUser.Team/MAX_TEAM;
  var interactionRatio = selectedUser.Interaction/MAX_INTERACION;
  var mathRatio = selectedUser.Math/MAX_MATH;
  var totalRatio = selectedUser.Total/MAX_TOTAL;
  var scores = [totalRatio,teamRatio,artRatio,compSciRatio,interactionRatio,mathRatio];

  var polygonString = "";

  d3.select('.radar-svg').append('polygon').attr('class','scorePolygon');
  
  for(var i = 0; i < 6; i++){
    polygonString = polygonString + " " +(Math.cos(i*2*Math.PI/6 - Math.PI/2) * radarWidth/2.5*scores[i] + radarWidth/2)+ "," + (Math.sin(i*2*Math.PI/6 - Math.PI/2)*radarWidth/2.5*scores[i] + radarHeight/2);
  }


  d3.select(".scorePolygon").transition().delay(50).attr('points',polygonString).attr('opacity', 0.5).attr('fill','orange').attr('stroke','red');

  console.log(scores);
}

function handleGraphClick(d,i){
  selectedUser = d;
  d3.select(".selected-name").text(d.Name);
  d3.select(".major").text(d.Major);
  d3.select(".degree").text(d.Degree);
  d3.select(".hobbies").text(d.Hobbies);
  d3.select(".expectations").text(d.Expectations);
  updateRadar();
  return;
}

function get_data(){
  return $.ajax({
    url:"data_format.json",
    dataType:"json",
    async: false,
    success: function(json){
      bigData = json;
    }
  });
}

function update_data(selectedCategory){
  console.log(selectedCategory);
  verticalMult = graphHeight/maxArray[selectedCategory];
  y_scale = d3.scaleLinear().domain([maxArray[selectedCategory],0]).range([0,graphHeight]);
  y_axis = d3.axisLeft().ticks(maxArray[selectedCategory]/2).scale(y_scale);
  graph.select('.y-axis').attr('transform','translate(50,40)').call(y_axis);

  graph.select(".grid-lines")				
  .attr("transform", "translate(50," + y_offset + ")")
  .call(make_x_gridlines()
      .tickSize(-graphHeight)
      .tickFormat("")
  )

  // add the Y gridlines
  graph.select(".grid-lines-y")			
    .attr("transform", "translate(50, "+ 40+")")
    .call(make_y_gridlines()
        .tickSize(-graphWidth)
        .tickFormat("")
    )

  var dataSkills = graph.selectAll('circle')
    .transition()
    .attr('delay',function(d){
      return 100*d[selectedCategory]
    })
    .attr('r', svgRadius)
    .attr('fill', svgColor)
    .attr('cx', function(d){
      return d.Total * horizontalMult;
    })
    .attr('cy', function(d){
      console.log(d[selectedCategory]);
      return y_offset - d[selectedCategory] * verticalMult;
    });

      // add the X gridlines
      updateRadar();
}

function make_x_gridlines() {		
  return d3.axisBottom(x_scale);
}

// gridlines in y axis function
function make_y_gridlines() {		
  return d3.axisLeft(y_scale);
}

function handleMouseOver(d,i){
  var id = d3.select(this).attr('id');
  
  d3.select(this).attr('fill','orange').attr('r',svgRadius*1.5);
 
  var box_width = bigData[id].Name.length*11;
  d3.select(this.parentNode.parentNode).append('rect')
    .attr('class','text-box')
    .attr('width',box_width)
    .attr('height',20)
    .attr('fill',"white")
    .attr('fill-opacity', 0.8)
    .attr('y',d3.select(this).attr('cy')-35)
    .attr('x',d3.select(this).attr('cx')-box_width/2);
    
  d3.select(this.parentNode.parentNode).append('text').text(bigData[id].Name).attr('class','graph-text')
    .attr('z-index',-100)
    .attr('y',d3.select(this).attr('cy')-20)
    .attr('x', d3.select(this).attr('cx') - 10 - bigData[id].Name.length*3);
}

function handleMouseOut(d,i){
  d3.select(this).attr('fill',svgColor).attr('r',svgRadius);
  d3.select(this.parentNode.parentNode).select('.text-box').remove();
  d3.select(this.parentNode.parentNode).select('.graph-text').remove();
}

function format_data(data){
  for(i = 0; i < data.length; i++){
    data[i].CompSci = data[i].ProgSkills + data[i].GraphicsSkills + data[i].RepoSkills;
    data[i].Art = data[i].ArtSkills;
    data[i].Math = data[i].MathSkills + data[i].StatSkills;
    data[i].Team = data[i].CommSkills + data[i].CollabSkills;
    data[i].Interaction = data[i].InfoVisSkills + data[i].HCISkills + data[i].UXSkills;
    data[i].Total = data[i].CompSci + data[i].Art + data[i].Math + data[i].Team + data[i].Interaction;
  }
  return;
}

function add_total_skills(data){
  return;
}
