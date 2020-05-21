import React from 'react';
import Monitor from './monitor';


const initialData = {}

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
