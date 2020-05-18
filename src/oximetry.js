import React from 'react';
import './oximetry.css';
import * as serviceWorker from './serviceWorker';


class Oximetry extends React.Component {

  constructor(props){
    super(props);
    this.state = this.props.data
  }

  render() {
    return (
        <div className="oximetry">
       	  <svg className="oximetry" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 200">
          <g><polyline className="o2waveform" points={this.state.o2waveform}/></g>
          <text class="o2sat" transform="translate(800,135)" font-size="120" style={{animation: "ekg 1s linear forwards infinite"}}>{this.state.pulseRate}</text>
        	</svg>
        </div>
    );
  }
}


serviceWorker.unregister();
export default Oximetry