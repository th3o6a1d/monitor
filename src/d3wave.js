import * as d3 from "d3";
import {squareWave} from "g.js";

class D3WAVE {

    constructor(div,options,index) {
        this.div=div
        this.options = options
        this.index=index
        this.tracingID = Math.random().toString(36).substring(2, 10).replace(/[^A-Za-z]+/g, '').toUpperCase()
        this.h = 200
        this.w = 1000
        this.data_cursor = []
        this.beatDurationPerSegment = 0

        this.sidePanelText = {"cardiac":"ECG","oximetry":"SPO2","capnography":"ETCO2"}
        this.sidePanelText2 = {"cardiac":"bpm","oximetry":"","capnography":""}
        this.tracingDecorator = {"cardiac":"II","oximetry":"PLETH","capnography":"ETCO2"}
        this.rateDefaults = {"cardiac":100,"oximetry":100,"capnography":20}

        this.segmentDuration = this.options.wave === "cap" ? 15000 : 5000
        this.options.rate = this.options.rate == null ? this.rateDefaults[this.options.type] : this.options.rate

        setInterval(()=>this.updateSidePanel(),4000 + Math.random()*1000)

    }

    initialize(){
        this.drawTracingSVG()
        this.drawSidePanel()
        this.decorateTracing()
        this.drawTracing()
        this.updateSidePanel()
    }

    fillDataCursor(){
        while (this.data_cursor.length < 500) {
            this._generateWave().map((i) => this.data_cursor.push(i))
        }
    }

    updateSidePanelText(d){
        switch(d.type){
            case "cardiac":
                var beatDurationPerSegment = this.beatDurationPerSegment
                var beatDuration = beatDurationPerSegment * (this.segmentDuration/1000)
                var bpm = Math.floor(60 / beatDuration)
                return bpm < 250 ? bpm : 0
            case "oximetry":
                if (d.range) {
                    var min = this.options.range[0] 
                    var max = this.options.range[1]
                    var range = max - min
                    return Math.floor(min + range * Math.random())
                } else {
                    return Math.floor(5 * Math.random() + 95)    
                }
            case "capnography":
                if (d.range) {
                    var min = this.options.range[0] 
                    var max = this.options.range[1]
                    var range = max - min
                    return Math.floor(min + range * Math.random())
                } else {
                    return Math.floor(30+Math.random()*10)
                }
            default:
                return ""
        }     
    }

    updateSidePanel() {
        d3.select("#"+ this.div)
            .select("#"+ this.tracingID + "-side")
            .select("text")
            .data([this.options])
            .text((d)=>this.updateSidePanelText(d))
    }

    drawSidePanel(){    
            var sidePanelSVG = d3.select("#"+ this.div)
                .select(".side-panel")
                .append("svg")
                .attr("viewBox","0 0 50 40")
                .attr("id",this.tracingID + "-side")
                .attr("class",this.options.type + "-side-panel")
            
            sidePanelSVG
                .data([this.options])
                .enter()

            sidePanelSVG.append("text")
                .attr("x",8)
                .attr("y",25)
                .text("--")
                .attr("class",(d) => d.type + "-side-text")

            sidePanelSVG.append("text")
                .attr("x",3)
                .attr("y",10)
                .text(this.sidePanelText[this.options.type])
                .attr("class",this.options.type + "-legend-text")

            sidePanelSVG.append("text")
                .attr("x",35)
                .attr("y",25)
                .text((d)=>this.sidePanelText2[d.type])
                .attr("class",this.options.type + "-legend-text")
    }

    remove(){
        d3.select("#"+ this.div).select("#" + this.tracingID + "-tracing").remove()
        d3.select("#"+ this.div).select("#"+ this.tracingID + "-side").remove()
        delete this
    }

    
    decorateTracing(){
       d3.select("#"+ this.div)
            .select("#" + this.tracingID + "-tracing")
            .append("text")
            .attr("x",50)
            .attr("y",50)
            .style("font-size","25px")
            .text(this.tracingDecorator[this.options.type])
            .attr("class",this.options.type+"-legend-text")
    }

    drawTracingSVG(){
        d3.select("#"+ this.div).select(".tracing-container")
            .append("svg")
            .attr("viewBox","0 0 1000 200")
            .attr("id",this.tracingID + "-tracing")
    }



    drawTracing = (went) => {

            this.fillDataCursor()
            var coming_data = this.data_cursor.slice(0,250)
            var going_data = this.data_cursor.slice(250,500)
            this.data_cursor = this.data_cursor.slice(500,this.data_cursor.length)

            var x = d3.scaleLinear().domain([0, 250]).range([50, this.w]);
            var y = d3.scaleLinear().domain([-2, 5]).range([this.h,0]);

            var line = d3.line()
                .x(function(d,i) {return x(i);})
                .y(function(d) {return y(d);})
                .curve(d3.curveNatural)

            var svg = d3.select("#" + this.tracingID + "-tracing")

            var coming = svg
                .append("path")
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
                going = svg
                .append("path")
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
                .on("end",()=>{
                    going.remove()
                    coming.classed("going",true)
                    coming.classed("coming",false)
                    this.drawTracing(coming)
                })
        }



