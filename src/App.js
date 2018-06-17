import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Home from './containers/Home';

const App = () => {
  return (
    <div>
      <Layout>
        <Sidebar/>
        <Layout>
          <Route exact path="/" component={Home} />
          <Route exact path="/categories/:category" component={Home} />
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
