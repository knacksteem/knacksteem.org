import React, { Component } from 'react';
import { Layout } from 'antd';
import logo from '../../assets/images/logo.svg';
const { Header } = Layout;

class Header extends Component {
  render() {
    return (
      <Header>
        Header
        {/*<div className="flexBox row app-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Here is a header</p>
        </div>*/}
      </Header>
    );
  }
}

export default Header;
