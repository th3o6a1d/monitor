import * as d3 from "d3";

class D3ECG {

    constructor(ref) {

        this.h = 300
        this.w = 1000
        this.ref = ref
        this.data_cursor = []
        this.norm_array = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
        this.PQRST_WAVE_WIDTH_RATIOS = {
            p: 12,
            pq: 2,
            q: 2,
            r: 6,
            s: 3,
            st: 2,
            t: 12,
            tp: 30
        };
    }

    generateWave(wave){
        while (this.data_cursor.length < 2000) {
            this.generatePQRSTWave().map((i) => this.data_cursor.push(i))
        }
    }

    drawECG(ref){

        this.generateWave()
        var svg = d3.select(ref)
        .append("svg")
        .attr("height", this.h)
        .attr("width", this.w)

        var x = d3.scaleLinear().domain([0, 1000]).range([0, this.w]);
        var y = d3.scaleLinear().domain([0, 10]).range([this.h-150,0]);

        var line = d3.line()
            .x(function(d,i) {return x(i);})
            .y(function(d) {
                console.log(y(d))
                return y(d);
            })
            .curve(d3.curveNatural)

        var coming = svg.append("path")
            .attr("d", line(this.data_cursor))

        var cl = coming.node().getTotalLength()
        
        coming
            .attr("class","coming")
            .attr("stroke-dasharray", cl)
            .attr("stroke-dashoffset", cl)
            .transition()
            .duration(10000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)

        var going = svg.append("path")
            .attr("d", line(this.data_cursor))

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
                coming.attr("class","going")
            })
    }


    oximetry() {
        return d3.range(0,1,0.1).map((x)=>Math.sin(x))
    }

    vfib(){
        return d3.range(0,1,0.1).map((x) =>-7*Math.pow(1.5, Math.sin(x, Math.PI)) + Math.random());
    }

    generatePQRSTWave() {
        var p = (x) => 2 * Math.pow(x, 3) * (1-x) + Math.random()/10;
        var q = (x) =>  -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1 + Math.random()/10;
        var r = (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1 + Math.random()/10;
        var s = (x) =>  -1 * Math.pow(1.5, Math.sin(x, Math.PI)) + 1 + Math.random()/10;
        var t = (x) =>  5 * Math.pow(x, 2) * (1-x) + Math.random()/10;
        var zero_segment = (x) =>  0. + Math.random()/10;

        var p_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.p).map(p);
        var pq_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.pq).map(zero_segment);
        var q_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.q).map(q);
        var r_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.r).map(r);
        var s_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.s).map(s);
        var st_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.st).map(zero_segment);
        var t_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.t).map(t);
        var tp_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.tp).map(zero_segment);

        var y = [p_y, pq_y, q_y, r_y, s_y, st_y, t_y, tp_y].reduce((a, b) => a.concat(b), []);
        return y
    }

    extObjectValues(obj) {
        if (typeof obj.values === 'undefined') {
            return Object.keys(obj).map(key => obj[key])
        }
        
        return obj.values();
    }
}



export default D3ECG