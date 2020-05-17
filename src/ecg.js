import React from 'react';
import ReactDOM from 'react-dom';
import './ecg.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as d3 from "d3";
import D3ECG from './d3ecg'


class ECG extends React.Component {

    constructor(props){
        super(props);
        this.state = this.props.data
    }



    drawECG(ref){
        var MAX_X = 12,
        MAX_Y = 5,
        MIN_Y = -3,
        MASK_WIDTH = 0.5,
        MASK_STEP_SIZE = 0.1,
        MASK_TRANSITION_DURATION = 50;


        var svg = d3.select(ref),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g");

        var ecg = new D3ECG(),
        data = [];

        var x = d3.scaleLinear()
        .domain([0, MAX_X])
        .range([0, width]);

        var y = d3.scaleLinear()
        .domain([MIN_Y, MAX_Y])
        .range([height, 0]);

        var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d, i) { return x(d.getX()); })
        .y(function(d, i) { return y(d.getY()); });

        var clip_path = g.append("defs")
        .append("defs")
        .append("clipPath")
        .attr("id", "clip");

        var clip_rect_1 = clip_path 
        .append("rect")
        .attr("width", 0)
        .attr("height", height);

        var clip_rect_2 = clip_path.append("rect")
        .attr("x", x(MASK_WIDTH))
        .attr("width", x(MAX_X - MASK_WIDTH))
        .attr("height", height);

        var path = g.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

        tick();

        function tick() { 
        // Move the clip masks
        var delta_x = x(MASK_STEP_SIZE);
        var left_rect = clip_rect_1;
        var right_rect = clip_rect_2;
        if (+left_rect.attr("x") > +right_rect.attr("x") ||
            +left_rect.attr("x") + +left_rect.attr("width") > +right_rect.attr("x") + +right_rect.attr("width")) {
            left_rect = clip_rect_2;
            right_rect = clip_rect_1;
        }
        var next_left_x = +left_rect.attr("x");
        var next_left_width = +left_rect.attr("width");
        var next_right_x = +right_rect.attr("x");
        var next_right_width = +right_rect.attr("width");

        // Case 1: We have a single mask while the gap moves from the right edge
        // to the left edge.
        //
        // |XXXXXXXX | => | XXXXXXXX|
        //
        // Left mask remains unchanged, right masks translates to the right.
        if (+right_rect.attr("x") >= x(MAX_X) ||
            +right_rect.attr("x") + +right_rect.attr("width") < x(MAX_X)) { 
            if (+right_rect.attr("x") >= x(MAX_X)) {
                var temp_rect = left_rect;
                left_rect = right_rect;
                right_rect = temp_rect;

                next_left_x = 0;
                next_left_width = 0;
                next_right_width = +right_rect.attr("width");

                left_rect
                .attr("x", 0)
                .attr("width", 0)
                .attr("transform", null);
            }

            next_right_x = +right_rect.attr("x") + x(MASK_STEP_SIZE);
        }

        // Case 2: We have a left mask and a right mask, leaving  agap in the
        // middle
        //
        // |XXXX XXXX| => |XXXXX XXX|
        //
        // Expand the left mask, and move the right mask while contracting it.
        else {
            next_left_width += x(MASK_STEP_SIZE);
            next_right_x += x(MASK_STEP_SIZE);
            next_right_width -= x(MASK_STEP_SIZE);
        }

        var t = left_rect.transition()
        .attr("x", next_left_x)
        .attr("width", next_left_width)
        .duration(MASK_TRANSITION_DURATION)
        .ease(d3.easeLinear);

        right_rect.transition(t)
        .attr("x", next_right_x)
        .attr("width", next_right_width)
        .duration(MASK_TRANSITION_DURATION)
        .ease(d3.easeLinear)
        .on("end", tick);

        // update the data
        var update_datum = (new_x, new_y) => {
            if (new_x % MAX_X / ecg.getStepSize() >= data.length)
                data.push(new Point(new_x, new_y));
            else
                data[new_x / ecg.getStepSize()] = new Point(new_x, new_y);
        };

        var new_datum = ecg.tick();
        var new_x = new_datum[0];
        var new_y = new_datum[1];

        while(new_x % MAX_X < (x.invert(next_right_x) - MASK_WIDTH/2.0) % MAX_X) {
            update_datum(new_x, new_y);

            new_datum = ecg.tick();
            new_x = new_datum[0];
            new_y = new_datum[1];
        }
        update_datum(new_x, new_y);

        path
            .transition()
            .selection()
            .interrupt()
            .attr("d", line)
            .attr("transform", null);
        }

        // A Simple Point in Euclidean Space
        function Point(x, y) {
            return {
                x: x,
                y: y,
                getX: function() {return this.x},
                getY: function() {return this.y}
            };
        }
    }

componentDidMount(){
    this.drawECG(ReactDOM.findDOMNode(this.refs.cardiac))
}


render() {
    return (
        <div className="cardiac">
        <svg class="ecg" width="1000" height="200" ref="cardiac"></svg>
        </div>
        );
    }
}


serviceWorker.unregister();
export default ECG