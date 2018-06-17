import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Home from './containers/Home';
import Callback from './containers/Callback';
import 'antd/dist/antd.min.css';

const App = () => {
  return (
    <div>
      <Layout>
        <Sidebar/>
        <Layout>
          <Route exact path="/" component={Home} />
          <Route exact path="/callback" component={Callback} />
          <Route exact path="/categories/:category" component={Home} />
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
