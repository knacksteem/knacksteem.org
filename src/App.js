import React from 'react';
import {Route} from 'react-router-dom';
import {Layout} from 'antd';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './containers/Home';
import NewContribution from './containers/NewContribution';
import ArticleDetail from './containers/ArticleDetail';
import Callback from './containers/Callback';
import 'antd/dist/antd.min.css';
import './assets/styles/index.css';
import './assets/styles/ant-overrides.css';

const App = () => {
  return (
    <Layout>
      <Sidebar/>
      <Layout>
        <Header/>
        <Route exact path="/" component={Home} />
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/mycontributions" component={Home} />
        <Route exact path="/new" component={NewContribution} />
        <Route exact path="/categories/:category" component={Home} />
        <Route exact path="/articles/:author/:permlink" component={ArticleDetail} />
      </Layout>
    </Layout>
  );
};

export default App;
