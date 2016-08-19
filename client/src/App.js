import React, { Component } from 'react';
import Temperature from './Sensors/Temperature'
import ServerStatus from './common/ServerStatus'


class App extends Component {
  render() {
    return (
      <div>
        <ServerStatus />
        <Temperature size={{width:4,height:2}} />
      </div>
    );
  }
}

export default App;
