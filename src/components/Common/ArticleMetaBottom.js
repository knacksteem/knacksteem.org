import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import IconText from '../Common/IconText';
import {Popconfirm, Spin, Row, Col, Divider, message} from 'antd';

import {upvoteElement, deleteElement} from '../../actions/articles';
import {prettyDate} from '../../services/functions';
import './ArticleMetaBottom.css';
import Cookies from 'js-cookie';
import {apiGet} from '../../services/api';
import {push} from 'react-router-redux';
import VotingSlider from '../../components/VotingSlider';

const styles = {
  barIcon: {
    fontSize: '16px',
    color: '#999'
    
  }
};

/**
 * article meta info for the bottom of every article in every view
 * @param data article data
 * @param onUpdate callback function that gets called after a successful operation (upvote, delete, ...)
 * @param dispatch redux dispatcher
 * @param isComment boolean specifying if the parent component is a comment
 * @param isArticleDetail boolean specifying if the parent component is an article detail page
 * @param isEditMode boolean to determine if the component is in edit mode right now
 * @param onEditClick callback function when the user clicks on the edit link
 * @param onReplyClick callback function when the user clicks on the reply link
 */
class ArticleMetaBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
      isUpvoted: false,
      isDownvoted: false,
      votesData: [],
      sliderVisible: false,
      sliderValue: 100,
      stateChanged: false
    };
  }
  componentDidMount() {
    this.getArticleVotes();
  }

  componentDidUpdate() {
    if (this.state.stateChanged) {
      this.getArticleVotes();
    }
  }
  
  //upvote article or comment
  onUpvoteClick = () => {
    const {sliderVisible} = this.state;
    if(!sliderVisible) {
      this.setState({
        sliderVisible: true,
        votingDirection: 100
      });
    }
  };

  //downvote article or comment
  onDownvoteClick = async () => {
    const {sliderVisible} = this.state;

    if(!sliderVisible) {
      this.setState({
        sliderVisible: true,
        votingDirection: -100
      });
    }
  };

  //delete article or comment - will get called after confirmation
  onDeleteClick = async () => {
    const {data, dispatch, onUpdate} = this.props;

    try {
      this.setState({isDeleting: true});
      await dispatch(deleteElement(data.permlink));
      this.setState({isDeleting: false});
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      //error handled in deleteElement action
    }
  };

  onCancel = () => {
    this.setState({
      sliderVisible: false
    });
  };

  onConfirm = async () => {
    this.setState({
      sliderVisible: false,
      stateChanged: true
    });

    const {data, dispatch} = this.props;
    const {isUpvoted, isDownvoted, sliderValue} = this.state;

    //upvote with 10000 - which equals 100%
    try {
      if (isUpvoted) {
        this.setState({isUpvoted: false});
      } else if (isDownvoted) {
        this.setState({isDownvoted: false});
      }
      else {
        this.setState({isUpvoted: true});
        this.setState({isDownvoted: true});
      }
      await dispatch(upvoteElement(data.author, data.permlink, sliderValue));
      this.getArticleVotes();
    } catch (err) {
      message.error('An Error occured, please try again later');
    }
  };

  changeVotePower = (votePower) => {
    this.setState({sliderValue: votePower});
  }

  getArticleVotes = async () => {
    const {data, dispatch, isComment} = this.props;
    if(isComment) {
      return;
    }
    try {
      //calling the api to get the votes of the articles
      let response = await apiGet(`/posts/${data.author}/${data.permlink}/votes`, {username: Cookies.get('username') || undefined});
      if (response && response.data && response.data.results) {
        // checking if the author has upvoted or downvoted
        const isAuthorUpvoted = response.data.results.filter(vote => vote.voter === Cookies.get('username') && vote.percent > 0).length > 0;
        const isAuthorDownvoted = response.data.results.filter(vote => vote.voter === Cookies.get('username') && vote.percent < 0).length > 0;
        this.setState({
          votesData: response.data.results,
          isUpvoted: isAuthorUpvoted,
          isDownvoted: isAuthorDownvoted,
          stateChanged: false
        });
      }
    } catch (error) {
      message.error('An Error occured, please try again later');
      dispatch(push('/'));
    }
  };

  render() {
    const {isDeleting, votesData, isUpvoted, isDownvoted, sliderVisible} = this.state;
    const {data, isComment, isArticleDetail, onEditClick, onReplyClick, isEditMode, user} = this.props;
    
    const isAuthor = (Cookies.get('username') === data.author);
    const commentCount = isComment ? data.replies.length : data.commentsCount;

    const upvoteCount = votesData.filter(vote => vote.percent > 0).length;
    const downvoteCount = votesData.filter(vote => vote.percent < 0).length;

    const actionsArray = [];
    const showVoteWorth = true;

    if (isComment || isArticleDetail) {
      actionsArray.push(
        <a key="action-reply" onClick={onReplyClick}>Reply</a>
      );

      if (isAuthor) {
        actionsArray.push(
          <a key="action-edit" onClick={onEditClick}>Edit</a>
        );
      }
      if (isAuthor && !commentCount && !data.votesCount) {
        actionsArray.push(
          <Popconfirm title="Are you sure?" onConfirm={this.onDeleteClick} key="action-delete">
            <a>Delete</a>
          </Popconfirm>
        );
      }
    }

    const upvoteIconColor = isUpvoted ? '#1890ff' : '#999';
    const downvoteIconColor = isDownvoted ? '#1890ff' : '#999';

    return (
      <Row  type="flex" justify="space-between" className="article-meta" style={{ background: isComment ? 'transparent' : '#fff', width: '100%',padding: '7px'}}>
         <Col style={{display: 'flex'}}>
          <Col>
            <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
          </Col>
          <Col>
            <Divider type="vertical" />
          </Col>
          <Col>
          { sliderVisible && user.username !== '' &&
            <div>
              <VotingSlider onCancel={this.onCancel} onConfirm={this.onConfirm} onVotePowerChange={this.changeVotePower} votingDirection={this.state.votingDirection} showVoteWorth={showVoteWorth} />
            </div>
          }
          </Col>
          <Col>
            <span
              className={`upvote ${(isUpvoted) ? 'active' : ''}`}
              onClick={this.onUpvoteClick}>
              <i style={{...styles.barIcon, color: upvoteIconColor}} className="fas fa-thumbs-up"/>
              <strong style={{color: upvoteIconColor}}>{upvoteCount}</strong>
            </span>

          </Col>
          <Col>
            <Divider type="vertical" />
          </Col>
          <Col>
            <span
              className={`downvote ${(isDownvoted) ? 'active' : ''}`}
              onClick={this.onDownvoteClick}>
              <i style={{...styles.barIcon, marginLeft: '10px', color: downvoteIconColor}} className="fas fa-thumbs-down"/>
              <strong style={{color: downvoteIconColor}}>{downvoteCount}</strong>
            </span>
          </Col>
          <Col>
            <Divider type="vertical" />
          </Col>
          <Col>
            <span>
              <strong><i style={styles.barIcon} className="fas fa-dollar-sign" />{Number(data.totalPayout).toFixed(2)}</strong>
            </span>
          </Col>
        </Col>
        {!isComment && 
        <Col>
          <Col>
            {data.category}
          </Col>
        </Col>
      }
      <Col style={{display: 'flex'}}>
        <Col>
              <Divider type="vertical" />
        </Col>
        <Col>
          <span>
            <strong> <i style={styles.barIcon} className="fas fa-comment-dots"/>{commentCount}</strong>
          </span>
        </Col>
        <Col>
            <Divider type="vertical" />
        </Col>
        <Col>
          <span className="action-links">
            {(!isEditMode && !isDeleting) && actionsArray}
            {isDeleting && <Spin size="small" />}
          </span>
        </Col>
      </Col>
        
      </Row>
    );
  }
}

ArticleMetaBottom.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isComment: PropTypes.bool,
  isArticleDetail: PropTypes.bool,
  isEditMode: PropTypes.bool,
  onEditClick: PropTypes.func,
  onReplyClick: PropTypes.func
};

ArticleMetaBottom.defaultProps = {
  isComment: false,
  isArticleDetail: false,
  isEditMode: false
};

export default connect()(ArticleMetaBottom);