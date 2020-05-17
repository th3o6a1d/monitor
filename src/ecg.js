import React from 'react';
import ReactDOM from 'react-dom';
import './ecg.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


class ECG extends React.Component {

  constructor(props){
    super(props);
    this.state = this.props.data
  }

  render() {
    return (
        <div className="cardiac">
     	  <svg className="ekg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 200">
        <g><path class="ekg" points={this.state.tracing}/></g>
        <text class="pulseRate" transform="translate(800,135)" font-size="120" style={{animation: "ekg 1s linear forwards infinite;"}}>{this.state.pulseRate}</text>
      	</svg>

        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200">
        <g transform="translate(0.000000,262.000000) scale(0.100000,-0.100000)">
        <polyline class="ekg" points={this.state.tracing}/>
        </g>
        </svg>

        </div>
    );
  }
}


serviceWorker.unregister();
export default ECG