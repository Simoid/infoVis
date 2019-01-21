var dataset = [100,200,300,50,30,40,10,500];
var svgWidth = 1000;
var svgHeight = 600;
var barpadding = 5;
var barWidth = (svgWidth / dataset.length);

var svg = d3.select('svg').attr('width', svgWidth).attr('height', svgHeight);

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
    .data(dataset)
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