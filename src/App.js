import React from 'react';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Layout, Col, Row} from 'antd';
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
import Profile from './containers/Profile';
import Privacy from './containers/Privacy';
import 'antd/dist/antd.min.css';
import './assets/styles/index.css';
import './assets/styles/ant-overrides.css';
import Sponsors from './containers/Sponsors';
import Moderators from './containers/Moderators';
import Search from './containers/Search';
import ContributionMetaBar from './containers/ContributionMetaBar';
import './index.css';
const App = (props) => {
  return (
    <Layout id="page-layout">
      <KnackHeader/>
      <Route exact path="/@:username" component={Profile} />
      <Layout id="content-layout" style={{marginTop: '100px', display: 'flex', flexDirection: 'row'}}>
        <Row type="flex" justify="center" className="sidebar" style={{width:'25%', display: `${props.app.isSidebarVisible ? 'flex' : 'none'}`}}>
          <Col style={{position: 'fixed'}}>
            <ContributionMetaBar /> 
          </Col>
        </Row>
        <Route exact path="/" component={Home} />
        <Route exact path="/guidelines" component={Guidelines} />
        <Route exact path="/faq" component={FAQs} />
        <Route exact path="/tos" component={TermsOfService} />
        <Route exact path="/how" component={HowItWorks} />
        <Route exact path="/about" component={AboutUs} />
        <Route exact path="/privacy" component={Privacy} />
        <Route exact path="/contribute" component={Contribute} />
        <Route exact path="/contact" component={ContactUs} />
        <Route exact path="/moderation/pending" component={Review} />
        <Route exact path="/moderation/reserved" component={Review} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/sponsors" component={Sponsors} />
        <Route exact path="/moderators" component={Moderators} />
        <Route exact path="/callback" component={Callback} />
        <Route exact path="/feeds" component={Home} />
        <Route exact path="/new" component={NewContribution} />
        <Route exact path="/categories/:category" component={Home} />
        <Route exact path="/articles/:author/:permlink" component={ArticleDetail} />
        <Route exact path="/search" component={Search} />
      </Layout>
      <KnackFooter/>
    </Layout>
  );
};

const mapStateToProps = state => ({
  articles: state.articles,
  app: state.app
});

export default withRouter(connect(mapStateToProps)(App));

