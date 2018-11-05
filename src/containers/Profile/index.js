import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout, Spin } from 'antd';
import fecha from 'fecha';

import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesByUsername} from '../../actions/articles';
import {
  getKnacksteemUserData,
  updateKnacksteemUser,
  getRemoteUserData,
  getRemoteUserFollowData
} from '../../actions/user';
import {
  getRewardFund,
  getCurrentMedianHistoryPrice,
  getDynamicGlobalProperties,
  moderateUser
} from '../../actions/stats';
import { calculateVotePower, calculateVoteValue, uppercaseFirst, repLog10 } from '../../services/functions';

import ProfileCategoriesBar from './ProfileCategoriesBar';
import ProfileInfoBar from './ProfileInfoBar';
import ProfileHero from './ProfileHero';
import ProfileMetaBar from './ProfileMetaBar';

const styles = {
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    margin: '0 15px'

  }
};

const hasLoadedAll = (items) => {
  return Object.keys(items[0]).length > 0
        && Object.keys(items[1]).length > 0
        && Object.keys(items[2]).length > 0
        && Object.keys(items[3]).length > 0;
};

class Profile extends Component {
  
  handleModChoiceSelect(choice, action) {
    const {dispatch, match, user} = this.props;
    const {knacksteemUserObject} = user;
    let updatedRoles;

    const intention = choice === 'moderator' ? `${action}Moderator` : `${action}Supervisor`;
    
    if (action === 'remove') {
      updatedRoles = knacksteemUserObject.roles.filter(role => role !== choice);
    } else {
      updatedRoles = [...knacksteemUserObject.roles, choice];
    }

    let updatedKnacksteemUserObject = {
      ...knacksteemUserObject,
      roles: updatedRoles
    };

    dispatch(updateKnacksteemUser(updatedKnacksteemUserObject));
    dispatch(moderateUser(match.params.username, intention));
  }

  loadArticlesUser() {
    const {dispatch, match} = this.props;

    dispatch(getArticlesByUsername(match.params.username));
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

    dispatch(getKnacksteemUserData(match.params.username));
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
      displayName,
      name,
      reputation,
      location,
      signupDate,
      website,
      votingPower,
      voteValue,
      remoteUserObjectMeta;

    const {articles, user, stats, match} = this.props;
    const { remoteUserObject, knacksteemUserObject, remoteUserFollowObject } = user;
    const { rewardFundObject, dynamicGlobalPropertiesObject, currentMedianHistoryPriceObject } = stats;
    const hasLoadedRemoteUserObject = hasLoadedAll([
      knacksteemUserObject,
      remoteUserObject,
      rewardFundObject,
      dynamicGlobalPropertiesObject,
      currentMedianHistoryPriceObject
    ]);

    if (hasLoadedRemoteUserObject) {
      signupDate = fecha.format(
        fecha.parse(
          remoteUserObject.created.split('T')[0],
          'YYYY-MM-DD'
        ),
        'D MMMM YYYY'
      );
  
      remoteUserObjectMeta = JSON.parse(remoteUserObject.json_metadata).profile;
      name = remoteUserObjectMeta.name;
      displayName = name && name !== '' ? name : uppercaseFirst(match.params.username);
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
              name={displayName}
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
                name={displayName}
                about={about}
                location={location}
                website={website}
                votingPower={votingPower}
                voteValue={voteValue}
                signupDate={signupDate}
                onModChoiceSelect={(choice, action) => this.handleModChoiceSelect(choice, action)}
                user={knacksteemUserObject}
              />

              <div
                className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item"
                style={styles.articlesList}
              >
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
