import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Row, Col} from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {approveArticle, rejectArticle} from '../../actions/articles';
import { truncateString } from '../../services/functions';
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
    <Row className="ant-list-item list-item-article">
      <Row className="article-item-list-container"type="flex" style={{ overflow: 'hidden'}}>
        {data.coverImage && 
          <Row className="article-image-container">
            <Link style={{ width: 'inherit', height: 'auto' }} to={`/articles/${data.author}/${data.permlink}`}>
              <picture style={{ width: 'inherit', height: 'auto' }} >
                <img  className="article-image"  srcSet={`https://steemitimages.com/640x480/${data.coverImage}`} alt={data.title}/>
              </picture>
            </Link>
          </Row>
        }
        <Col className="article-details" gutter={0} >
          <Col>
            <Link to={`/articles/${data.author}/${data.permlink}`}>
              <h3 className="article-title">{data.title}</h3>
            </Link>
            <Link to={`/articles/${data.author}/${data.permlink}`}>
              <div className="ant-list .article-content-wrapper">{truncateString(data.description,60)}</div>
            </Link>
          </Col>
        </Col>
      </Row>
      <ArticleMetaBottom data={data} onUpdate={onUpvoteSuccess} />
      {(status === 'pending' || status === 'reserved') &&
        <div className="mod-functions">
          <Button size="small" type="primary" onClick={onApproveClick}>Approve</Button>
          <Button size="small" type="danger" onClick={onRejectClick}>Reject</Button>
        </div>
      }
    </Row>
  );
};

ArticleListItem.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object, //JSON object for the article data
  status: PropTypes.string, //status flag for article (pending, approved, ...)
  onUpvoteSuccess: PropTypes.func.isRequired
};

export default connect()(ArticleListItem);
