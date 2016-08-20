import React, { Component } from 'react'
import Radium from 'radium'
import Temperature from './Sensors/Temperature'
import ServerStatus from './core/ServerStatus'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

@Radium
class App extends Component {


  render() {
    return (
      <MuiThemeProvider>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <ServerStatus />
            </div>
            <div className="col-md-4">
              <Temperature />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
  );
}
}

export default App;
