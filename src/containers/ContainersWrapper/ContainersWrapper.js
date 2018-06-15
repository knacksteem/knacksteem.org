import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Home from '../Home/Home';
import About from '../About/About';
import Callback from '../Callback/Callback';

class ContainersWrapper extends Component {
  render() {
    return (
      <div>
        <header>
          <Link to="/">Home</Link>
          <Link to="/about-us">About</Link>
        </header>

        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/callback" component={Callback} />
          <Route exact path="/about-us" component={About} />
        </main>
      </div>
    );
  }
}

export default ContainersWrapper;
