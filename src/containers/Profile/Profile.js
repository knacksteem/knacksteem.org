import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout, Spin } from 'antd';

import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesByUser} from '../../actions/articles';

import ProfileCategoriesBar from '../Profile/ProfileCategoriesBar';
import ProfileInfoBar from '../Profile/ProfileInfoBar';
import ProfileHero from '../Profile/ProfileHero';
import ProfileMetaBar from '../Profile/ProfileMetaBar';

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
          <Layout>
            <ProfileMetaBar/>
          </Layout>
          
          <Layout id="content-layout">
            <ProfileInfoBar/>

            <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
              {articles.data.map((data) => {
                return (
                  <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticlesUser} />
                );
              })}
            </div>
            <ProfileCategoriesBar categories={articles.categories}/>

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