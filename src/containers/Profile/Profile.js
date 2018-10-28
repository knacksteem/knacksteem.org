import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ArticleListItem from '../../components/ArticleListItem';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout, Spin } from 'antd';
import {getArticlesByUser} from '../../actions/articles';

const styles = {
  articlesList: {display: 'flex', flexDirection: 'column'}
};

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  loadArticlesUser() {
    const {dispatch} = this.props;

    dispatch(getArticlesByUser());
  }

  componentDidMount() {
    this.loadArticlesUser();
  }

  render () {
    const {articles} = this.props;

    return (
      <Layout.Content style={{minHeight: 1080}}>
        <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
          {articles.data.map((data) => {
            return (
              <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticles} />
            );
          })}
        </div>
        {articles.isBusy && <Spin/>}

      </Layout.Content>
    );
  }
}

Profile.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(Profile));