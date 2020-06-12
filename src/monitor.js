import React from 'react';
import D3MONITOR from './d3monitor';
import ControlPanel from './control_panel';
import Options from './options';
import ReactMarkdown from 'react-markdown'
import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyCNvNX6C4e-0SFFNl7Jc2GYFMGGPmaaCmQ",
    databaseURL: "https://monitor-c7047.firebaseio.com",
    projectId: "monitor-c7047",
};

firebase.initializeApp(firebaseConfig);
var QRCode = require('qrcode.react');

class Monitor extends React.Component {

    constructor(props) {

        super(props);

        this.options = {
            "tracings": [
                { "type": "cardiac", "wave": "sinus", "rate": 100 },
                { "type": "oximetry", "wave": "pleth", "rate": 100, "range": [95, 100] },
            ],
            "bottom": [
                { "type": "bp", "value": "120/80" },
                { "type": "temp", "value": "37.7" },
                { "type": "rr", "value": "20" },
            ]
        }
    
        this.state = {
            showOptions: false,
            showAbout: false,
            showShare: false
        }
        this.toggleOptions = this.toggleOptions.bind(this)
        this.toggleShare = this.toggleShare.bind(this)
        this.toggleAll = this.toggleAll.bind(this)
        this.setOptions = this.setOptions.bind(this)
        
        let url = new URL(window.location)
        let monitorCode = url.searchParams.get("monitor")
        if(monitorCode){
            this.monitorCode = monitorCode
        } else {
            this.monitorCode = String(Math.floor(Math.random()*10000000)).slice(0,4)
            window.history.replaceState(null, null, "?monitor=" + this.monitorCode);
            this.write(this.monitorCode,this.options)
        }
    }


    write(monitorCode, options) {
        firebase.database().ref('monitors/' + monitorCode).set(JSON.stringify(options));
    }

    setOptions = (newOptions) => {
        this.write(this.monitorCode, newOptions)
        this.monitor.update(newOptions)
    }

    componentDidMount() {
        this.monitor = new D3MONITOR("monitor", this.options)
        this.monitor.initialize()

        let callback = (snapshot) =>{
            if(snapshot.val()){
                var options = JSON.parse(snapshot.val())
                return this.setOptions(options)    
            }
        }

        let monitorRoom = firebase.database().ref('monitors/' + this.monitorCode)
        monitorRoom.on('value',callback)
    }

    toggleOptions() {
        this.setState({ showOptions: !(this.state.showOptions) })
        this.setState({ showAbout: false })
        this.setState({ showShare: false })
    }


    toggleShare() {
        this.setState({ showShare: !(this.state.showShare) })
        this.setState({ showOptions: false })
        this.setState({ showAbout: false })
    }

    toggleAll() {
        this.setState({ showOptions: false })
        this.setState({ showAbout: false })
        this.setState({ showShare: false })
    }

    render() {
        console.log(window.location)
        return (
            <div>
            {this.state.showOptions ? <Options defaultOptions={this.options} setOptions={this.setOptions}/> : null}
            {this.state.showShare ? <ControlPanel setOptions={this.setOptions} defaultOptions={this.options}/> : null }
            <div id="monitor" onClick={this.toggleAll} className="monitor no-cpu"></div>
            <a href={window.location} target="_blank" ><QRCode size="100" className="qr" bgColor="white" renderAs="svg" includeMargin="true" value={window.location.href} /></a>
            <div className="footer">
                <div onClick={this.toggleShare} className="footer-item"><img src={"/settings.svg"}></img></div>
                <div onClick={this.toggleOptions} className="footer-item"><img src={"/code.svg"}></img></div>
                <div className="footer-item" style={{width:"50%"}}><a href="https://jt.netlify.app">by JTMD</a> <a href="https://twitter.com/th3o6a1d">@th3o6a1d</a> <a href="https://github.com/th3o6a1d/monitor">Fork This!</a></div>
              </div>
          </div>
        );
    }
}

export default Monitor