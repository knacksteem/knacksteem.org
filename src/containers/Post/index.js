import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import kebabCase from 'lodash/kebabCase';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';

import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
} from '../../reducers';

import * as Actions from '../../actions/constants';
import { createPost, saveDraft, newPost } from './editorActions';
import { notify } from '../../app/Notification/notificationActions';
import Editor from '../../components/Editor/';
import Affix from '../../components/Utils/Affix';


// @UTOPIAN
import { Modal, Icon } from 'antd';  import * as ReactIcon from 'react-icons/lib/md';
import { getBeneficiaries } from '../../actions/beneficiaries';
import { getStats } from '../../actions/stats';
import { getUser } from '../../actions/user';
import { getReposByGithub} from '../../actions/projects';
import GithubConnection from '../../components/Sidebar/GithubConnection';

class Write extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      initialTitle: '',
      initialTopics: [],
      initialReward: '50',
      initialType: '',
      initialBody: '',
      initialRepository: null,
      initialPullRequests: [],
      isUpdating: false,
      warningModal: false,
      parsedPostData: null,
      banned: false,
    };
  }

  loadGithubData() {
    const {  user,getUser, getReposByGithub} = this.props;
    getUser(user.name).then(res => {
      if (res.response && res.response.github) {
        getReposByGithub(user.name, true);
      }
    });
  }

  componentDidMount() {
    this.props.newPost();
    const { draftPosts, location: { search }, getUser, user, getReposByGithub, } = this.props;
    const draftId = new URLSearchParams(search).get('draft');
    const draftPost = draftPosts[draftId];

    this.loadGithubData();

    if (draftPost) {
      const { jsonMetadata, isUpdating } = draftPost;
      let tags = [];
      if (isArray(jsonMetadata.tags)) {
        tags = jsonMetadata.tags;
      }

      if (draftPost.permlink) {
        this.permlink = draftPost.permlink;
      }

      if (draftPost.originalBody) {
        this.originalBody = draftPost.originalBody;
      }

      // eslint-disable-next-line
      this.setState({
        initialTitle: draftPost.title || '',
        initialTopics: tags || [],
        initialReward: draftPost.reward || '50',
        initialType: jsonMetadata.type || 'ideas',
        initialBody: draftPost.body || '',
        isReviewed: draftPost.reviewed || false,
        isUpdating: isUpdating || false,
        initialRepository: jsonMetadata.repository,
        initialPullRequests: jsonMetadata.pullRequests || [],
      });
    }
  }

  proceedSubmit = () => {
    const { getBeneficiaries } = this.props;
    const data = this.state.parsedPostData;
    const { location: { search } } = this.props;
    const id = new URLSearchParams(search).get('draft');
    if (id) {
      data.draftId = id;
    };

    this.setState({warningModal : false});

    const extensions = [[0, {
      beneficiaries: [
        {
          account: 'utopian.pay',
          weight: 2500
        }
      ]
    }]];

    const contributionData = {
      ...data,
      extensions
    };

    console.log("CONTRIBUTION DATA", contributionData);

    this.props.createPost(contributionData);

    /*getBeneficiaries(data.author).then(res => {
      if (res.response && res.response.results) {
        const beneficiariesArr = [];
        let utopianAssignedWeight = 0;
        const allBeneficiaries = res.response.results;
        allBeneficiaries.forEach((beneficiary, index) => {
          let assignedWeight = 0;
          if (beneficiary.vesting_shares) { // this is a sponsor
            const sponsorSharesPercent = beneficiary.percentage_total_vesting_shares;
            // 20% of all the rewards dedicated to sponsors
            const sponsorsDedicatedWeight = 2000;
            assignedWeight = Math.round((sponsorsDedicatedWeight * sponsorSharesPercent ) / 100);

            if (!beneficiary.opted_out && beneficiary.account !== 'utopian-io') {
              beneficiariesArr.push({
                account: beneficiary.account,
                weight: assignedWeight || 1
              });
            } else {
              utopianAssignedWeight = utopianAssignedWeight + assignedWeight;
            }
          } else {
            // this is a moderator
            const moderatorSharesPercent = beneficiary.percentage_total_rewards_moderators;
            // 5% all the rewards dedicated to moderators
            // This does not sum up. The total ever taken from an author is 20%
            const moderatorsDedicatedWeight = 500;
            assignedWeight = Math.round((moderatorsDedicatedWeight * moderatorSharesPercent ) / 100);

            beneficiariesArr.push({
              account: beneficiary.account,
              weight: assignedWeight || 1
            });
          }

          if (index + 1 === allBeneficiaries.length) {

            if (utopianAssignedWeight > 0) {
              beneficiariesArr.push({
                account: 'utopian-io',
                weight: utopianAssignedWeight || 1
              })
            }

            const extensions = [[0, {
              beneficiaries: beneficiariesArr
            }]];

            const contributionData = {
              ...data,
              extensions
            };

            console.log("CONTRIBUTION DATA", contributionData);

            this.props.createPost(contributionData);
          }
        });
      } else {
        alert("Something went wrong. Please try again!")
      }
    }); */
  };

  onSubmit = (form) => {
    const { getStats } = this.props;
    const data = this.getNewPostData(form);
    const { location: { search } } = this.props;
    const id = new URLSearchParams(search).get('draft');
    if (id) {
      data.draftId = id;
    };

    this.setState({parsedPostData: data})

    getStats()
      .then(res => {
        const { stats } = res.response;
        const jsonData = data.jsonMetadata;
        const categoryStats = stats.categories[jsonData.type];
        const average_posts_length = categoryStats ? categoryStats.average_posts_length : 0;
        const bodyLength = data.body.length;

        if (bodyLength + 2000 < average_posts_length) {
          this.setState({warningModal : true});
        } else {
          this.proceedSubmit();
        }
      })
      .catch((e) => alert("Something went wrong. Please try again." + e))
  };

  getNewPostData = (form) => {
    const data = {
      body: form.body,
      title: form.title,
      reward: form.reward,
    };

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    const tags = [process.env.UTOPIAN_CATEGORY, ...form.topics];

    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const linkRegex = /\[.+?]\((.*?)\)/g;
    const images = [];
    const imageRegex = /!\[.+?]\((.*?)\)/g;
    let matches;

    const postBody = data.body;

    // eslint-disable-next-line
    while ((matches = userRegex.exec(postBody))) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    // eslint-disable-next-line
    while ((matches = linkRegex.exec(postBody))) {
      if (links.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        links.push(matches[1]);
      }
    }

    // eslint-disable-next-line
    while ((matches = imageRegex.exec(postBody))) {
      if (images.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        images.push(matches[1]);
      }
    }

    if (data.title && !this.permlink) {
      data.permlink = kebabCase(data.title);
    } else {
      data.permlink = this.permlink;
    }

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    const metaData = {
      community: 'utopian',
      app: `utopian/${version}`,
      format: 'markdown',
      repository: form.repository,
      pullRequests: form.pullRequests || [],
      platform: 'github', // @TODO @UTOPIAN hardcoded
      type: form.type,
    };

    if (tags.length) {
      metaData.tags = tags;
    }
    if (users.length) {
      metaData.users = users;
    }
    if (links.length) {
      metaData.links = links;
    }
    if (images.length) {
      metaData.image = images;
    }

    data.parentPermlink = process.env.UTOPIAN_CATEGORY; // @UTOPIAN forcing category
    data.jsonMetadata = metaData;

    if (this.originalBody) {
      data.originalBody = this.originalBody;
    }

    return data;
  };

  componentWillMount() {
    const { getUser, user } = this.props;
    getUser(user.name).then(res => {
      if (user.banned === 1) {
        this.setState({banned: true});
      }
    });
  }

  handleImageInserted = (blob, callback, errorCallback) => {
    const { formatMessage } = this.props.intl;
    this.props.notify(
      formatMessage({ id: 'notify_uploading_image', defaultMessage: 'Uploading image' }),
      'info',
    );
    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${this.props.user.name}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => {
        errorCallback();
        this.props.notify(
          formatMessage({
            id: 'notify_uploading_iamge_error',
            defaultMessage: "Couldn't upload image",
          }),
          'error',
        );
      });
  };

  onUpdate = debounce(form => {
    const data = this.getNewPostData(form)
    this.setState({parsedPostData: data})
    this.saveDraft()
  }, 400);

  saveDraft = () => {
    const data = this.state.parsedPostData;
    const postBody = data.body;
    const { location: { search } } = this.props;
    let id = new URLSearchParams(search).get('draft');

    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    let redirect = false;

    if (id === null) {
      id = Date.now().toString(16);
      redirect = true;
    }

    this.props.saveDraft({ postData: data, id }, redirect);
  };

  render() {
    const {
      initialTitle,
      initialTopics,
      initialType,
      initialBody,
      initialRepository,
      initialPullRequests,
      initialReward,
      parsedPostData
     } = this.state;
    const { loading, saving, submitting, user } = this.props;
    const isSubmitting = submitting === Actions.CREATE_CONTRIBUTION_REQUEST || loading;
    // this.loadGithubData();
    return (
      <div className="shifted">
        <div className="post-layout container">
          <BannedScreen redirector={true}/>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <GithubConnection user={user} />
            </div>
          </Affix>
          <div className="center">
            <Editor
              ref={this.setForm}
              saving={saving}
              repository={initialRepository}
              pullRequests={initialPullRequests}
              title={initialTitle}
              topics={initialTopics}
              reward={initialReward}
              type={initialType}
              body={initialBody}
              loading={isSubmitting}
              isUpdating={this.state.isUpdating}
              isReviewed={this.state.isReviewed}
              onUpdate={this.onUpdate}
              onSubmit={this.onSubmit}
              onImageInserted={this.handleImageInserted}
              user={user}
              parsedPostData={parsedPostData}
            />
            <Modal
              visible={this.state.warningModal}
              title='Hey. Your Contribution may be better!'
              okText={'Proceed anyways'}
              cancelText='Keep editing'
              onCancel={() => this.setState({warningModal: false})}
              onOk={ () => {
                  this.proceedSubmit();
              }}
            >
              <p>
                <Icon type="safety" style={{
                  fontSize: '100px',
                  color: 'red',
                  display: 'block',
                  clear: 'both',
                  textAlign: 'center',
                }}/>
                <br />
                The contribution you just wrote seems shorter than others in this category.
                <br /><br />
                Please make sure you are adding <b>enough information</b> and that your contribution is <b>narrative and brings value</b>.
                <br /><br />
                Submitting the contribution as it is now, will either result in the <b>contribution being refused</b> by the Utopian Moderators or <b>lower votes/exposure</b>.
              </p>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default Write;
