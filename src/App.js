import React from 'react';
import {Route} from 'react-router-dom';
import {Layout} from 'antd';
import KnackHeader from './components/Header';
import Home from './containers/Home';
import Guidelines from './containers/Guidelines';
import FAQs from './containers/FAQs';
import TermsOfService from './containers/TermsOfService';
import HowItWorks from './containers/HowItWorks';
import AboutUs from './containers/AboutUs';
import Contribute from './containers/Contribute';
import ContactUs from './containers/ContactUs';
import NewContribution from './containers/NewContribution';
import ArticleDetail from './containers/ArticleDetail';
import Callback from './containers/Callback';
import Review from './containers/Review';
import Users from './containers/Users';
import KnackFooter from './components/Footer';
=======
import 'antd/dist/antd.min.css';
import './assets/styles/index.css';
import './assets/styles/ant-overrides.css';

const App = () => {
  return (
    <Layout id="page-layout">
      <KnackHeader/>
      <Layout id="content-layout">
=======
        <Route exact path="/" component={Home} />
        <Route exact path="/guidelines" component={Guidelines} />
        <Route exact path="/faq" component={FAQs} />
        <Route exact path="/tos" component={TermsOfService} />
        <Route exact path="/how" component={HowItWorks} />
        <Route exact path="/about" component={AboutUs} />
        <Route exact path="/contribute" component={Contribute} />
        <Route exact path="/contact" component={ContactUs} />
        <Route exact path="/moderation/pending" component={Review} />
        <Route exact path="/moderation/reserved" component={Review} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/mycontributions" component={Home} />
        <Route exact path="/new" component={NewContribution} />
        <Route exact path="/categories/:category" component={Home} />
        <Route exact path="/articles/:author/:permlink" component={ArticleDetail} />
      </Layout>
      <KnackFooter/>
=======
    </Layout>
  );
};

export default App;
