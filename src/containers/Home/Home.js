import React, { Component } from 'react';
import './Home.scss';
import sc2 from 'sc2-sdk';

class Home extends Component {
  getOathURL(){
    let api = sc2.Initialize({
        app: 'knacksteem.app',
        callbackURL: 'http://localhost:3000/callback',
        scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });
    return api.getLoginURL();
  }
  render() {
    return (
      <div className="App">
        <a href={this.getOathURL()}>Login</a>
      </div>
    );
  }
}

export default Home;
