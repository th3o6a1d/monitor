import * as d3 from "d3";

class D3ECG {
    constructor() {
        // The width ratios allows for the normalization of the widths of the
        // different segments of the pqrst wave.

        this.pulseRate = 100;


        this.PQRST_WAVE_WIDTH_RATIOS = {
            p: 12,
            pq: 2,
            q: 2,
            r: 6,
            s: 3,
            st: 2,
            t: 12,
            tp: 1,
            z: 20
        };

        this.norm_array = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        this.data_cursor = 0;
        this.data_buffer = [];
    }


    drawECG(ref){
        var MAX_X = 12,
        MAX_Y = 5,
        MIN_Y = -3,
        MASK_WIDTH = 0.25,
        MASK_STEP_SIZE = 0.1,
        MASK_TRANSITION_DURATION = 50;


        var svg = d3.select(ref),
        // width = +svg.attr("width"),
        // height = +svg.attr("height"),
        width = 900,
        height = 300,
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
            if (new_x % MAX_X / (ecg.getStepSize()) >= data.length)
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

    extObjectValues(obj) {
        if (typeof obj.values === 'undefined') {
            return Object.keys(obj).map(key => obj[key])
        }
        
        return obj.values();
    }

    getStepSize() {
        var step = 1 / ((Object.keys(this.PQRST_WAVE_WIDTH_RATIOS).length * this.norm_array.length));
        step = step / (this.pulseRate / 100)
        return step;
    }



    /**
     * Creates a single, discrete movement of the data cursor. 
     *
     * @returns a data point of the form [x, y].
     */
    tick() {
        if (this.data_buffer.length === 0)
            this.data_buffer = this._generatePQRSTWave();

        this.data_cursor += this.getStepSize();
        return this.data_buffer.shift();
    }

    /**
     * generate a PQRST wave and append it to the ECG data. 
     */
    _generatePQRSTWave() {
        // P mimics a beta distribution
        var p = (x) => 2 * Math.pow(x, 3) * (1-x);
        // Q mimics the -ve part of a sine wave
        var q = (x) =>  -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1;
        // R mimics the +ve part of a skewed sine wave
        var r = (x) =>  Math.pow(7, Math.sin(x, Math.PI)) - 1;
        // S mimics the -ve part of a skewed sine wave
        var s = (x) =>  -1 * Math.pow(1.1, Math.sin(x, Math.PI)) + 1;
        // T mimics a beta distribution
        var t = (x) =>  5 * Math.pow(x, 2) * (1-x);
        // pq, st, and tp segments mimic y=0
        var zero_segment = (x) => Math.random()/10;

        // generate plot points for a single pqrst wave
        // y points for each segment
        var p_y = this.norm_array.map(p);
        var pq_y = this.norm_array.map(zero_segment);
        var q_y = this.norm_array.map(q);
        var r_y = this.norm_array.map(r);
        var s_y = this.norm_array.map(s);
        var st_y = this.norm_array.map(zero_segment);
        var t_y = this.norm_array.map(t);
        var tp_y = this.norm_array.map(zero_segment);



        // map normalized domain (0.0-1.0) to absolute domain
        var sum_width_ratios = this.extObjectValues(this.PQRST_WAVE_WIDTH_RATIOS).reduce((acc, x) => {
            return sum_width_ratios = acc + x;
        }, 0.0);

        var p_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.p / sum_width_ratios);
        var pq_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.pq / sum_width_ratios);
        var q_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.q / sum_width_ratios);
        var r_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.r / sum_width_ratios);
        var s_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.s / sum_width_ratios);
        var st_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.st / sum_width_ratios);
        var t_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.t / sum_width_ratios);
        var tp_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.tp / sum_width_ratios);

        var z_x = new Array(200-this.pulseRate).fill(0).map((e,x) => e + x/100)
        // z_x = z_x.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.z / sum_width_ratios);
        var z_y = z_x.map(zero_segment);

        // Apply the wave offset + segment offset to each segment
        // i.e. t should start after r finishes, and r should start after s, etc.
        var segment_offset = this.data_cursor;
        p_x = p_x.map(x => x + segment_offset);
        
        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.p / sum_width_ratios;
        pq_x = pq_x.map(x => x + segment_offset);
        
        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.pq / sum_width_ratios;
        q_x = q_x.map(x => x + segment_offset);

        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.q / sum_width_ratios;
        r_x = r_x.map(x => x + segment_offset);

        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.r / sum_width_ratios;
        s_x = s_x.map(x => x + segment_offset);

        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.s / sum_width_ratios;
        st_x = st_x.map(x => x + segment_offset);

        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.st / sum_width_ratios;
        t_x = t_x.map(x => x + segment_offset);

        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.t / sum_width_ratios;
        tp_x = tp_x.map(x => x + segment_offset);

        segment_offset += this.PQRST_WAVE_WIDTH_RATIOS.tp / sum_width_ratios;
        z_x = z_x.map(x => x + segment_offset);

        var x = [p_x, pq_x, q_x, r_x, s_x, st_x, t_x, tp_x, z_x].reduce((a, b) => a.concat(b), []);
        var y = [p_y, pq_y, q_y, r_y, s_y, st_y, t_y, tp_y, z_y].reduce((a, b) => a.concat(b), []);

        return x.map((e, i) => [e, y[i]]);
    }
}
export default D3ECG