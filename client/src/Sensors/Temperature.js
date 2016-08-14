import React, { Component } from 'react'
import EventBus from 'vertx3-eventbus-client'


class Temperature extends Component {
  constructor(props){
    super(props)
    this.state = {
      temperatures:[11]
    };
  }

  componentDidMount(){
    console.log("componentDidMount")
    this.setState({temperatures:[{date:Date(),value:12}]});
  }

  componentWillMount(){
    console.log("componentWillMount")
    this.eb = new EventBus(window.location.protocol + '//' +
                      window.location.hostname + '/api/eventbus');
    this.registerSocket();
  }

  registerSocket(){
    this.eb.onopen = () => {
      // eb.send('temperature.fetch', {}, (err,msg) => {
      //   console.log("temperature.fetch");
      //   this.setState({data: msg.body});
      //
      // });
      this.eb.registerHandler('temperature.UI', (err, msg) => {
        this.setState({temperatures: this.state.temperatures.concat([{date:Date(),value:msg.body}])});
      });
    };
  }

  render() {
    return(
      <div>
        <h1>temperature :</h1>
        {this.state.temperatures.map((temp, idx) => {
          return (<li key={idx}>{temp.date + ' - ' + temp.value}</li>)
        })}
      </div>
    )
  }
}


export default Temperature;
