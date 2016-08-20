import React, { Component } from 'react';
import { GridStack, GridStackItem } from 'react-gridstack'
import Temperature from './Sensors/Temperature'
import ServerStatus from './common/ServerStatus'


class App extends Component {
  render() {
    return (
      <GridStack cellHeight={50} verticalMargin={10}>
        <GridStackItem
          id="item_1"
          x={0}
          y={0}
          minHeight={2}
          minWidth={2}>
          <ServerStatus />
        </GridStackItem>
        <GridStackItem id="item_2" x={0} y={2}>
          <Temperature size={{width:4,height:2}} />
        </GridStackItem>
      </GridStack>
    );
  }
}

export default App;
