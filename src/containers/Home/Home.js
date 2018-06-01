import React, { Component } from 'react';
import './Home.scss';
import sc2 from 'sc2-sdk';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Editor from '../Editor/Editor';

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

        <Header/>
        <a href={this.getOathURL()}>Login</a>
        <Editor/>
        <Footer/>

      </div>
    );
  }
}

export default Home;
