import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Spin, Row, Col } from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import AnnouncementMetaBar from '../Home/AnnouncementMetaBar'
import ContributionMetaBar from '../Home/ContributionMetaBar'
import {getArticlesByCategory, getArticlesByUser} from '../../actions/articles';
import {getRemoteUserData} from '../../actions/user';
import { repLog10 } from '../../services/functions';


const styles = {
  articlesList: {display: 'flex', flexDirection: 'column', width: '50%'}
};

//Article Overview
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
  }
  //scroll handler for lazy loading
  onScroll = () => {
    const {searchString} = this.state;
    const {articles, location} = this.props;

    //if in loading process, don´t do anything
    if (articles.isBusy) {
      return;
    }
    //if user hits bottom, load next batch of items
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if ((window.innerHeight + scrollTop) >= document.body.scrollHeight) {
      if (location.pathname === '/mycontributions') {
        this.loadArticlesUser(articles.data.length, searchString);
      } else {
        this.loadArticles(articles.data.length, searchString);
      }
    }
  };
//get User data
  loadRemoteUserData() {
    const {dispatch} = this.props;
    dispatch(getRemoteUserData('knacksteemtest'));
  
  }

  componentDidMount() {
    const {location,user} = this.props;

    if (location.pathname === '/mycontributions') {
      this.loadArticlesUser();
    } else {
      this.loadArticles();
    }

    //on scroll, load the next batch of articles
    window.addEventListener('scroll', this.onScroll);
    this.loadRemoteUserData();
  }
  componentWillUnmount() {
    //remove scroll event again when hitting another route
    window.removeEventListener('scroll', this.onScroll);
  }
  componentDidUpdate(prevProps, prevState) {
    const {searchString} = this.state;
    const {location} = this.props;

    if (prevProps.location.pathname !== location.pathname || searchString !== prevState.searchString) {
      //location change detected, load new data
      if (location.pathname === '/mycontributions') {
        this.loadArticlesUser(0, searchString);
      } else {
        this.loadArticles(0, searchString);
      }
    }
  }
  //load general articles
  loadArticles = (skip = 0, search) => {
    const {dispatch, match} = this.props;

    dispatch(getArticlesByCategory(match.params.category, skip, search));
  };
  //load own contributions
  loadArticlesUser = (skip = 0, search) => {
    const {dispatch} = this.props;

    dispatch(getArticlesByUser(skip, search));
  };
  render() {
    let 
      coverImage,
      name,
      reputation,
      remoteUserObjectMeta;

    const {articles, user} = this.props
    const { remoteUserObject} = user;
    const hasLoadedRemoteUserObject = Object.keys(remoteUserObject).length > 0;

    if (hasLoadedRemoteUserObject) {
      remoteUserObjectMeta = JSON.parse(remoteUserObject.json_metadata).profile;
      name = remoteUserObjectMeta.name;
      coverImage = remoteUserObjectMeta.cover_image;
      reputation = repLog10(parseFloat(remoteUserObject.reputation)); 
      console.log(remoteUserObjectMeta);
    }  
    


    return (
        <Layout className="home-container" justify="center">
          <Row type="flex" className="home-inner-container" justify="center">
              <Row type="flex" className="contribution-container">
                <Col>
                  <ContributionMetaBar metaImage={coverImage} reputation={reputation} name={name} username={'sirfreeman'}/>
                </Col>
              </Row>
              <Row className="item-feed ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
                {articles.data.map((data) => {
                  return (
                    <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticles} />
                  );
                })}
              </Row>
              <Row type="flex" className="announcement-container">
                <Col>
                  <AnnouncementMetaBar/>
                </Col>
              </Row>
              {articles.isBusy && <Spin/>}
          </Row>
        </Layout>
    );
  }
}

Home.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user,
});


export default withRouter(connect(mapStateToProps)(Home));
