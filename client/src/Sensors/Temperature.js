import React, { Component } from 'react'
import EventBus from 'vertx3-eventbus-client'
import {Card, CardHeader, CardText} from 'material-ui/Card';


class Temperature extends Component {
  constructor(props){
    super(props)
    this.state = {
      temperatures:[11]
    };
  }

  componentDidMount(){
    console.log("componentDidMount")
    this.setState({temperatures:[]});
  }

  componentWillMount(){
    console.log("componentWillMount")
    this.eb = new EventBus(window.location.protocol + '//' +
                      window.location.hostname + '/api/eventbus');
    this.registerSocket();
  }

  registerSocket(){
    this.eb.onopen = () => {
      this.eb.send('temperature.fetch');
      this.eb.registerHandler('temperature.UI', (err, msg) => {
        this.setState({temperatures: this.state.temperatures.concat([{date:msg.body.date,value:msg.body.value}])});
      });
    };
  }

  render() {
    return(
      <Card>
        <CardHeader
          title="Temperature"
          />
        <CardText>
          <ul>
            {this.state.temperatures.map((temp, idx) => {
              return (<li key={idx}>{temp.date + ' - ' + temp.value}</li>)
            })}
          </ul>
        </CardText>
      </Card>
    )
  }
}


export default Temperature;
