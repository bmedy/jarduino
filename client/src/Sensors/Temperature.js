import React, { Component } from 'react'
import EventBus from 'vertx3-eventbus-client'
import Radium from 'radium'

@Radium
class Temperature extends Component {
  constructor(props){
    super(props)
    this.state = {
      temperatures:[]
    };
  }

  componentDidMount(){
    this.setState({temperatures:[]});
  }

  componentWillMount(){
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
      <div>
        <span>{this.props.size.width + '*' + this.props.size.height}</span>
        <h1 style={[
            styles.base,
            this.props.size.width === 2 && styles.two,
            this.props.style
          ]}>temperature :</h1>
        {this.state.temperatures.map((temp, idx) => {
          return (<li key={idx}>{temp.date + ' - ' + temp.value}</li>)
        })}
      </div>
    )
  }
}

const styles = {
  base: {
    color: 'blue'
  },

  two: {
    color: 'red'
  }
};

export default Temperature;
