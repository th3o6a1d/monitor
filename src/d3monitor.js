import * as d3 from "d3";
import D3WAVE from './d3wave';

class D3MONITOR {
	
 	constructor(options) {
 		this.options = options
 	}

 	initialize() {
 		this.options.tracings = this.options.tracings.map((t,i) => {
 			t.name = "tracing" + i
 			var tracing = new D3WAVE(t)
 			tracing.drawTracing()
 			tracing.drawSidePanel()
 			return tracing
 		})
 		this.drawBottomPanel()
 		this.updateBottomPanel()
 		setInterval(()=>this.updateBottomPanel(),10000)
 	}


    drawBottomPanel(){
    	var count = this.options.bottom.length
    	var legend_text = {"bp":"NIBP","temp":"°C","rr":"RR"}
        var legend_text_small = {"bp":"AUTO","temp":"","rr":""}
    	
		var svg = d3.select(".bottom-panel")
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
    		.attr("class",(d) => d.type + "-bottom-text " + "bottom-text")
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

    updateBottomText(i){
    	switch(i.type){
    		case "bp":
    			return Math.floor(120 + (Math.random() - 1) * 10) + "/" + Math.floor(80 + (Math.random() - 1))
    		case "temp":
    			return 37.7 + Math.round(Math.random() - 1,1)
    		case "rr":
    			return 16 + Math.round(Math.random() - 1,1)
    	}
    	return i.value
    }

    updateBottomPanel(){   
     	var svg = d3.selectAll(".bottom-item")
     		.data(this.options.bottom)
     		.selectAll(".bottom-text")
     		.text(this.updateBottomText)
    }


}

export default D3MONITOR



