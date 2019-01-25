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
var y_offset = 20 + graphHeight;
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

  x_scale = d3.scaleLinear().domain([0,MAX_TOTAL]).range([0,graphWidth]);
  y_scale = d3.scaleLinear().domain([currentMax,0]).range([0,graphHeight]);
  x_axis = d3.axisBottom().ticks(currentMax).scale(x_scale);
  y_axis = d3.axisLeft().ticks(MAX_TOTAL/11).scale(y_scale);
  graph.append('g').attr('class','x-axis').attr('transform','translate(50,' + y_offset + ')').call(x_axis);
  graph.append('g').attr('class', 'y-axis').attr('transform','translate(50,10)').call(y_axis);


  var dataSkills = graph.selectAll('circle').data(bigData).enter().append('g').append('circle')
    .attr('r', svgRadius)
    .attr('fill', svgColor)
    .attr('cx', function(d){
      return d.Total * horizontalMult;
    })
    .attr('cy', function(d){
      console.log(d[selectedCategory]);
      return graphHeight + 10 - d[selectedCategory] * verticalMult;
    })
    .on("mouseover",handleMouseOver)
    .on('mouseout',handleMouseOut);
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
  graph.select('.y-axis').attr('transform','translate(50,20)').call(y_axis);

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
      return y_offset - d[selectedCategory] * verticalMult - 10;
    });
}

function handleMouseOver(d,i){
  d3.select(this).attr('fill','orange').attr('r',svgRadius*1.5);
  d3.select('.x-axis').append('text').text("ass").attr('fill','black');
}

function handleMouseOut(d,i){
  d3.select(this).attr('fill',svgColor).attr('r',svgRadius);
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
