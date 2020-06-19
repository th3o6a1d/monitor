import React from 'react';
import './monitor.css';
import Select from 'react-select';

class ControlPanel extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            options: this.props.defaultOptions,
            tracing: "sinus",
            hr: 100,
            sys: 120,
            dias: 80,
            temp: 37.0,
            rr: 16,
            o2: 95,
        }

        this.tracings = [{ "value": "sinus", "label": "Sinus" }, { "value": "afib", "label": "AFib" }, { "value": "aflutter", "label": "AFlutter" }, { "value": "third-degree", "label": "Third Degree AV Block" }, { "value": "vfib", "label": "VFib" }, { "value": "vtach", "label": "VTach" }, { "value": "asystole", "label": "Asystole" }]
        this.hr = [0,20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190].reverse().map((x) => { return { "name": "hr", "value": x, "label": x } })
        this.sys = ["--",20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 195].reverse().map((x) => { return { "name": "sys", "value": x, "label": x } })
        this.dias = ["--",20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].reverse().map((x) => { return { "name": "dias", "value": x, "label": x } })
        this.rr = ["--",4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60].reverse().map((x) => { return { "name": "rr", "value": x, "label": x } })
        this.temp = [33.0, 33.2, 33.4, 33.6, 33.8, 34.0, 34.2, 34.4, 34.6, 34.8, 35.0, 35.2, 35.4, 35.6, 35.8, 36.0, 36.2, 36.4, 36.6, 36.8, 37.0, 37.2, 37.4, 37.6, 37.8, 38.0, 38.2, 38.4, 38.6, 38.8, 39.0, 39.2, 39.4, 39.6, 39.8, 40.0, 40.2, 40.4, 40.6, 40.8, 41.0, 41.2, 41.4, 41.6, 41.8, 42.0].reverse().map((x) => { return { "name": "temp", "value": x, "label": x } })
        this.o2 = [50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100].map((x) => { return { "name": "temp", "value": x, "label": x } })

    }

    handleChange = (e,o) => {
        this.state[o.name] = e.value
        let options = {
            "tracings": [
                { "type": "cardiac", "wave": this.state.tracing, "rate": this.state.hr },
                { "type": "oximetry", "wave": "pleth", "rate": this.state.hr, "range": [this.state.o2, Math.min(this.state.o2 + 5,100)] },
            ],
            "bottom": [
                { "type": "bp", "value": this.state.sys + "/" + this.state.dias },
                { "type": "temp", "value": this.state.temp },
                { "type": "rr", "value": this.state.rr },
            ]
        }
        this.props.setOptions(options)
    }


      // <div style={{position:"absolute",top:"0"}}>
      // <h4>Use the QR code to remotely control the original window using your phone.</h4>
      // <p>This tool is used for educational purposes only. The author accepts no liability for use or misuse of this tool, nor should this tool be expected to have perfectly accurate waveforms. </p>
      // </div>

    render() {

        return (
            <div className="options">
      <div className="control-tracing">
      <h3>Tracing</h3>
          <Select className="control-select" name="tracing" placeholder={"Sinus"} onChange={this.handleChange} options={this.tracings}/>
          <br/>
          <h3>Rate</h3>
          <Select className="control-select" name="hr" placeholder={this.state.hr} onChange={this.handleChange} options={this.hr}/>
          <h3>O2 Range (this + 5%)</h3>
          <Select className="control-select" name="o2" placeholder={this.state.o2} onChange={this.handleChange} options={this.o2}/>
          <br/>
          <h4>Use the QR code to remotely control the original window.</h4>
      </div>
      <div className="control-tracing">
      <h3>Blood Pressure</h3>
          <Select className="control-select" name="sys" placeholder={this.state.sys} onChange={this.handleChange} options={this.sys}/>
          <Select className="control-select" name="dias" placeholder={this.state.dias} onChange={this.handleChange} options={this.dias}/>
          <br/>
           <h3>Temperature</h3>
          <Select className="control-select" name="temp" placeholder={this.state.temp} onChange={this.handleChange} options={this.temp}/>
          <br/>
           <h3>Respiratory Rate</h3>
          <Select className="control-select" name="rr" placeholder={this.state.rr} onChange={this.handleChange} options={this.rr}/>
      </div>
      <div>
      </div>
      </div>
        );
    }
}


export default ControlPanel