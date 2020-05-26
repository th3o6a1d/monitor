import React from 'react';
import './ecg.css';
import * as serviceWorker from './serviceWorker';
import D3ECG from './d3ecg'


class ECG extends React.Component {

  constructor(props){
      super(props);
      this.viewBox = "0 0 1000 200"

      this.state = this.props.data
      this.telemetry = new D3ECG("telemetry",{"wave":"sinus","rate":60})
      this.oximetry = new D3ECG("oximetry",{"wave":"afib","rate":60})
      this.capnometry = new D3ECG("capnometry",{"wave":"capnometry","rate":60})

  }

  componentDidMount(){
      this.telemetry.drawECG(this.refs.telemetry)
      this.oximetry.drawECG(this.refs.oximetry)
      this.capnometry.drawECG(this.refs.capnometry)
      this.telemetry.drawBottomPanel(this.refs.bp)
  }

render() {
    return (
      <div className="monitor">
        <div className ="panel">
          <svg className="side telemetry_side" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"></svg>
          <svg className="side oximetry_side" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"></svg>
          <svg className="side capnometry_side" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg"></svg>
        </div>
        <div className="tracing-container">
          <svg viewBox={this.viewBox} className="tracing" xmlns="http://www.w3.org/2000/svg" ref="telemetry"/>
          <svg viewBox={this.viewBox} className="tracing" xmlns="http://www.w3.org/2000/svg" ref="oximetry"/>
          <svg viewBox={this.viewBox} className="tracing" xmlns="http://www.w3.org/2000/svg" ref="capnometry"/>
        </div>
        <div className="bottom-panel">
          <svg viewBox="0 0 1000 200" className="bottom-text" xmlns="http://www.w3.org/2000/svg" ref="bp"></svg>
        </div>
      </div>
        );
    }
}


serviceWorker.unregister();
export default ECG