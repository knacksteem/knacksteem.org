import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout, Spin } from 'antd';

import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesByUsername} from '../../actions/articles';
import {getRemoteUserData, getRemoteUserFollowData} from '../../actions/user';
import {getRewardFund, getCurrentMedianHistoryPrice, getDynamicGlobalProperties} from '../../actions/stats';
import { calculateVotePower, calculateVoteValue, repLog10 } from '../../services/functions';

import AnnoucementMetaBar from '../Home/AnnouncementMetaBar';
import ContributionMetaBar from '../Home/ContributionMetaBar';


const styles = {
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px'
  }
};

class Home extends Component {
  
  constructor() {
    super()
  }

  render () {


    const {articles, user, stats, match} = this.props;
    

       return (
      <div>        
        <section style={{minHeight: 1080}}>
           
          <div>
            <Layout id="content-layout">
              
              <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
                {articles.data.map((data) => {
                  return (
                    <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticlesUser} />
                  );
                })}
              </div>

              {!articles.data.length && (
                <div style={{ flex: 4, marginTop: '20px', marginRight: '20px', padding: '30px', background: '#fff' }}>
                  No articles found for this user.
                </div>
              )}

              

              {articles.isBusy && <Layout><Spin/></Layout>}
            </Layout>
          </div>
          
        </section>
      </div>
    );
  }
}

Home.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  user: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object,
  stats: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user,
  stats: state.stats
});

export default withRouter(connect(mapStateToProps)(Home));