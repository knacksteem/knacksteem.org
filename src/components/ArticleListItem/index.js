import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Row, Col, Avatar} from 'antd';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {reserveArticle, approveArticle, rejectArticle} from '../../actions/articles';
import { truncateString, prettyDate } from '../../services/functions';
import './index.css';


//Single Item for Article Overview
const ArticleListItem = ({data, user, status, dispatch, onUpvoteSuccess}) => {

  //reserve the current article with an api call and reload the pending articles for redux
  const onReserveClick = () => {
    // In case supervisor clicked on reserve for review in the Home page.
    // status undefined means it is not on approved or review page;
    if(status === undefined)
      dispatch(reserveArticle(data.permlink, 'approved'));
    else
      dispatch(reserveArticle(data.permlink, status));
  };
  //approve the current article
  const onApproveClick = () => {
    dispatch(approveArticle(data.permlink, status));
  };
  //reject the current article
  const onRejectClick = () => { 
    dispatch(rejectArticle(data.permlink, status));
  };
  return (
    <Row className="ant-list-item list-item-article">
      <Row type="flex" align="middle">
        <Col style={{marginLeft: '10px'}}>
          <a title="Visit profile" href="/home">
            <Avatar size="small" src={`${data.authorImage}`}  icon="user" />
          </a>
        </Col>
        <Col >
          <p className="my-auto"><b>{data.author}</b> ({data.authorReputation})</p>
        </Col>
        <Col >
          <p className="my-auto">in {data.tags[1]}</p>
        </Col>
        <Col >
         <p className="my-auto">{prettyDate(data.postedAt)}</p>
        </Col>
      </Row>
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
      {((status === 'pending' || (data.moderation.approved && user.isSupervisor)) && data.author !== user.username) &&
        <div className="mod-functions">
            <Button size="small" type="primary" onClick={onReserveClick}>Reserve for review</Button>
        </div>
      }
      {(status === 'reserved' && (user.username !== data.moderation.reservedBy)) && 
        <div className="reservedBy">Reserved for review by <Link to={`/@${data.moderation.reservedBy}`}>{data.moderation.reservedBy}</Link></div>
      }
      {(status === 'reserved' && user.username === data.moderation.reservedBy) &&
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
