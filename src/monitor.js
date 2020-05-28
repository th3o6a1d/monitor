import React from 'react';
import * as serviceWorker from './serviceWorker';
import D3MONITOR from './d3monitor';
import './monitor.css';

class Monitor extends React.Component {

  constructor(props){
    super(props);
    this.state = this.props.data
    this.options = 
              { 
                "tracings": [
                    {"type":"cardiac","wave":"sinus","rate":20},
                    {"type":"oximetry","wave":"oximetry","o2range":[95,100]},
                    {"type":"capnography","wave":"capnography"},
                    ],
                "bottom": [
                    {"type":"bp","value":"120/80"},
                    {"type":"temp","value":"37.7"},
                    {"type":"rr","value":"20"},
                    ]
              }

  }

  componentDidMount(){
      this.monitor = new D3MONITOR(this.options)
      this.monitor.initialize()
  }

  render() {
    return (
      <div className="monitor no-cpu">
        <div className="side-panel"/>
        <div className="tracing-container"/>
        <div className="bottom-panel"/>
      </div>
    );
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default Monitor