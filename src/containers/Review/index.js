import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {  Spin, Row } from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesModeration} from '../../actions/articles';


const styles = {
  articlesList: {display: 'flex', flexDirection: 'column', width: '80%'}
};

//Pending Overview
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
  }
  //scroll handler for lazy loading
  onScroll = () => {
    const {searchString} = this.state;
    const {articles} = this.props;

    //if in loading process, don´t do anything
    if (articles.isBusy) {
      return;
    }
    //if user hits bottom, load next batch of items
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if ((window.innerHeight + scrollTop) >= document.body.scrollHeight) {
      this.loadArticles(articles.data.length, searchString);
    }
  };
  componentDidMount() {
    this.loadArticles();

    //on scroll, load the next batch of articles
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount() {
    //remove scroll event again when hitting another route
    window.removeEventListener('scroll', this.onScroll);
  }
  loadArticles = (skip = 0, search) => {
    const {dispatch, location, user} = this.props;
    const username = user.isSupervisor ? undefined : user.username;
    dispatch(getArticlesModeration(location.pathname, skip, search, username));
  };
  render() {
    const {articles, location, user} = this.props;
    const path = location.pathname.replace('/moderation/', '')

    return (
      <Row type="flex" className="review-container" style={{width: '75%'}}>
          <div className="review-item ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
            {articles.data.map((data) => {
              return (
                <ArticleListItem key={data.permlink} data={data} user={user} status={path} onUpvoteSuccess={this.loadArticles} />
              );
            })}
            {(!articles.data.length && !articles.isBusy) && 
              (path==="pending" ? <div>No pending articles...</div> : <div>No reserved articles...</div>)
            }
          </div>
          {articles.isBusy && <Spin/>}
      </Row>
    );
  }
}

Review.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(Review));
