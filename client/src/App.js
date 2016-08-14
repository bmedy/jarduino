import React, { Component } from 'react';
import Temperature from './Sensors/Temperature'

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
      <div>
      <h1>is alive : {this.state.isAlive?"up":"down"}</h1>
      <Temperature />
      </div>
    );
  }
}

export default App;
