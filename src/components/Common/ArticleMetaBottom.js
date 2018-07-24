import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Divider, Popconfirm, Spin} from 'antd';
import IconText from '../Common/IconText';
import {prettyDate} from '../../services/functions';
import {upvoteElement, deleteElement} from '../../actions/articles';
import './ArticleMetaBottom.css';
import Cookies from 'js-cookie';

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
      isBusy: false
    };
  }
  //upvote article or comment
  onUpvoteClick = async () => {
    const {data, dispatch, onUpdate} = this.props;

    //if already voted, immediately return - maybe implement unvoting later, if needed
    if (data.isVoted) {
      return;
    }
    //upvote with 10000 - which equals 100%
    try {
      this.setState({isBusy: true});
      await dispatch(upvoteElement(data.author, data.permlink, 10000));
      this.setState({isBusy: false});
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      console.log(err);
    }
  };
  //delete article or comment - will get called after confirmation
  onDeleteClick = async () => {
    const {data, dispatch, onUpdate} = this.props;

    try {
      this.setState({isBusy: true});
      await dispatch(deleteElement(data.permlink));
      this.setState({isBusy: false});
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    const {isBusy} = this.state;
    const {data, isComment, isArticleDetail, onEditClick, onReplyClick, isEditMode} = this.props;

    const isAuthor = (Cookies.get('username') === data.author);
    const commentCount = isComment ? data.replies.length : data.commentsCount;

    const actionsArray = [<a key="action-reply" onClick={onReplyClick}>Reply</a>];
    if (isComment || isArticleDetail) {
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

    return (
      <div>
        <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
        <Divider type="vertical" />
        <IconText type="message" text={commentCount} />
        <Divider type="vertical" />
        <span className={`upvote ${data.isVoted ? 'active' : ''}`} onClick={this.onUpvoteClick}><IconText type={data.isVoted ? 'up-circle' : 'up-circle-o'} text={data.votesCount} /></span>
        <Divider type="vertical" />
        <IconText type="wallet" text={`$${data.totalPayout}`} />
        <Divider type="vertical" />
        <span className="action-links">
          {(!isEditMode && !isBusy) && actionsArray}
          {isBusy && <Spin size="small" />}
        </span>
      </div>
    );
  }
};

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
