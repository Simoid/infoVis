/*
var dataset = [100,200,300,50,30,40,10,500];
var svgWidth = 1000;
var svgHeight = 600;
var barpadding = 5;
var barWidth = (svgWidth / dataset.length);
*/
var svgWidth = 50;
var svgHeight = 50;
var svgColor = "green";
var graphWidth = 900;
var graphHeight = 800;
const MAX_POINTS = 110;

//var svg = d3.select('svg').attr('width', svgWidth).attr('height', svgHeight);
//select the graph svg
var graph = d3.select('svg').attr('width', graphWidth).attr('height', graphHeight);

var bigData;

init();
console.log();

var dataSkills = d3.select('div').data(bigData).enter().append('p')
  .text(function(d){
    return d.Total;
  });

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
