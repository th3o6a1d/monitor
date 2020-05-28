import * as d3 from "d3";

class D3WAVE {

    constructor(options) {

        this.options = options
        this.h = 200
        this.w = 1000
        this.type = this.options.type
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
            tp: { duration: () => 50, fx: (x) =>  0},
            z: {duration: ()=> 0, fx: (x) => 0}
        };

        this.rate = () => {
            var beatDurationPerSegment = Object.values(this.params).reduce((acc,i) => acc + i.duration(),0.0) / 500
            var beatDuration = beatDurationPerSegment * (this.segmentDuration/1000)
            var bpm = Math.floor(60 / beatDuration)
            return bpm
        }

        this.o2 = () => {
            if (this.options.o2range) {
                var min = this.options.o2range[0] 
                var max = this.options.o2range[1]
                var range = max - min
                return Math.floor(min + range * Math.random())
            }
            return Math.floor(5 * Math.random() + 95)
        }

        setInterval(()=>this.updateSidePanel(),4000)

    }

    fillDataCursor(){
        while (this.data_cursor.length < 600) {
            this._generateWave().map((i) => this.data_cursor.push(i))
        }
    }


    updateSidePanel() {
        var txt = d3.select("." + this.options.type + "-side-text")
        switch(this.options.type){
            case "cardiac":
                txt.text(this.rate)
                break
            case "oximetry":
                txt.text(this.o2)
                break
            default:
                return
        }
    }

    drawSidePanel(){    
             var svg = d3.select(".side-panel")
                .append("svg")
                .attr("viewBox","0 0 50 40")

            svg.append("text")
                .attr("x",15)
                .attr("y",25)
                .text("--")
                .attr("class",() => this.options.type + "-side-text")

            svg.append("text")
                .attr("x",3)
                .attr("y",10)
                .text(() => {
                    switch(this.options.type){
                        case "cardiac":
                            return "ECG"
                        case "oximetry":
                            return "PLETH"
                        default: 
                            return "--"
                    }
                })
                .attr("class",() => this.options.type + "-legend-text")

    }

    drawTracing(){

        var svg = d3.select(".tracing-container")
            .append("svg")
            .attr("viewBox","0 0 1000 200")
            .attr("className","no-cpu tracing")
        
        var x = d3.scaleLinear().domain([0, 250]).range([30, this.w]);
        var y = d3.scaleLinear().domain([-2, 4]).range([this.h,0]);

        var line = d3.line()
            .x(function(d,i) {return x(i);})
            .y(function(d) {return y(d);})
            .curve(d3.curveNatural)

        let repeat = (went) => {

            this.fillDataCursor()
            var coming_data = this.data_cursor.slice(0,250)
            var going_data = this.data_cursor.slice(250,500)
            this.data_cursor = this.data_cursor.slice(500,this.data_cursor.length)

            var coming = svg.append("path")
                .attr("d", line(coming_data))

                var cl = coming.node().getTotalLength()

            coming
                .attr("class",this.options.type + " coming")
                .attr("stroke-dasharray", cl)
                .attr("stroke-dashoffset", cl)
                .transition()
                .duration(this.segmentDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)

            if (went) {
                var going = went
            } else {
                going = svg.append("path")
                .attr("d", line(going_data))   
                .attr("class",this.options.type + " going")    
            }

            var gl = going.node().getTotalLength()

            going        
                .attr("stroke-dasharray",  gl)
                .attr("stroke-dashoffset", gl * 2)
                .transition()
                .duration(this.segmentDuration)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", gl)
                .on("end",function(){
                    svg.select(".going").remove()
                    coming.classed("going",true)
                    coming.classed("coming",false)
                    repeat(coming)
                })
        }
        repeat()
    }

    _generateWave() {

            switch(this.options.wave){

                case "sinus":
                    this.params.tp.duration = () => this.options.rate + Math.floor(Math.random()*20)
                    break
                case "afib":
                    this.params.tp.duration = () => Math.random() * this.options.rate
                    break
                case "oximetry":
                    Object.values(this.params).map((i) => i.duration = () => 0)
                    this.params.z = { duration: () => 101, fx: (x) => -Math.sin(x*Math.PI*2)/2 - 2*Math.sin(12.5*x-Math.PI)/2 +1}
                    break
                default:
                    break
            }

            var p_y = d3.range(0,1,1/this.params.p.duration()*2).map(this.params.p.fx);
            var pq_y = d3.range(0,1,1/this.params.pq.duration()*2).map(this.params.pq.fx);
            var q_y = d3.range(0,1,1/this.params.q.duration()*2).map(this.params.q.fx);
            var r_y = d3.range(0,1,1/this.params.r.duration()*2).map(this.params.r.fx);
            var s_y = d3.range(0,1,1/this.params.s.duration()*2).map(this.params.s.fx);
            var st_y = d3.range(0,1,1/this.params.st.duration()*2).map(this.params.st.fx);
            var t_y = d3.range(0,1,1/this.params.t.duration()*2).map(this.params.t.fx);
            var tp_y = d3.range(0,1,1/this.params.tp.duration()*2).map(this.params.tp.fx);
            var z_y = d3.range(0,1,1/this.params.z.duration()*2).map(this.params.z.fx);
            var y = [p_y, pq_y, q_y, r_y, s_y, st_y, t_y, tp_y, z_y].reduce((a, b) => a.concat(b), []);
            return y

    }

}



export default D3WAVE