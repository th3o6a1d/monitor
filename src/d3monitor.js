import * as d3 from "d3";
import D3WAVE from './d3wave';

class D3MONITOR {
	
 	constructor(options) {
 		this.options = options
 		this.tracings = []
 	}

 	initialize() {
 		this.options.tracings.map((t,i) => {
 			t.name = "tracing" + i
 			this.tracings.push(new D3WAVE(t))
 		})
 		this.tracings.map((t) => t.drawTracing())
 		this.tracings.map((t) => t.drawSidePanel())
 		this.drawBottomPanel(this.options.bottom)
 	}

    drawBottomPanel(b){   
    	var width = Math.round(100/b.length) + "%"
    	b.map((i) => {
	        var div = d3.select(".bottom-panel")
	        	.append("div")
	        	.attr("class","bottom-item")
	        	.style("width",width)
	        	.append("svg")
	        	.attr("viewBox","0 0 100 50")
	        	.append("text")
				.attr("x",10)
                .attr("y",25)
	        	.text(i.value)
	        	.attr("class","bottom-text")
    	})
    }

 	update() {
 		this.tracings.map((t,i) => t.options = this.options.tracings[i])
 	}
}

export default D3MONITOR



