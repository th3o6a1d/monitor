import * as d3 from "d3";

class D3ECG {

    constructor(ref,options) {

        /* wave options:
        1. sinus, afib, svt, vtach, vfib, cap, oximetry
        2. rate
        */

        this.h = 200
        this.w = 1000
        this.ref = ref
        this.options = options
        this.segmentDuration = 5000
        this.data_cursor = []

        this.params = {
            p: { duration: () => 12, fx: (x) => 2 * Math.pow(x, 3) * (1-x) },
            pq: { duration: () => 2, fx: (x) => 0 },
            q: { duration: () => 2, fx: (x) => -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1 },
            r: { duration: () => 6, fx: (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1},
            s: { duration: () => 3, fx: (x) =>  -1 * Math.pow(1.5, Math.sin(x, Math.PI)) + 1},
            st: { duration: () => 12, fx: (x) =>  0},
            t: { duration: () => 12, fx: (x) =>  5 * Math.pow(x, 2) * (1-x)},
            tp: { duration: () => 60, fx: (x) =>  0},
            z: {duration: ()=> 0, fx: (x) => 0}
        };

        this.rate = () => {
            var beatDurationPerSegment = Object.values(this.params).reduce((acc,i) => acc + i.duration(),0.0) / 500
            var beatDuration = beatDurationPerSegment * (this.segmentDuration/1000)
            var bpm = Math.floor(60 / beatDuration)
            return bpm
        }

    }

    fillDataCursor(){
        while (this.data_cursor.length < 1100) {
            this.generateWave().map((i) => this.data_cursor.push(i))
        }
    }

    drawBottomPanel(){    

        var svg = d3.select(".bottom-panel")
            svg.selectAll("text").remove()
            svg.append("text")
            .attr("x",10)
            .attr("y",25)
            .text("test")
            .attr("class","hr")
    }


    drawSidePanel(){    

        var svg = d3.select("." + this.ref + "_side")
            svg.selectAll("text").remove()
            svg.append("text")
            .attr("x",10)
            .attr("y",25)
            .text(this.rate)
            .attr("class","hr")
    }

    drawECG(ref){

        var svg = d3.select(ref)
        var x = d3.scaleLinear().domain([0, 500]).range([0, this.w]);
        var y = d3.scaleLinear().domain([-5, 10]).range([this.h,0]);

        var line = d3.line()
            .x(function(d,i) {return x(i);})
            .y(function(d) {return y(d);})
            .curve(d3.curveNatural)

        let repeat = (going) => {

            this.drawSidePanel()
            this.fillDataCursor()
            var coming_data = this.data_cursor.slice(0,500)
            var going_data = this.data_cursor.slice(500,1000)
            this.data_cursor = this.data_cursor.slice(1000,this.data_cursor.length)

            var coming = svg.append("path")
            .attr("d", line(coming_data))
            var cl = coming.node().getTotalLength()

            coming
                .attr("class","coming")
                .attr("stroke-dasharray", cl)
                .attr("stroke-dashoffset", cl)
                .transition()
                .duration(this.segmentDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)

            if(going){
                var going = going
            } else {
                var going = svg.append("path")
                .attr("d", line(going_data))               
            }

            var gl = going.node().getTotalLength()

            going
                .attr("class", "going")
                .attr("stroke-dasharray",  gl)
                .attr("stroke-dashoffset", gl * 2)
                .transition()
                .duration(this.segmentDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", gl)
                .on("end",function(){
                    svg.select(".going").remove()
                    coming.attr("class","going")
                    repeat(coming)
                })
        }
        repeat()
    }

    generateWave() {

            switch(this.options.wave){

                case "sinus":
                    this.params.tp.duration = () => this.options.rate
                    break
                case "afib":
                    this.params.tp.duration = () => Math.random() * this.options.rate
                    break
                case "cap":
                    Object.values(this.params).map((i) => i.duration = () => 0)
                    this.params.z.duration = () => 100
                    this.params.z.fx = (x) => 2*Math.sin(2 * Math.PI * x)
                    break
            }

            var p_y = d3.range(0,1,1/this.params.p.duration()).map(this.params.p.fx);
            var pq_y = d3.range(0,1,1/this.params.pq.duration()).map(this.params.pq.fx);
            var q_y = d3.range(0,1,1/this.params.q.duration()).map(this.params.q.fx);
            var r_y = d3.range(0,1,1/this.params.r.duration()).map(this.params.r.fx);
            var s_y = d3.range(0,1,1/this.params.s.duration()).map(this.params.s.fx);
            var st_y = d3.range(0,1,1/this.params.st.duration()).map(this.params.st.fx);
            var t_y = d3.range(0,1,1/this.params.t.duration()).map(this.params.t.fx);
            var tp_y = d3.range(0,1,1/this.params.tp.duration()).map(this.params.tp.fx);
            var z_y = d3.range(0,1,1/this.params.z.duration()).map(this.params.z.fx);
            var y = [p_y, pq_y, q_y, r_y, s_y, st_y, t_y, tp_y, z_y].reduce((a, b) => a.concat(b), []);
            return y

    }

}



export default D3ECG