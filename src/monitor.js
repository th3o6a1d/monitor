import React from 'react';
import * as serviceWorker from './serviceWorker';
import ECG from './ecg';
import Oximetry from './oximetry';

class Monitor extends React.Component {

  constructor(props){
    super(props);
    this.state = this.props.data
  }

  render() {
    return (
      <div>
       	<ECG data={this.state}/>
        <Oximetry data={this.state}/>
      </div>
    );
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default Monitor