class D3ECG {
    constructor() {
        // The width ratios allows for the normalization of the widths of the
        // different segments of the pqrst wave.
        this.PQRST_WAVE_WIDTH_RATIOS = {
            p: 12,
            pq: 2,
            q: 2,
            r: 6,
            s: 3,
            st: 2,
            t: 12,
            tp: 2
        };
      
        this.norm_array = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        this.data_cursor = 0;
        this.data_buffer = [];
    }

    extObjectValues(obj) {
    if (typeof obj.values === 'undefined') {
        return Object.keys(obj).map(key => obj[key])
    }
    
    return obj.values();
    }

    getDataCursor() {
        return this.data_cursor;
    }

    getStepSize() {
        return 1 / (Object.keys(this.PQRST_WAVE_WIDTH_RATIOS).length * this.norm_array.length);
    }

    /**
     * Creates a single, discrete movement of the data cursor. 
     *
     * @returns a data point of the form [x, y].
     */
    tick() {
        if (this.data_buffer.length == 0)
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
        var s = (x) =>  -1 * Math.pow(1.5, Math.sin(x, Math.PI)) + 1;
        // T mimics a beta distribution
        var t = (x) =>  5 * Math.pow(x, 2) * (1-x);
        // pq, st, and tp segments mimic y=0
        var zero_segment = (x) =>  0;

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
            return acc + x;
        }, 0.0);

        var p_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.p / sum_width_ratios);
        var pq_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.pq / sum_width_ratios);
        var q_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.q / sum_width_ratios);
        var r_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.r / sum_width_ratios);
        var s_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.s / sum_width_ratios);
        var st_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.st / sum_width_ratios);
        var t_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.t / sum_width_ratios);
        var tp_x = this.norm_array.map(x => x * this.PQRST_WAVE_WIDTH_RATIOS.tp / sum_width_ratios);


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

        var x = [p_x, pq_x, q_x, r_x, s_x, st_x, t_x, tp_x].reduce((a, b) => a.concat(b), []);
        var y = [p_y, pq_y, q_y, r_y, s_y, st_y, t_y, tp_y].reduce((a, b) => a.concat(b), []);

        return x.map((e, i) => [e, y[i]]);
    }
}
export default D3ECG