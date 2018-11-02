import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Popconfirm, Spin} from 'antd';
// import {prettyDate} from '../../services/functions';
import {upvoteElement, deleteElement} from '../../actions/articles';
import './ArticleMetaBottom.css';
import Cookies from 'js-cookie';
import { comment } from 'postcss';

const styles = {
  barIcon: {
    fontSize: '16px',
    marginRight: '5px',
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
      isUpvoted: false
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
      this.setState({isUpvoted: true});
      await dispatch(upvoteElement(data.author, data.permlink, 10000));
      //on successful update, reload article or article list
      onUpdate();
    } catch (err) {
      //error handled in upvoteElement action
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
  render() {
    const {isDeleting, isUpvoted} = this.state;
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

    const upvoteIconColor = (data.isVoted || isUpvoted) ? '#999' : '#333';

    return (
      <div className="article-meta">
        <span
          className={`upvote ${(data.isVoted || isUpvoted) ? 'active' : ''}`}
          onClick={this.onUpvoteClick}>
            <i style={{...styles.barIcon, color: upvoteIconColor}} className="fas fa-arrow-up"/>
            <strong>{isUpvoted ? (data.votesCount + 1) : data.votesCount}</strong>
            <i style={{...styles.barIcon, marginLeft: '5px', color: '#eee'}} className="fas fa-arrow-down"/>
        </span>
        {/* <IconText type="wallet" text={`$${data.totalPayout}`} /> */}
        <span style={{ float: 'right' }}>
          <i style={styles.barIcon} className="fas fa-comment-dots"/>
          <strong className="">{commentCount}</strong>
        </span>
        <span className="action-links">
          {/* {(!isEditMode && !isDeleting) && actionsArray} */}
          {isDeleting && <Spin size="small" />}
        </span>
      </div>
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
