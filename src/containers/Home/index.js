import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import './Home.scss';
import sc2 from 'sc2-sdk';
import { Layout } from 'antd';
const { Header, Content } = Layout;

class Home extends Component {
  constructor({history, location}) {
    super();
    console.log(history, location);
  }
  getOathURL() {
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
        <Header>
          Header
          {/*<div className="flexBox row app-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Here is a header</p>
          </div>*/}
        </Header>
        <Content>
          Content
        </Content>
        {/*<a href={this.getOathURL()}>Login</a>*/}
      </div>
    );
  }
}

export default withRouter(Home);
