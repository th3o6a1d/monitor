import React from 'react';
import Monitor from './monitor';


const initialData = {
	"o2waveform":"486.6,113.8 328.2,113.8 310.3,132.3 296,70.7 246.8,127.4 241.6,120.2 233.9,166.4 227,27.6 213.2,118.3 211.8,112.3 205.1,126.1 198.2,108.5 194.1,124.4 184.5,92.9 174.1,113 4.3,113  ",
	"pulseRate":86
}

function App() {

  return (
    <div className="App" >
      <div className="monitor">
      	<Monitor data={initialData}/>
      </div>
    </div>
  );
}

export default App;
