import React, { Component } from 'react';
//import { Route, Link } from 'react-router-dom';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
//import Home from '../Home/Home';
//import About from '../About/About';
//import Callback from '../Callback/Callback';

class ContainersWrapper extends Component {
  render() {
    return (
      <div>
        {/*<header>
          <Link to="/">Home</Link>
          <Link to="/about-us">About</Link>
        </header>

        <main>
          <Route exact path="/" component={Home} />
          <Route exact path="/callback" component={Callback} />
          <Route exact path="/about-us" component={About} />
        </main>*/}
        <Layout>
          <Sider>Sider</Sider>
          <Layout>
            <Header>Header</Header>
            <Content>Content</Content>
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default ContainersWrapper;
