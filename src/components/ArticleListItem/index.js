import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Col, Row} from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {approveArticle, rejectArticle} from '../../actions/articles';
import './index.css';

const styles = {
  articleItemThumb: {
    display: 'inline-block',
    width: '100%',
    position: 'relative'
  },
  articleItemImageContainer: {
    width: '100%',
  },
  articleItemImage: {
    maxWidth: '100%',
    height: 'auto',
    verticalAlign: 'center',
    display: 'inline-block'
  }
};

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
      <div className="">
        <Row gutter={0}>
          {data.coverImage && 
          <Col span={6}>
            <Link to={`/articles/${data.author}/${data.permlink}`}>
              <span style={styles.articleItemThumb}>
                <picture style={styles.articleItemImageContainer}>
                  <img srcSet={data.coverImage} style={styles.articleItemImage} alt={data.title}/>
                </picture>
              </span>
            </Link>
          </Col>}
          <Col span={18}>
            <div className="article-content-wrapper">
              <Link to={`/articles/${data.author}/${data.permlink}`}>
                <h2 className="ant-list-item-title">{data.title}</h2>
              </Link>
              <Link to={`/articles/${data.author}/${data.permlink}`}>
                <div className="ant-list-item-content">{data.description}</div>
              </Link>
            </div>
          </Col>
        </Row>
        {/* <Link to={`/articles/${data.author}/${data.permlink}`}>
          <div style={{ width: '25%' }}>
          </div>
          <h2 className="ant-list-item-meta-title">{data.title}</h2>
          <div className="ant-list-item-content">{data.description}</div>
        </Link> */}
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
