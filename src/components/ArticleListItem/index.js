import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button} from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {approveArticle, rejectArticle} from '../../actions/articles';
import './index.css';

//Single Item for Article Overview
const ArticleListItem = ({data, status, dispatch, onUpvoteSuccess}) => {
  //approve the current article with an api call and reload the pending articles for redux
  const onApproveClick = () => {
    dispatch(approveArticle(data.permlink));
  };
  //reject the current article
  const onRejectClick = () => {
    dispatch(rejectArticle(data.permlink));
  };
  return (
    <div className="ant-list-item">
      <Link to={`/articles/${data.author}/${data.permlink}`}>
        {data.coverImage && <div style={{width: 280, float: 'left', marginRight: 20}}><img src={data.coverImage} alt="Article"/></div>}
        <h2 className="ant-list-item-meta-title">{data.title}</h2>
        <div className="ant-list-item-content">{data.description}</div>
      </Link>
      <ArticleMetaBottom data={data} onUpvoteSuccess={onUpvoteSuccess} />
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
  status: PropTypes.string, //status flag for article (pending, approved, ...)
  onUpvoteSuccess: PropTypes.func.isRequired
};

export default connect()(ArticleListItem);
