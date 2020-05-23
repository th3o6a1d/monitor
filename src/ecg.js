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
  }

render() {
    return (
      <div>
      <div ref="cardiac"/>
      <div ref="oximetry"/>
      </div>
        );
    }
}


serviceWorker.unregister();
export default ECG