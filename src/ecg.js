import React from 'react';
import './ecg.css';
import * as serviceWorker from './serviceWorker';
import D3ECG from './d3ecg'


class ECG extends React.Component {

  constructor(props){
      super(props);
      this.state = this.props.data
  }

  componentDidMount(){
      var d3ecg = new D3ECG()
      d3ecg.drawECG(this.refs.cardiac)

      var d3pulseox = new D3ECG()
      d3pulseox.drawECG(this.refs.pulseox)

  }

render() {
    return (
      <div>
        <svg className="ecg" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid meet" ref="cardiac"></svg>
        <svg className="pulseox" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid meet" ref="pulseox"></svg>
        </div>
        );
    }
}


serviceWorker.unregister();
export default ECG