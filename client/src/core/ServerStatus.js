import React, { Component } from 'react'
import Radium from 'radium'
import {Card, CardHeader, CardText} from 'material-ui/Card';

const styles = {
  base: {
    fontWeight:'bold',
    fontSize:'3em',
    textAlign: 'center'
  },
  up :{
    color: '#00ff00'
  },
  down:{
    color: '#ff0000'
  }
}

@Radium
class ServerStatus extends Component {
  constructor(props){
    super(props);
    this.state = {isAlive:false};
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }
  componentDidMount(){
    this.timer = setInterval(() => {
      fetch(window.location.protocol + '//' + window.location.hostname + '/api/isAlive',
      {
        method:'GET'
      })
      .then(response => response.json())
      .then(data => {
        this.setState({isAlive:true})
      }).catch((err) => {
        this.setState({isAlive:false})
        console.log(err);
      })
    }, 10000)
  }

  getStatusStyle(){
    let style = this.state.isAlive ? styles.up : styles.down;
    console.log('statusStyle', this.state.isAlive, style)
    return style;
  }
  render () {
    return (
      <Card>
        <CardHeader
          title="Server status"
          />
        <CardText>
          <span style={[styles.base, this.getStatusStyle()]}>{this.state.isAlive?"up":"down"}</span>
        </CardText>
      </Card>
    )
  }
}

export default ServerStatus
