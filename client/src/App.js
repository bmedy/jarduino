import React, { Component } from 'react';
import Temperature from './Sensors/Temperature'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


class App extends Component {

  constructor(props){
    super(props);
    this.state = {isAlive:false};
  }

  componentDidMount(){
    this.check()
  }

  check(){
    fetch(window.location.protocol + '//' + window.location.hostname + '/api/isAlive',
      {
        method:'GET'
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({isAlive:data.isAlive})
        console.log(this.state)
      }).catch(function(err) {
        console.error(err);
      })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <h1>is alive : {this.state.isAlive?"up":"down"}</h1>
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
