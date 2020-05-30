import React from 'react';
import * as serviceWorker from './serviceWorker';
import './monitor.css';

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.defaultOptions

    this.setRate = this.setRate.bind(this);
    this.setWave = this.setWave.bind(this);
  
  }

  setWave(event) {
  	var tracings = this.state.tracings
  	tracings[event.target.name].wave = event.target.value
  	this.setState({tracings: tracings})
    this.props.setOptions(this.state);
  }

  setRate(event) {
  	var tracings = this.state.tracings
  	var val = event.target.value
tracings.map((x) => x.rate = parseInt(val))
  	console.log(tracings)
  	this.setState({tracings: tracings})
  	// console.log(this.state)
   //  this.props.setOptions(this.state);
  }


  render() {

  	const hr =  Array.from({length:130},(v,k)=>k+51)
  	const bottom = this.props.defaultOptions.bottom
  	const tracingOptions = ["afib","sinus","aflutter","third-degree","pleth"]

    return (
      <div className="options">
	      <select defaultValue="sinus" name="0" onChange={this.setWave}>
	      		{ tracingOptions.map(t => <option value={t}>{t}</option>) }
	      </select>
		  <select defaultValue="75" onChange={this.setRate} >
			  { hr.map(h => <option value={h}>{h}</option>) }
		  </select>
      </div>
    );
  }
}
export default Options