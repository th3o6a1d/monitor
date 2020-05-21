import * as d3 from "d3";

class D3ECG {
    constructor() {

        this.h = 300
        this.w = 1000
    }

    drawECG(ref){

        var h = this.h
        var w = this.w
        var _generateOximetry = this._generateOximetry

        var svg = d3.select(ref)
        .append("svg")
        .attr("height", h)
        .attr("width", w)

        var x = d3.scaleLinear().domain([0, 100]).range([0, w]);
        var y = d3.scaleLinear().domain([0, 100]).range([100, h]);

        var line = d3.line()
        .x(function(d,i) {return x(i);})
        .y(function(d) {return y(d);})
        .curve(d3.curveNatural)
        
        function repeat(going){
          
          var data = _generateOximetry()
          var data2 = _generateOximetry()

          var coming = svg.append("path")
          .attr("d", line(data))

          var cl = coming.node().getTotalLength()

          coming
          .attr("class","coming")
          .attr("stroke-dasharray", cl)
          .attr("stroke-dashoffset", cl)
          .transition()
          .duration(10000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)

          if(going){
            going = going
          } else {
            var going = svg.append("path")
            .attr("d", line(data2))
          }
          
          var gl = going.node().getTotalLength()

          going
          .attr("class", "going")
          .attr("stroke-dasharray",  gl)
          .attr("stroke-dashoffset", gl * 2)
          .transition()
          .duration(10000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", gl)
          .on("end", function(){
            d3.select(this).remove()
            coming.attr("class","going")
            repeat(coming)
          });

    };

  repeat();

}

_generateOximetry() {
    return d3.range(100).map(function(x){return 10*Math.sin(x) + 10*Math.random()})
}

_generatePQRSTWave() {

    var p = (x) => 2 * Math.pow(x, 3) * (1-x) + Math.random()/10;
    // Q mimics the -ve part of a sine wave
    var q = (x) =>  -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1 + Math.random()/10;
    // R mimics the +ve part of a skewed sine wave
    var r = (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1 + Math.random()/10;
    // S mimics the -ve part of a skewed sine wave
    var s = (x) =>  -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1 + Math.random()/10;
    // T mimics a beta distribution
    var t = (x) =>  5 * Math.pow(x, 2) * (1-x) + Math.random()/10;
    // pq, st, and tp segments mimic y=0
    var zero_segment = (x) => Math.random()/10;

    }
}
export default D3ECG