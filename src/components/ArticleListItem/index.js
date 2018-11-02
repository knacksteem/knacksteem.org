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
    dispatch(approveArticle(data.permlink, status));
  };
  //reject the current article
  const onRejectClick = () => {
    dispatch(rejectArticle(data.permlink, status));
  };
  return (
    <div className="ant-list-item list-item-article">
      <div className="article-content-wrapper">
        <Link to={`/articles/${data.author}/${data.permlink}`}>
          {data.coverImage && <div className="coverImage"><img src={data.coverImage} alt="Article"/></div>}
          <h2 className="ant-list-item-meta-title">{data.title}</h2>
          <div className="ant-list-item-content">{data.description}</div>
        </Link>
      </div>
      <ArticleMetaBottom data={data} onUpdate={onUpvoteSuccess} />
      {(status === 'pending' || status === 'reserved') &&
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
