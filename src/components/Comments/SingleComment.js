import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {Divider, Avatar} from 'antd';
import IconText from '../Common/IconText';
import {prettyDate} from '../../services/functions';
import './index.css';

//single comment with all the info and data - can be a comment or a reply comment
class SingleComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false
    };
  }
  render() {
    const {data} = this.props;

    return (
      <div className="ant-list-item comment">
        <div>
          <Avatar src={data.authorImage} />
          <span>{data.author}</span>
          <ReactMarkdown source={data.description} />
          <div>
            <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
            <Divider type="vertical" />
            <IconText type="message" text={data.repliesCount} />
            <Divider type="vertical" />
            <IconText type="up-circle-o" text={data.votesCount} />
          </div>
        </div>
        <div className="replies">
          {data.replies.map((elem) => {
            return (
              <SingleComment key={elem.permlink} data={elem} isReply />
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
  isReply: PropTypes.bool
};

SingleComment.defaultProps = {
  isReply: false
};

export default connect()(SingleComment);
