import * as d3 from "d3";
import D3WAVE from './d3wave';
import './monitor.css';

class D3MONITOR {
	
 	constructor(div,options) {
        this.div = div
 		this.options = options
        this.bottomPanelUpdateFreq = 10000
        this.tracingArray = []
        setInterval(()=>this.updateBottomPanel(),this.bottomPanelUpdateFreq)
 	}

 	initialize() {

        this.drawSidePanel()
        this.drawTracingContainer()
        this.drawBottomPanel()
        this.updateBottomPanel()

 		this.options.tracings.map((t,i) => {
 			var tracing = new D3WAVE(this.div,t,i)
 			tracing.initialize()
 			this.tracingArray.push(tracing)
 		})
 	}

    update = (newOptions) =>{
        if((newOptions.tracings.length != this.tracingArray.length)|| (this.options.bottom.length != newOptions.bottom.length)){
            this.options = newOptions
            this.tracingArray.map((x) => x.drawTracing=()=>null)
            this.tracingArray = []
            d3.select("#"+this.div).select(".side-panel").remove()
            d3.select("#"+this.div).select(".tracing-container").remove()
            d3.select("#"+this.div).select(".bottom-panel").remove()
            this.initialize()     
        } else {
            this.options = newOptions
            this.tracingArray.map((x,i)=>x.options = newOptions.tracings[i])
        }
    }

    drawBottomPanel(){
    	var count = this.options.bottom.length
    	var legend_text = {"bp":"NIBP","temp":"°C","rr":"RR"}
        var legend_text_small = {"bp":"AUTO","temp":"","rr":""}
    	
		var svg = d3.select("#" + this.div)
            .append("div")
            .attr("class","bottom-panel")
    		.selectAll("div")
    		.data(this.options.bottom)
    		.enter()
    		.append("svg")
    		.attr("class","bottom-item")
	       	.attr("viewBox","0 0 200 100")
	       	.attr("height","200")
	       	.attr("width",(d)=>100/count +"%")

    	svg.append("text")
    		.attr("x",100)
    		.attr("y",45)
    		.text((d)=> d.value)
    		.attr("class",(d) => d.type + "-bottom-text bottom-text")
    		.style("text-anchor","middle")

        svg.append("text")
    		.attr("x",170)
    		.attr("y",0)
    		.text((d)=> legend_text[d.type])
    		.attr("class",(d) => d.type + "-bottom-legend")
    		.style("text-anchor","end")

        svg.append("text")
            .attr("x",25)
            .attr("y",70)
            .text((d)=> legend_text_small[d.type])
            .attr("class",(d) => d.type + "-bottom-legend")
            .style("text-anchor","start")
    }

    drawSidePanel(){
        d3.select("#" + this.div)
            .append("div")
            .attr("class","side-panel")
            .attr("id","sidePanel")
    }


    drawTracingContainer(){
        d3.select("#" + this.div)
            .append("div")
            .attr("class","tracing-container")
    }

    updateBottomText(i){
    	switch(i.type){
    		case "bp":
                let s = i.value.split("/")
                let sys = Math.floor(parseInt(s[0]) + (Math.random() - 1) * 10)
                let dias = Math.floor(parseInt(s[1]) + (Math.random() - 1))
                if(isNaN(sys) || isNaN(dias)) {
                    return "--/--"
                } else {
                    return sys + "/" + dias
                }
    		case "temp":
    			return Math.round(parseFloat(i.value) * 10)/10
    		case "rr":
                let rr = parseInt(i.value) + Math.round(Math.random() - 1,1)
                if (isNaN(rr)) {
                    return "--" 
                } else {
                    return rr
                }
    	}
    	return i.value
    }

    updateBottomPanel(){  
     	var svg = d3.selectAll(".bottom-text")
            .data(this.options.bottom)
     		.text(this.updateBottomText)
    }


}

export default D3MONITOR



