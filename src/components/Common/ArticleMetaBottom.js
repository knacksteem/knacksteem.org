import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Divider} from 'antd';
import IconText from '../Common/IconText';
import {prettyDate} from '../../services/functions';
import {upvoteElement} from '../../actions/articles';
import './ArticleMetaBottom.css';

/**
 * article meta info for the bottom of every article in every view
 * @param data article data
 * @param onUpvoteSuccess callback function that gets called after a successful upvote
 * @param dispatch redux dispatcher
 */
const ArticleMetaBottom = ({data, onUpvoteSuccess, dispatch, isComment}) => {
  const onUpvoteClick = async () => {
    //if already voted, immediately return - maybe implement unvoting later, if needed
    if (data.isVoted) {
      return;
    }
    //upvote with 10000 - which equals 100%
    try {
      await dispatch(upvoteElement(data.author, data.permlink, 10000));
      //on successful update, reload article or article list
      onUpvoteSuccess();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
      <Divider type="vertical" />
      <IconText type="message" text={isComment ? data.replies.length : data.commentsCount} />
      <Divider type="vertical" />
      <span className={`upvote ${data.isVoted ? 'active' : ''}`} onClick={onUpvoteClick}><IconText type={data.isVoted ? 'up-circle' : 'up-circle-o'} text={data.votesCount} /></span>
      <Divider type="vertical" />
      <IconText type="wallet" text={`$${data.totalPayout}`} />
    </div>
  );
};

ArticleMetaBottom.propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onUpvoteSuccess: PropTypes.func.isRequired,
  isComment: PropTypes.bool
};

ArticleMetaBottom.defaultProps = {
  isComment: false
};

export default connect()(ArticleMetaBottom);
