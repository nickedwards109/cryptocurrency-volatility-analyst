import React, { Component } from 'react';
import './App.css';
import Websocket from 'react-websocket';

class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          marketPrice: 0,
          volatility: 0
        };
      }

      handleWebSocketMessage(rawData) {
        let data = JSON.parse(rawData);
        console.log(data);
        let marketPrice = data.marketPrice;
        let volatility = data.volatility;
          this.setState({
            marketPrice: marketPrice,
            volatility: volatility
          });
      }

      render() {
        return (
          <div>
            Market Price: <strong>{this.state.marketPrice}</strong><br/>
            Volatility: <strong>{this.state.volatility}</strong>

            <Websocket url='ws://localhost:3000'
                onMessage={this.handleWebSocketMessage.bind(this)}/>
          </div>
        );
      }
}

export default App;