    _generateWave() {

            this.updateHR = (params) =>{
                this.beatDurationPerSegment = Object.values(params).reduce((acc,i) => acc + i.duration(),0.0) / 500
            }

            this.drawPQRSTZ = (params) =>{
                let waveSegments = []
                Object.values(params).map((x) => waveSegments.push(d3.range(0,1,1/x.duration()*scalingConstant).map(x.fx)))
                return waveSegments.flat()
            }

            let params = {
                p: { duration: () => 12, fx: (x) => 2 * Math.pow(x, 3) * (1-x) },
                pq: { duration: () => 2, fx: (x) => 0 },
                q: { duration: () => 2, fx: (x) => -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1 },
                r: { duration: () => 6, fx: (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1},
                s: { duration: () => 3, fx: (x) =>  -1 * Math.pow(1.5, Math.sin(x, Math.PI)) + 1},
                st: { duration: () => 12, fx: (x) =>  0},
                t: { duration: () => 12, fx: (x) =>  5 * Math.pow(x, 2) * (1-x)},
                tp: { duration: () => 51, fx: (x) =>  0},
                z: {duration: ()=> 0, fx: (x) => 0}
            };

            let tpInterpolation = -49.97301 + (421478.7 + 49.97301)/(1 + (this.options.rate/0.0142982)^1.000545)
            let breathInterpolation = this.options.rate - 60
            let scalingConstant = Math.max(2,2+((this.options.rate + 0.01 - 120)/ 30))

            switch(this.options.wave){

                case "sinus":
                    params.tp.duration = () =>  tpInterpolation
                    this.updateHR(params)
                    return this.drawPQRSTZ(params)
                case "afib":  
                    params.tp.duration = () => (tpInterpolation * Math.random() * 2) + ((Math.random()-1)*scalingConstant)
                    params.p.fx = (x) => Math.random()/10
                    this.updateHR(params)
                    return this.drawPQRSTZ(params)
                case "aflutter":  
                    params.tp.duration = () => tpInterpolation + ((Math.random()-1)*scalingConstant)
                    var qrst = this.drawPQRSTZ(params)
                    var pWave = qrst.slice(0,8)
                    var pWaveArray = new Array(qrst.length).fill(pWave).flat()
                    var y = qrst.map((x,i)=>x+pWaveArray[i])
                    this.updateHR(params)
                    return y
                case "third-degree":  
                    params.tp.duration = () => tpInterpolation + ((Math.random()-1)*scalingConstant)
                    var qrst = this.drawPQRSTZ(params)
                    var pWave = qrst.slice(0,8).map((x)=>x*3)
                    qrst = qrst.splice(8,qrst.length)
                    var pWaveArray = new Array(qrst.length).fill(pWave.concat(new Array(35 + Math.floor(Math.random()*20)).fill(0))).flat()
                    var y = qrst.map((x,i)=>x+pWaveArray[i])
                    this.updateHR(params)
                    return y
                case "pleth":
                    Object.values(params).map((i) => i.duration = () => 0)
                    params.z.duration = () => tpInterpolation + 50
                    params.z.fx = (x) => -Math.sin(x*Math.PI*2)/2 - 2*Math.sin(12.5*x-Math.PI)/2 +1
                    this.updateHR(params)
                    return this.drawPQRSTZ(params)
                case "cap":
                    Object.values(params).map((i) => i.duration = () => 0)
                    params.z = { duration: () => this.options.rate*2, fx: (x) => -squareWave(x + Math.random()/100)}
                    var z_y = d3.range(0,1,1/params.z.duration()).map(params.z.fx);
                    this.updateHR(params)
                    return [0].concat(z_y).concat([0])
                case "vtach":
                    Object.values(params).map((i) => i.duration = () => 0)
                    params.q = { duration: () => 8 + 26, fx: (x) => -1 * Math.pow(2, Math.sin(x, Math.PI)) + 1 }
                    params.r = { duration: () => 16, fx: (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1}
                    params.z.duration = () =>  tpInterpolation
                    this.updateHR(params)
                    return this.drawPQRSTZ(params)
                case "vfib":
                    Object.values(params).map((i) => i.duration = () => 0)
                    params.z = { duration: () => 1, fx: (x) =>  x + Math.random()}
                    this.updateHR(params)
                    return this.drawPQRSTZ(params)
                case "asystole":
                    Object.values(params).map((i) => i.duration = () => 0)
                    params.z.duration = () =>  500
                    params.z.fx = (x) =>  Math.random()/10
                    return this.drawPQRSTZ(params)
                default:
                    return [0,0,0,0,0]
            }
    }
}



export default D3WAVE