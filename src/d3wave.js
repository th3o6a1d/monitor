import * as d3 from "d3";
import {squareWave} from "g.js";

class D3WAVE {

    constructor(options) {

        this.options = options
        this.h = 200
        this.w = 1000
        this.segmentDuration = 5000
        this.data_cursor = []

        this.sidePanelText = {"cardiac":"ECG","oximetry":"SPO2","capnography":"ETCO2"}
        this.sidePanelText2 = {"cardiac":"bpm","oximetry":"","capnography":""}
        this.tracingDecorator = {"cardiac":"II","oximetry":"PLETH"}

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

        setInterval(()=>this.updateSidePanel(),10000*Math.random())

    }


    fillDataCursor(){
        while (this.data_cursor.length < 600) {
            this._generateWave().map((i) => this.data_cursor.push(i))
        }
    }


    updateSidePanelText(d){
        switch(d.type){
            case "cardiac":
                var beatDurationPerSegment = Object.values(this.params).reduce((acc,i) => acc + i.duration(),0.0) / 500
                var beatDuration = beatDurationPerSegment * (this.segmentDuration/1000)
                var bpm = Math.floor(60 / beatDuration)
                return bpm
            case "oximetry":
                if (d.o2range) {
                    var min = this.options.o2range[0] 
                    var max = this.options.o2range[1]
                    var range = max - min
                    return Math.floor(min + range * Math.random())
                }
                return Math.floor(5 * Math.random() + 95)
                break
            case "capnography":
                return Math.floor(30+Math.random()*10)
                break
            default:
                return
        }     
    }

    updateSidePanel() {
        d3.select("." + this.options.type + "-side-text")
            .data([this.options])
            .text((d)=>this.updateSidePanelText(d))
    }

    drawSidePanel(){    
            var svg = d3.select(".side-panel")
                .append("svg")
                .attr("viewBox","0 0 50 40")
            
            svg.data([this.options])
                .enter()

            svg.append("text")
                .attr("x",8)
                .attr("y",25)
                .text("--")
                .attr("class",(d) => d.type + "-side-text")

            svg.append("text")
                .attr("x",3)
                .attr("y",10)
                .text((d)=>this.sidePanelText[d.type])
                .attr("class",(d) => d.type + "-legend-text")

            svg.append("text")
                .attr("x",35)
                .attr("y",25)
                .text((d)=>this.sidePanelText2[d.type])
                .attr("class",(d) => d.type + "-legend-text")

    }

    
    decorateTracing(){
            var svg = d3.select("." + this.options.type + "-tracing")
                .append("text")
                .attr("x",50)
                .attr("y",50)
                .style("font-size","25px")
                .text(this.tracingDecorator[this.options.type])
                .attr("class",this.options.type+"-legend-text")
    }

    drawTracing(){

        var x = d3.scaleLinear().domain([0, 250]).range([0, this.w]);
        var y = d3.scaleLinear().domain([-2, 5]).range([this.h,0]);

        var line = d3.line()
            .x(function(d,i) {return x(i);})
            .y(function(d) {return y(d);})
            .curve(d3.curveNatural)

        var svg = d3.select(".tracing-container")
            .append("svg")
            .attr("viewBox","0 0 1000 200")
            .attr("class",this.options.type + "-tracing no-cpu")

        
        let repeat = (went) => {


            this.fillDataCursor()
            var coming_data = this.data_cursor.slice(0,250)
            var going_data = this.data_cursor.slice(250,500)
            this.data_cursor = this.data_cursor.slice(500,this.data_cursor.length)
            this.decorateTracing()


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
                    this.params.tp.duration = () => Math.random() * 2 * this.options.rate
                    this.params.tp.fx = () => Math.random()/50
                    this.params.p.fx = (x) => Math.random()/50
                    break
                case "oximetry":
                    Object.values(this.params).map((i) => i.duration = () => 0)
                    this.params.z = { duration: () => 101, fx: (x) => -Math.sin(x*Math.PI*2)/2 - 2*Math.sin(12.5*x-Math.PI)/2 +1}
                    break
                case "capnography":
                    Object.values(this.params).map((i) => i.duration = () => 0)
                    this.params.z = { duration: () => 160, fx: (x) => (Math.sin(x*2.0*Math.PI) + Math.sin(2.95*Math.PI*2*x)/3 + Math.random()/100+ Math.sin(5*2*Math.PI*x)/5 + Math.sin(8*Math.PI*x)/7 + Math.sin(9*x *Math.PI)/9 + Math.sin(11*Math.PI*x)/11)*1.1}
                    this.params.z = { duration: () => 160, fx: (x) => squareWave(x + Math.random()/100)}
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