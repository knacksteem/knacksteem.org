import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Spin, Row, Col, Select } from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import AnnouncementMetaBar from '../Home/AnnouncementMetaBar';
import ContributionMetaBar from '../Home/ContributionMetaBar';
import { getArticlesModeration} from '../../actions/articles';
import {getRemoteUserData} from '../../actions/user';
import Cookies from 'js-cookie';
import SteemConnect from '../../services/SteemConnect';
import { repLog10 } from '../../services/functions';
const Option = Select.Option;

const styles = {
  articlesList: {display: 'flex', flexDirection: 'column', width: '50%'},
  barIcon: {
    fontSize: '16px',
    color: '#999',
    marginRight: '20px',
    fontWeight: 'bold'
  }
};

//Article Overview
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
    this.getOathURL = this.getOathURL.bind(this);
  }

  // //scroll handler for lazy loading
   onScroll = () => {
     const {articles} = this.props;

     //if in loading process, don´t do anything
     if (articles.isBusy) {
       return;
     }
     //   //if user hits bottom, load next batch of items
     const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
     if ((window.innerHeight + scrollTop) >= document.body.scrollHeight) {
       this.loadArticles(articles.data.length);
     }
   };
  //get User data
   loadRemoteUserData() {
     const {dispatch} = this.props;
     dispatch(getRemoteUserData(Cookies.get('username')));
   }

   getOathURL () {
     return SteemConnect.getLoginURL();
   }

   componentDidMount() {
     const username = Cookies.get('username');
     if (username === undefined || null){
       this.loadArticles();
     } else {
       this.loadArticles();
       this.loadRemoteUserData();
     }
     // //on scroll, load the next batch of articles
     window.addEventListener('scroll', this.onScroll);
   }
   componentWillUnmount() {
     //remove scroll event again when hitting another route
     window.removeEventListener('scroll', this.onScroll);
   }
  
  //load  approved general articles
  loadArticles = (skip = 0, ) => {
    const {dispatch} = this.props;

    dispatch(getArticlesModeration('/moderation/approved', skip));
  };

  render() {
    let 
      coverImage,
      name,
      reputation,
      remoteUserObjectMeta,
      username;

    const {articles, user} = this.props;
    const { remoteUserObject} = user;
    const hasLoadedRemoteUserObject = Object.keys(remoteUserObject).length > 0;

    if (hasLoadedRemoteUserObject) {
      remoteUserObjectMeta = JSON.parse(remoteUserObject.json_metadata).profile;
      name = remoteUserObjectMeta.name;
      coverImage = remoteUserObjectMeta.cover_image;
      reputation = repLog10(parseFloat(remoteUserObject.reputation)); 
      username = Cookies.get('username');
    }  

    return (
      <Layout className="home-container" justify="center">
        <Row type="flex" className="mobile-select" justify="center" style={{marginBottom: '20px', display: 'none'}}>
          <Col className="select-container" style={{width: '70%'}}>
            <Select
              style={{margin: 'auto', width: '100%'}}
              showSearch
              size={'large'}
              placeholder="Select from the list"
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="contribution"><i style={styles.barIcon} className="fas fa-bookmark"/>Contribution</Option>
              <Option value="review"><i style={styles.barIcon} className="fas fa-bookmark"/>Review</Option>
              <Option value="sponsor"><i style={styles.barIcon} className="fas fa-bookmark"/>Sponsor</Option>
              <Option value="moderator"><i style={styles.barIcon} className="fas fa-bookmark"/>Moderator</Option>
              <Option value="pending"><i style={styles.barIcon} className="fas fa-bookmark"/>Pending</Option>
              <Option value="reserved"><i style={styles.barIcon} className="fas fa-bookmark"/>Reserved</Option>
              <Option value="guidelines"><i style={styles.barIcon} className="fas fa-bookmark"/>Guidelines</Option>
              <Option value="faq"><i style={styles.barIcon} className="fas fa-bookmark"/>FAQ</Option>
              <Option value="tos"><i style={styles.barIcon} className="fas fa-bookmark"/>TOS</Option>
              <Option value="announcement"><i style={styles.barIcon} className="fas fa-bookmark"/>Announcement</Option>
              
            </Select>
          </Col>
            
        </Row>
        <Row type="flex" className="home-inner-container" justify="center">
          <Row type="flex" className="contribution-container">
            <Col>
              <ContributionMetaBar metaImage={coverImage} reputation={reputation} name={name}  handleLogin={this.getOathURL()} username={username}/>
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
  articles: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(Home));
