import React from 'react';
import * as serviceWorker from './serviceWorker';
import D3MONITOR from './d3monitor';
import './monitor.css';
var QRCode = require('qrcode.react');

class Monitor extends React.Component {

  constructor(props){
    super(props);
    this.state = this.props.data
    this.options = 
              { 
                "tracings": [
                    {"type":"cardiac","wave":"sinus","rate":100},
                    // {"type":"oximetry","wave":"pleth","range":[95,100]},
                    // {"type":"capnography","wave":"cap","range":[95,100]},
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


// <QRCode bgColor="yellow" includeMargin="false" value="http://facebook.github.io/react/" />

  render() {
    return (
      <div className="monitor no-cpu">
        <div className="top panel"/>
        <div id="sidePanel" className="side-panel">
        </div>
        <div className="tracing-container"/>
        <div className="bottom-panel"/>
        <div id="footer">

          <div className="qr">
          <QRCode size="150" bgColor="#b5f9ff" renderAs="svg" includeMargin="true" value="http://facebook.github.io/react/" />
        </div>

        </div>
        
      </div>
    );
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default Monitor