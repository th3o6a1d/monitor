import React from 'react';
import './ecg.css';
import * as serviceWorker from './serviceWorker';
import D3ECG from './d3ecg'


class ECG extends React.Component {

  constructor(props){
      super(props);
      this.viewBox = "0 0 1000 200"

      this.state = this.props.data
      this.cardiac = new D3ECG("cardiac",{"wave":"capnography","rate":60})
      this.oximetry = new D3ECG("cardiac",{"wave":"capnography","rate":60})

  }

  componentDidMount(){
      this.cardiac.drawECG(this.refs.cardiac)
  }

render() {
    return (
      <div>
      <svg viewBox={this.viewBox} xmlns="http://www.w3.org/2000/svg" ref="cardiac"/>
      </div>
        );
    }
}


serviceWorker.unregister();
export default ECG