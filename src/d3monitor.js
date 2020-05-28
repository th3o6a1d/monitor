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
 	}

 	update() {
 		this.tracings.map((t,i) => t.options = this.options.tracings[i])
 	}


    drawBottomPanel(){
    	var count = this.options.bottom.length
    	
		d3.select(".bottom-panel")
    		.selectAll("div")
    		.data(this.options.bottom)
    		.enter()
    		.append("svg")
	       	.attr("viewBox","0 0 200 25")
	       	.attr("height","100")
	       	.attr("width",(d)=>100/count +"%")
    		.append("text")
    		.attr("x",10)
    		.attr("y",15)
    		.text((d)=> d.value)
    		.attr("class",(d) => d.type + "-bottom-text")
    }

    updateBottomText(i){
    	return i.value
    }

    updateBottomPanel(){   
     	var svg = d3.selectAll(".bottom-item")
    }


}

export default D3MONITOR



