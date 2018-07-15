import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Divider} from 'antd';
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
 */
const ArticleMetaBottom = ({data, onUpdate, dispatch, isComment, isArticleDetail}) => {
  const onUpvoteClick = async () => {
    //if already voted, immediately return - maybe implement unvoting later, if needed
    if (data.isVoted) {
      return;
    }
    //upvote with 10000 - which equals 100%
    try {
      await dispatch(upvoteElement(data.author, data.permlink, 10000));
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      console.log(err);
    }
  };
  const onDeleteClick = async () => {
    try {
      await dispatch(deleteElement(data.permlink));
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      console.log(err);
    }
  };
  const onEditClick = async () => {
    //TODO open markdown editor, prefilled with current content
  };
  const onReplyClick = async () => {
    //TODO open markdown editor for new comment at the correct position
  };

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
        <a key="action-delete" onClick={onDeleteClick}>Delete</a>
      );
    }
  }

  return (
    <div>
      <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
      <Divider type="vertical" />
      <IconText type="message" text={commentCount} />
      <Divider type="vertical" />
      <span className={`upvote ${data.isVoted ? 'active' : ''}`} onClick={onUpvoteClick}><IconText type={data.isVoted ? 'up-circle' : 'up-circle-o'} text={data.votesCount} /></span>
      <Divider type="vertical" />
      <IconText type="wallet" text={`$${data.totalPayout}`} />
      <Divider type="vertical" />
      <span className="action-links">
        {actionsArray}
      </span>
    </div>
  );
};

ArticleMetaBottom.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isComment: PropTypes.bool,
  isArticleDetail: PropTypes.bool
};

ArticleMetaBottom.defaultProps = {
  isComment: false,
  isArticleDetail: false
};

export default connect()(ArticleMetaBottom);
