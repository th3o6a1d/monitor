import React from 'react';
import './ecg.css';
import * as serviceWorker from './serviceWorker';
import D3ECG from './d3ecg'


class ECG extends React.Component {

  constructor(props){
      super(props);
      this.state = this.props.data
      this.cardiac = new D3ECG("cardiac")
      this.oximetry = new D3ECG("oximetry")
  }

  componentDidMount(){
      this.cardiac.drawECG(this.refs.cardiac)
      this.oximetry.drawECG(this.refs.oximetry)
  }

render() {
    return (
      <div>
        <svg className="cardiac" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid meet" ref="cardiac"></svg>
        <svg className="oximetry" viewBox="0 0 900 300" preserveAspectRatio="xMidYMid meet" ref="oximetry"></svg>
        </div>
        );
    }
}


serviceWorker.unregister();
export default ECG