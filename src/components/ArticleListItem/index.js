import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Divider, Button} from 'antd';
import IconText from '../Common/IconText';
import {prettyDate} from '../../services/functions';
import './index.css';
import {approveArticle, rejectArticle, upvoteElement} from '../../actions/articles';

//Single Item for Article Overview
const ArticleListItem = ({data, status, dispatch}) => {
  //approve the current article with an api call and reload the pending articles for redux
  const onApproveClick = () => {
    dispatch(approveArticle(data.permlink));
  };
  //reject the current article
  const onRejectClick = () => {
    dispatch(rejectArticle(data.permlink));
  };
  const onUpvoteClick = async () => {
    //upvote with 10000 - which equals 100%
    let response = await dispatch(upvoteElement(data.author, data.permlink, 10000));
    console.log(response);
  };
  return (
    <div className="ant-list-item">
      <Link to={`/articles/${data.author}/${data.permlink}`}>
        {data.coverImage && <div style={{width: 280, float: 'left', marginRight: 20}}><img src={data.coverImage} alt="Article"/></div>}
        <h2 className="ant-list-item-meta-title">{data.title}</h2>
        <div className="ant-list-item-content">{data.description}</div>
      </Link>
      <div>
        <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
        <Divider type="vertical" />
        <IconText type="message" text={data.commentsCount} />
        <Divider type="vertical" />
        <span className="upvote" onClick={onUpvoteClick}><IconText type="up-circle-o" text={data.votesCount} /></span>
        <Divider type="vertical" />
        <IconText type="wallet" text={`$${data.totalPayout}`} />
      </div>
      {(status === 'pending') &&
        <div className="mod-functions">
          <Button size="small" type="primary" onClick={onApproveClick}>Approve</Button>
          <Button size="small" type="danger" onClick={onRejectClick}>Reject</Button>
        </div>
      }
    </div>
  );
};

ArticleListItem.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object, //JSON object for the article data
  status: PropTypes.string //status flag for article (pending, approved, ...)
};

export default connect()(ArticleListItem);
