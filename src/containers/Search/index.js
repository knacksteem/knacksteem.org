import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Spin, List} from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesBySearchTerm} from '../../actions/articles';
import {getUserListBySearch} from '../../actions/stats';
const { Content} = Layout;


const styles = {
  articlesList: {display: 'flex', flexDirection: 'column'}
};

// We are directly taking the query from the query string and setting the state
class Search extends Component {
  constructor(props) {
    const query = new URLSearchParams(props.location.search); 
    super(props);
    this.state = {
      searchString: query.get('q')
    };

  }
  // Not tested yet, but this is same as Article List
  onScroll = () => {
    const {searchString} = this.state;
    const {articles} = this.props;
    if (articles.isBusy) {
      return;
    }
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if ((window.innerHeight + scrollTop) >= document.body.scrollHeight && searchString !== '') {
		  this.loadArticlesBySearchTerm(0, searchString);
    }
  };

  // Calling both the Load Articles and Load Users by Search Term
  componentDidMount() {
  	  const {searchString} = this.state;
      if (searchString !== '') {
        this.loadArticlesBySearchTerm(0, searchString);
        this.loadUsersBySearchTerm(0, searchString)
      }
  }

  loadArticlesBySearchTerm = (skip = 0, search) => {
     const {dispatch} = this.props;
	   dispatch(getArticlesBySearchTerm(skip, search));
  };

  loadUsersBySearchTerm = (skip = 0, search) => {
     const {dispatch} = this.props;
     dispatch(getUserListBySearch(skip, search));
  };

  render() {
    const {articles, stats} = this.props;
    const {users} = stats;

    return (
      <div id="home-body">
        <Layout id="home-articles">
          <Content>
            <h2>Posts</h2>
            <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
                  {articles.data.map((data) => {
                    return (
                      <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticlesBySearchTerm} />
                    );
                  })}
            </div>
            {articles.isBusy && <Spin/>}
          </Content>
          <Content>
          <h2>Users</h2>
          { <List
              dataSource={users}
              renderItem={item => {
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<div className="avatar" style={{backgroundImage: `url(https://steemitimages.com/u/${item.username}/avatar)`}} />}
                      title={<a href={`https://www.steemit.com/@${item.username}`}>{item.username}</a> } >
                    </List.Item.Meta>
                  </List.Item>
                );
              }} /> 
          }
          </Content>
        </Layout>
      </div>
    );
  }
}

Search.propTypes = {
  dispatch: PropTypes.func,
  articles: PropTypes.object,
  stats: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles,
  stats: state.stats
});

export default withRouter(connect(mapStateToProps)(Search));