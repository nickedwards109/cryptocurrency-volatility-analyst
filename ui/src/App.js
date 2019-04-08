import React, { Component } from 'react';
import './App.css';
import Websocket from 'react-websocket';

class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          volatility: 0
        };
      }

      handleWebSocketMessage(rawData) {
        let data = JSON.parse(rawData);
        let volatility = data.volatility;
          this.setState({ volatility: volatility });
      }

      render() {
        return (
          <div>
            Volatility: <strong>{this.state.volatility}</strong>

            <Websocket url='ws://localhost:3000'
                onMessage={this.handleWebSocketMessage.bind(this)}/>
          </div>
        );
      }
}

export default App;
