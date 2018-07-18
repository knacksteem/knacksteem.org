import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {Avatar} from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import Editor from '../../components/Editor';
import './index.css';

//single comment with all the info and data - can be a comment or a reply comment
class SingleComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false
    };
  }
  onEditClick = () => {
    this.setState({
      isEditMode: true
    });
  };
  onReplyClick = () => {
    //TODO open a new editor window that includes details about eh comment to reply on
  };
  onCancelEditorClick = () => {
    this.setState({
      isEditMode: false
    });
  };
  onDoneEditorClick = () => {
    const {onUpdate} = this.props;

    this.setState({
      isEditMode: false
    });
    onUpdate();
  };
  render() {
    const {isEditMode} = this.state;
    const {data, onUpdate, parentPermlink, parentAuthor} = this.props;

    return (
      <div className="ant-list-item comment">
        <div>
          <Avatar src={data.authorImage} className="comment-avatar" />
          <span>{data.author} ({data.authorReputation})</span>
          {isEditMode && <Editor isEdit={true} isComment={true} articleData={data} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} parentPermlink={parentPermlink} parentAuthor={parentAuthor} />}
          {!isEditMode && <ReactMarkdown source={data.description} />}
          <ArticleMetaBottom data={data} onUpdate={onUpdate} onEditClick={this.onEditClick} onReplyClick={this.onReplyClick} isComment isEditMode={isEditMode} />
        </div>
        <div className="replies">
          {data.replies.map((elem) => {
            return (
              <SingleComment key={elem.permlink} data={elem} isReply parentPermlink={data.permlink} parentAuthor={data.author} onUpdate={onUpdate} />
            );
          })}
        </div>
      </div>
    );
  }
}

SingleComment.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object, //JSON object for the comment data
  isReply: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  parentPermlink: PropTypes.string.isRequired,
  parentAuthor: PropTypes.string.isRequired
};

SingleComment.defaultProps = {
  isReply: false
};

export default connect()(SingleComment);
