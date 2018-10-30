import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout, Spin } from 'antd';

import ProfileInfoBar from './ProfileInfoBar';
import ProfileCategoriesBar from './ProfileCategoriesBar';
import ArticleListItem from '../../components/ArticleListItem';
import ProfileHero from './ProfileHero';
import {getArticlesByUser} from '../../actions/articles';

const styles = {
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px'
  }
};

class Profile extends Component {
  
  loadArticlesUser() {
    const {dispatch} = this.props;

    dispatch(getArticlesByUser());
  }

  componentDidMount() {
    this.loadArticlesUser();
  }

  render () {
    const {articles, user} = this.props;

    return (
      <div>
        <section style={{minHeight: 1080}}>
          <ProfileHero style={{
            marginTop: '-31px'
          }} user={user} />
          <Layout id="content-layout">
            <ProfileInfoBar/>

            <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
              {articles.data.map((data) => {
                return (
                  <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticlesUser} />
                );
              })}
            </div>
            <ProfileCategoriesBar/>

            {articles.isBusy && <Spin/>}
          </Layout>

        </section>
      </div>
    );
  }
}

Profile.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user
});

export default withRouter(connect(mapStateToProps)(Profile));