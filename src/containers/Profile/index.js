import React, {Component} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Button, Layout, Spin, Row, Col } from 'antd';
import fecha from 'fecha';
import './index.css';

// Profile core components.
import ProfileCategoriesBar from './ProfileCategoriesBar';
import ProfileInfoBar from './ProfileInfoBar';
import ProfileHero from './ProfileHero';
import ProfileMetaBar from './ProfileMetaBar';

import ArticleListItem from '../../components/ArticleListItem';
import BanModal from '../../components/BanModal';

import {
  getArticlesByUsername,
  getArticlesModeration
} from '../../actions/articles';

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
import {
  calculateVotePower,
  calculateVoteValue,
  containsEmptyMap,
  uppercaseFirst,
  repLog10
} from '../../services/functions';

// CSS styles in concise maps for reference.
const styles = {
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  }
};

const MASTER_SUPERVISOR = 'knowledges';

class Profile extends Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    user: PropTypes.object,
    dispatch: PropTypes.func,
    articles: PropTypes.object,
    stats: PropTypes.object
  };

  state = {
    isBanModalOpen: false,
    banReason: '',
    banDuration: 1000,
    filterBy: '',
    skipArticles: 0,
    limit: 25
  };

  handleMoreArticlesLoading(category) {
    let skipArticles = this.state.skipArticles + this.state.limit;
    this.setState({
      skipArticles
    });
    
    this.loadArticlesUser(category, skipArticles);
  }

  /**
   * Toggles the ban modal visibility on and off.
   * 
   * @method handleBanModalStatusToggle
   * 
   * @return {void}
   */
  handleBanModalStatusToggle() {
    this.setState(({ isBanModalOpen }) => {
      return {
        isBanModalOpen: !isBanModalOpen
      };
    });
  }

  /**
   * Toggles the ban status of a user.
   * 
   * @method handleBanStatusToggle
   * 
   * @return {void}
   */
  handleBanStatusToggle() {
    const {dispatch, match, user} = this.props;
    const { banDuration, banReason } = this.state;
    const {knacksteemUserObject} = user;

    const intention = knacksteemUserObject.isBanned ? 'unban' : 'ban';

    if (intention === 'ban' && banReason.length <= 10) {
      this.setState({
        isBanModalOpen: true
      });
      return false;
    }

    let updatedKnacksteemUserObject = {
      ...knacksteemUserObject,
      isBanned: !knacksteemUserObject.isBanned
    };

    dispatch(moderateUser(
      match.params.username,
      intention,
      banReason,
      banDuration || 1000000
    ));

    dispatch(updateKnacksteemUser(updatedKnacksteemUserObject));

    if (intention === 'ban') {
      this.setState({
        banReason: '',
        isBanModalOpen: false
      });
    }
  }

  /**
   * Sets articles filter criteria.
   * 
   * @method handleArticlesFilterSelect
   * @param {String} filterBy - Criteria to filter articles by. Example: 'accepted' or 'pending'. 
   * 
   * @return {void}
   */
  handleArticlesFilterSelect(filterBy) {
    const {dispatch, match} = this.props;
    let moderationEndpoints = {
      'accepted': '/moderation/approved',
      'pending': '/moderation/pending',
      'declined': '/moderation/not-approved',
    };

    this.setState({
      filterBy
    });

    if (filterBy !== '') {
      dispatch(
        getArticlesModeration(
          moderationEndpoints[filterBy],
          0,
          '',
          match.params.username
        )
      );
    } else {
      let { category } = queryString.parse(this.props.location.search);

      this.loadArticlesUser(category);  
    }

  }

  /**
   * Sets or removes moderation roles. Sets user as moderator or supervisor.
   * 
   * @method handleModChoiceSelect
   * @param {String} choice - Moderator choice selected. Example: 'moderator' or 'supervisor'. 
   * @param {String} action - Action to carry out. Example: 'remove' or 'add'.
   * 
   * @return {void}
   */
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

  /**
   * Load articles created by a specified user from the Knacksteem backend.
   * 
   * @method loadArticlesUser
   * @param {String} category - Category of user articles to load.
   * 
   * @return {void}
   */
  loadArticlesUser(category, skip, limit = this.state.limit) {
    const {dispatch, match} = this.props;
    const search = undefined;

    dispatch(
      getArticlesByUsername(
        match.params.username,
        skip || undefined,
        search,
        category,
        limit
      )
    );
  }

  /**
   * Load STEEM reward funds from the STEEM api.
   * 
   * @method loadSteemRewardFunds
   * 
   * @return {void}
   */
  loadSteemRewardFunds() {
    const {dispatch} = this.props;

    dispatch(getRewardFund());
  }

  /**
   * Loads the current median history price for STEEM from the STEEM api.
   * 
   * @method loadCurrentMedianHistoryPrice
   * 
   * @return {void}
   */
  loadCurrentMedianHistoryPrice() {
    const {dispatch} = this.props;

    dispatch(getCurrentMedianHistoryPrice());
  }

  /**
   * Loads dynamic global properties for STEEM from the STEEM api.
   * 
   * @method loadDynamicGlobalProperties
   * 
   * @return {void}
   */
  loadDynamicGlobalProperties() {
    const {dispatch} = this.props;

    dispatch(getDynamicGlobalProperties());
  }

  /**
   * Loads user data from the Knacksteem backend for the profile being viewed.
   * 
   * @method loadRemoteUserData
   * 
   * @return {void}
   */
  loadRemoteUserData() {
    const {dispatch, match} = this.props;

    dispatch(getKnacksteemUserData(match.params.username));
    dispatch(getRemoteUserData(match.params.username));
    dispatch(getRemoteUserFollowData(match.params.username));
  }

  renderProfile ({
    about,
    activeCategory,
    articles,
    articlesList,
    coverImage,
    displayName,
    hasLoadedRemoteUserObject,
    loadArticles,
    match,
    location,
    knacksteemUserObject,
    signupDate,
    reputation,
    userObject,
    remoteUserFollowObject,
    voteValue,
    votingPower,
    website
  }) {
    return (
      <div style={{marginTop: '75px'}}>
        <section style={{minHeight: 1080}}>
          {hasLoadedRemoteUserObject
            && 
          <div>
            <BanModal
              name={displayName}
              isVisible={this.state.isBanModalOpen}
              isBanSubmitDisabled={this.state.banReason.length <= 10}
              banReason={this.state.banReason}
              onCloseBanModal={() => this.handleBanModalStatusToggle()}
              onSubmitBanModal={() => this.handleBanStatusToggle()}
              onBanReasonInputChange={(e) => this.setState({
                banReason: e.target.value
              })}
              onBanDurationInputChange={(value) => this.setState({
                banDuration: value
              })}
            />
            <ProfileHero
              style={{
                marginTop: '-31px'
              }}
              coverImage={coverImage}
              username={match.params.username}
              name={displayName}
              reputation={reputation}
            />
            <Layout >
              <ProfileMetaBar
                followersCount={remoteUserFollowObject.follower_count}
                followingCount={remoteUserFollowObject.following_count}
                username={match.params.username}
                onArticlesFilterSelect={filterBy => this.handleArticlesFilterSelect(filterBy)}
                filterBy={this.state.filterBy}
              />
            </Layout>
            <Row type="flex" justify="center" style={{marginTop: '30px'}}>
              <Row className="profile-bar">
                <Col>
                  <ProfileInfoBar
                    name={displayName}
                    about={about}
                    location={location}
                    website={website}
                    votingPower={votingPower}
                    voteValue={voteValue}
                    signupDate={signupDate}
                    user={knacksteemUserObject}
                    banReason={this.state.banReason}
                    banDuration={this.state.banDuration}
                    onModChoiceSelect={(choice, action) => this.handleModChoiceSelect(choice, action)}
                    onBanButtonClick={() => this.handleBanStatusToggle()}
                    isMasterSupervisor={
                      Object.keys(userObject).length > 0
                      && userObject.username === MASTER_SUPERVISOR
                      && match.params.username !== MASTER_SUPERVISOR
                    }
                  />
                </Col>
              </Row>
              {articlesList.length &&
                <Row className="item-feed ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
                  <div>
                    {articlesList.map((data) => {
                      return (
                        data.author === match.params.username
                      && (
                        <ArticleListItem
                          key={data.permlink}
                          data={data}
                          onUpvoteSuccess={loadArticles}
                        />
                      )
                      );
                    })}
                  </div>
                  {(articles.isBusy && (
                    <div style={{ marginBottom: '30px' }}>
                      <Layout><Spin/></Layout>
                    </div>
                  ))}

                  <div style={{ margin: '0 auto' }}>
                    <Button
                      size={'default'}
                      onClick={() => this.handleMoreArticlesLoading(activeCategory)}
                      style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
                      Load more
                    </Button>
                  </div>
                </Row>
              }
              
              {!articlesList.length && (
                <Row style={{width: '50%', margin: '30px'}}>
                  <div style={{padding: '30px', background: '#fff',}}>
                    {articles.isBusy ? 
                      <Layout><Spin/></Layout> :
                      <p style={{textAlign: 'center'}}>No articles found.</p>
                    }                  
                  </div>
                </Row>
              )}
              
              <Row className="category-bar">
                <Col>
                  <ProfileCategoriesBar
                    activeCategory={activeCategory}
                    categories={articles.categories}
                    username={match.params.username}
                    onShowAllCategories={() => this.props.history.push(`/@${match.params.username}`)}
                  />
                </Col>
              </Row>
            </Row>
          </div>}
          {!hasLoadedRemoteUserObject && <Spin/>}
        </section>
      </div>
    );
  }

  componentDidMount() {
    const { location, history } = this.props;

    let { category } = queryString.parse(location.search);

    this.loadArticlesUser(category);
    this.loadSteemRewardFunds();
    this.loadCurrentMedianHistoryPrice();
    this.loadDynamicGlobalProperties();
    this.loadRemoteUserData();

    history.listen(newLocation => {
      let newCategory = queryString.parse(newLocation.search).category;

      this.loadArticlesUser(newCategory, 0);
    });
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
    const { userObject, remoteUserObject, knacksteemUserObject, remoteUserFollowObject } = user;
    const { rewardFundObject, dynamicGlobalPropertiesObject, currentMedianHistoryPriceObject } = stats;
    const hasLoadedRemoteUserObject = !containsEmptyMap([
      // knacksteemUserObject,
      remoteUserObject,
      rewardFundObject,
      dynamicGlobalPropertiesObject,
      currentMedianHistoryPriceObject
    ]);

    const activeCategory = queryString.parse(this.props.location.search).category;

    const articlesList = typeof activeCategory !== 'undefined' ?
      articles.data.filter(article => article.category === activeCategory) : 
      articles.data;

    // If we've loaded all core objects...
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

    return this.renderProfile({
      about,
      activeCategory,
      articles,
      articlesList,
      coverImage,
      displayName,
      hasLoadedRemoteUserObject,
      match,
      location,
      loadArticles: () => this.loadArticlesUser(),
      knacksteemUserObject,
      signupDate,
      reputation,
      userObject,
      remoteUserFollowObject,
      voteValue,
      votingPower,
      website  
    });
  }
}

const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user,
  stats: state.stats
});

export default withRouter(connect(mapStateToProps)(Profile));
