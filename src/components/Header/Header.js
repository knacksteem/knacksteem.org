import React, { Component } from 'react';
import logo from '../../assets/images/logo.svg';

class Header extends Component {
  render() {
    return (
      <div className="flexBox row app-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Here is a header</p>
      </div>
    );
  }
}

export default Header;
