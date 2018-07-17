import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {Avatar} from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
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
    this.setState({
      isEditMode: true
    });
  };
  render() {
    const {isEditMode} = this.state;
    const {data, onUpvoteSuccess} = this.props;

    return (
      <div className="ant-list-item comment">
        <div>
          <Avatar src={data.authorImage} className="comment-avatar" />
          <span>{data.author} ({data.authorReputation})</span>
          <ReactMarkdown source={data.description} />
          <ArticleMetaBottom data={data} onUpdate={onUpvoteSuccess} onEditClick={this.onEditClick} onReplyClick={this.onReplyClick} isComment isEditMode={isEditMode} />
        </div>
        <div className="replies">
          {data.replies.map((elem) => {
            return (
              <SingleComment key={elem.permlink} data={elem} isReply onUpvoteSuccess={onUpvoteSuccess} />
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
  onUpvoteSuccess: PropTypes.func.isRequired
};

SingleComment.defaultProps = {
  isReply: false
};

export default connect()(SingleComment);
