import React, { Component } from 'react';
import sc2 from 'sc2-sdk';
import qs from 'qs';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Editor from '../Editor/Editor';

class Home extends Component {
  getMe(){
    let api = sc2.Initialize({
        app: 'knacksteem.app',
        callbackURL: 'http://localhost:3000/callback',
        accessToken: qs.parse(this.props.location.search)["?access_token"],
        scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });
    api.me(function (err, res) {
      console.log(err, res)
    });
  }
  render() {
    this.getMe();
    return (
      <div className="App">
        Loading..
      </div>
    );
  }
}

export default Home;
