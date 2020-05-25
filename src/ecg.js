import React from 'react';
import './ecg.css';
import * as serviceWorker from './serviceWorker';
import D3ECG from './d3ecg'


class ECG extends React.Component {

  constructor(props){
      super(props);
      this.viewBox = "0 0 1000 200"

      this.state = this.props.data
      this.cardiac = new D3ECG("cardiac",{"wave":"afib","rate":60})
      this.cap = new D3ECG("cap",{"wave":"afib","rate":60})
      this.cap2 = new D3ECG("cap2",{"wave":"afib","rate":60})

  }

  componentDidMount(){
      this.cardiac.drawECG(this.refs.cardiac)
      this.cap.drawECG(this.refs.cap)
      this.cap2.drawECG(this.refs.cap2)
  }

render() {
    return (
      <div className="monitor">
        <div className ="panel">
          <svg className="side cardiac_side" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" ></svg>
          <svg className="side cap_side" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" ></svg>
          <svg className="side cap2_side" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" ></svg>
        </div>
        <div className="tracing-container">
          <svg viewBox={this.viewBox} className="tracing" xmlns="http://www.w3.org/2000/svg" ref="cardiac"/>
          <svg viewBox={this.viewBox} className="tracing" xmlns="http://www.w3.org/2000/svg" ref="cap"/>
          <svg viewBox={this.viewBox} className="tracing" xmlns="http://www.w3.org/2000/svg" ref="cap2"/>
        </div>
      </div>
        );
    }
}


serviceWorker.unregister();
export default ECG