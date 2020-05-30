import React from 'react';
import * as serviceWorker from './serviceWorker';
import D3MONITOR from './d3monitor';
import Options from './options';
import './monitor.css';
var QRCode = require('qrcode.react');

class Monitor extends React.Component {

  constructor(props){

    super(props);

    this.options = { "tracings": [
                          {"type":"cardiac","wave":"sinus","rate":100},
                          {"type":"oximetry","wave":"pleth","range":[95,100]},
                          ],
                      "bottom": [
                          {"type":"bp","value":"120/80"},
                          {"type":"temp","value":"37.7"},
                          {"type":"rr","value":"20"},
                          ]
                    }

    this.state = {
      showConnectionInfo: false,
    }

    this.setOptions = this.setOptions.bind(this)

    this.code = Math.random().toString(36).substring(2,6).toUpperCase();
    this.url = window.location.href + "/" + this.code

  }

  setOptions = (a) => {
    console.log(a)
      this.options = a
      this.monitor.update()
  }

  sockets(){

      var code = this.code
      var options = this.options
      console.log(options)

      var W3CWebSocket = require('websocket').w3cwebsocket;
       
      var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');
       
      client.onerror = () => {
          this.setState({"showConnectionInfo":false})
          console.log('Connection Error');
      };
       
      client.onopen = function() {
          console.log('WebSocket Client Connected');
       
          this.sendCode = () => {
              if (client.readyState === client.OPEN) {

                  client.send(JSON.stringify({"code":code,"options":options}));
                  setTimeout(this.sendCode, 20000);
              }
          }
          this.sendCode();
          console.log("this")
      };
       
      client.onclose = function() {
          console.log('echo-protocol Client Closed');
      };
       
      client.onmessage = (e) => {
        this.showConnectionInfo = true
          if (typeof e.data === 'string') {
              this.setState({"showConnectionInfo":true})
              var response = JSON.parse(e.data)
              this.monitor.update()
          }
      };

  }

  componentDidMount(){
      this.monitor = new D3MONITOR(this.options)
      this.monitor.initialize()
      this.sockets()
  }

  render() {
    return (
      <div>
            <Options defaultOptions={this.options} setOptions={this.setOptions}/>
      <div className="monitor no-cpu">
        <div className="top panel"/>
        <div id="sidePanel" className="side-panel">
        </div>
        <div className="tracing-container"/>
        <div className="bottom-panel"/>
        <div id="footer">
          <div className="footer-item">
          { this.state.showConnectionInfo ? <div id="roomCode" display={this.showHide}>{this.code}</div> : null }
          </div>
          <div className="qr" display={this.showHide} >
          { this.state.showConnectionInfo ? <QRCode size="100" bgColor="#b5f9ff" renderAs="svg" includeMargin="true" value={this.url} /> : null}
        </div>
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