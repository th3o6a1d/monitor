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

    drawECG(ref){
        this.generatePQRSTWave()

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
        .attr("class","coming")

    }


    oximetry() {

        while (this.data_cursor.length < 1000) {
            this.norm_array.map((x) => this.data_cursor.push(Math.sin(x)))
        }

    }

    vfib(){
        return d3.range(1000).map(function(x){return -3*Math.pow(9, Math.sin(8*x, Math.PI)) - 1 + Math.random()*10});
    }

    generatePQRSTWave() {
        var p = (x) => 2 * Math.pow(x, 3) * (1-x);
        var q = (x) =>  -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1;
        var r = (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1;
        var s = (x) =>  -1 * Math.pow(1.5, Math.sin(x, Math.PI)) + 1;
        var t = (x) =>  5 * Math.pow(x, 2) * (1-x);
        var zero_segment = (x) =>  0;

        var p_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.p).map(p);
        var pq_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.pq).map(zero_segment);
        var q_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.q).map(q);
        var r_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.r).map(r);
        var s_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.s).map(s);
        var st_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.st).map(zero_segment);
        var t_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.t).map(t);
        var tp_y = d3.range(0,1,1/this.PQRST_WAVE_WIDTH_RATIOS.tp).map(zero_segment);

        var y = [p_y, pq_y, q_y, r_y, s_y, st_y, t_y, tp_y].reduce((a, b) => a.concat(b), []);

        while (this.data_cursor.length < 1000) {
             y.map((i) => this.data_cursor.push(i))
        }

    }

    extObjectValues(obj) {
        if (typeof obj.values === 'undefined') {
            return Object.keys(obj).map(key => obj[key])
        }
        
        return obj.values();
    }
}



export default D3ECG