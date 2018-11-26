import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import { Spin, Row, Col, Select } from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import AnnouncementMetaBar from '../Home/AnnouncementMetaBar';
import { getArticlesModeration} from '../../actions/articles';
import Cookies from 'js-cookie';

const Option = Select.Option;
const styles = {
  articlesList: {display: 'flex', flexDirection: 'column', width: '70%'},
  barIcon: {
    fontSize: '16px',
    color: '#999',
    marginRight: '20px',
    fontWeight: 'bold'
  }
};

/**
 *  @class Home
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
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
   


   componentDidMount() {
     const username = Cookies.get('username');
     if (username === undefined || null){
       this.loadArticles();
     } else {
       this.loadArticles();
     }
     // //on scroll, load the next batch of articles
     window.addEventListener('scroll', this.onScroll);
   }

   componentWillUnmount() {
     //remove scroll event again when hitting another route
     window.removeEventListener('scroll', this.onScroll);
   }
  
   /** load articles that are approved by a mod
    * 
    * @method loadArticles
    * 
    * @param {Integer}  
    * 
    * @returns {Array}
    */
   
  loadArticles = (skip = 0, ) => {
    const {dispatch} = this.props;

    dispatch(getArticlesModeration('/moderation/approved', skip));
  };

  render() {

    const {articles} = this.props;
 

    return (
      <Row type="flex" className="home-container" justify="right">
        <Row type="flex" className="home-inner-container" justify="right">
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
      </Row>
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
