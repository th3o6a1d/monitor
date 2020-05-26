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
                    {"type":"cardiac","wave":"afib","rate":100},
                    {"type":"cardiac","wave":"sinus","rate":20},
                    {"type":"cardiac","wave":"afib","rate":100},
                    {"type":"cardiac","wave":"sinus","rate":100}],
                "bottom": [
                    {"type":"bp","value":"120/80"},
                    {"type":"bp","value":"120/80"}
                    ]
              }

  }

  componentDidMount(){
      this.monitor = new D3MONITOR(this.options)
      this.monitor.initialize()
  }

  render() {
    return (
      <div className="monitor">
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