import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout, Spin } from 'antd';

import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesByUser} from '../../actions/articles';
import {getRemoteUserData, getRemoteUserFollowData} from '../../actions/user';
import {getRewardFund, getCurrentMedianHistoryPrice, getDynamicGlobalProperties} from '../../actions/stats';
import { calculateVotePower, calculateVoteValue, repLog10 } from '../../services/functions';

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

  loadSteemRewardFunds() {
    const {dispatch} = this.props;

    dispatch(getRewardFund());
  }

  loadCurrentMedianHistoryPrice() {
    const {dispatch} = this.props;

    dispatch(getCurrentMedianHistoryPrice());
  }

  loadDynamicGlobalProperties() {
    const {dispatch} = this.props;

    dispatch(getDynamicGlobalProperties());
  }

  loadRemoteUserData() {
    const {dispatch, match} = this.props;

    dispatch(getRemoteUserData(match.params.username));
    dispatch(getRemoteUserFollowData(match.params.username));
  }

  componentDidMount() {
    this.loadArticlesUser();
    this.loadSteemRewardFunds();
    this.loadCurrentMedianHistoryPrice();
    this.loadDynamicGlobalProperties();
    this.loadRemoteUserData();
  }

  render () {
    let 
      about,
      coverImage,
      name,
      reputation,
      location,
      website,
      votingPower,
      voteValue,
      remoteUserObjectMeta;

    const {articles, user, stats, match} = this.props;
    const { remoteUserObject, remoteUserFollowObject } = user;
    const { rewardFundObject, dynamicGlobalPropertiesObject, currentMedianHistoryPriceObject } = stats;

    const hasLoadedRemoteUserObject = Object.keys(remoteUserObject).length > 0;
    const hasLoadedRewardFundObject = Object.keys(rewardFundObject).length > 0;
    const hasLoadedDynamicGlobalPropertiesObject = Object.keys(dynamicGlobalPropertiesObject).length > 0;
    const hasLoadedCurrentMedianHistoryPriceObject = Object.keys(currentMedianHistoryPriceObject).length > 0;

    if (hasLoadedRemoteUserObject
        && hasLoadedRewardFundObject
        && hasLoadedDynamicGlobalPropertiesObject
        && hasLoadedCurrentMedianHistoryPriceObject
    ) {
      remoteUserObjectMeta = JSON.parse(remoteUserObject.json_metadata).profile;
      name = remoteUserObjectMeta.name;
      location = remoteUserObjectMeta.location;
      website = remoteUserObjectMeta.website;
      coverImage = remoteUserObjectMeta.cover_image;
      about = remoteUserObjectMeta.about;
      reputation = repLog10(parseFloat(remoteUserObject.reputation));
      votingPower = calculateVotePower(remoteUserObject.voting_power, remoteUserObject.last_vote_time).votePower;

      voteValue=calculateVoteValue({
        votingPower: remoteUserObject.voting_power,
        lastVoteTime: remoteUserObject.last_vote_time,
        rewardBalance: rewardFundObject.reward_balance,
        recentClaims: rewardFundObject.recent_claims,
        currentMedianHistoryPrice: currentMedianHistoryPriceObject,
        vestingShares: remoteUserObject.vesting_shares,
        receivedVestingShares: remoteUserObject.received_vesting_shares,
        delegatedVestingShares: remoteUserObject.delegated_vesting_shares,
        totalVestingFundSteem: dynamicGlobalPropertiesObject.total_vesting_fund_steem,
        totalVestingShares: dynamicGlobalPropertiesObject.total_vesting_shares
      });
    }

    return (
      <div>        
        <section style={{minHeight: 1080}}>
          {hasLoadedRemoteUserObject && <div>
            <ProfileHero
              style={{
                marginTop: '-31px'
              }}
              coverImage={coverImage}
              username={match.params.username}
              name={name}
              reputation={reputation}
            />
            <Layout>
              <ProfileMetaBar
                followersCount={remoteUserFollowObject.follower_count}
                followingCount={remoteUserFollowObject.following_count}
              />
            </Layout>
            
            <Layout id="content-layout">
              <ProfileInfoBar
                about={about}
                location={location}
                website={website}
                votingPower={votingPower}
                voteValue={voteValue}
              />

              <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
                {articles.data.map((data) => {
                  return (
                    <ArticleListItem key={data.permlink} data={data} onUpvoteSuccess={this.loadArticlesUser} />
                  );
                })}
              </div>
              <ProfileCategoriesBar categories={articles.categories}/>

              {articles.isBusy && <Layout><Spin/></Layout>}
            </Layout>
          </div>}
          {!hasLoadedRemoteUserObject && <Spin/>}
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
  articles: PropTypes.object,
  stats: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user,
  stats: state.stats
});

export default withRouter(connect(mapStateToProps)(Profile));