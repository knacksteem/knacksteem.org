import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Input, Spin} from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesModeration} from '../../actions/articles';
const {Header, Content} = Layout;
const Search = Input.Search;

const styles = {
  articlesList: {display: 'flex', flexDirection: 'column'}
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
    const {dispatch, location} = this.props;
    dispatch(getArticlesModeration(location.pathname, skip, search));
  };
  render() {
    const {articles, location, user} = this.props;

    return (
      <div>
        <Header>
          <Search
            placeholder="Search through Knacksteem"
            onSearch={value => this.setState({searchString: value})}
            style={{width: 300}}
          />
        </Header>
        <Content style={{minHeight: 1080}}>
          <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
            {articles.data.map((data) => {
              return (
                <ArticleListItem key={data.permlink} data={data} user={user} status={location.pathname.replace('/moderation/', '')} onUpvoteSuccess={this.loadArticles} />
              );
            })}
            {(!articles.data.length && !articles.isBusy) && <div>No pending articles...</div>}
          </div>
          {articles.isBusy && <Spin/>}
        </Content>
      </div>
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
