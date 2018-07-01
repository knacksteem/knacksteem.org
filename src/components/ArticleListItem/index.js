import React from 'react';
import {Link} from 'react-router-dom';
import {Tag} from 'antd';
import IconText from './IconText';
import './index.css';

//Single Item for Article Overview
const ArticleListItem = ({data}) => {
  return (
    <div className="ant-list-item">
      <Link to={`/articles/${data.author}/${data.permlink}`}>
        {data.coverImage && <div style={{width: 280, float: 'left', marginRight: 20}}><img src={data.coverImage} alt="Article"/></div>}
        <h2 className="ant-list-item-meta-title">{data.title}</h2>
        <div className="ant-list-item-content">{data.description}</div>
      </Link>
      <ul className="ant-list-item-action">
        <li><IconText type="clock-circle-o" text={data.postedAt} /><em className="ant-list-item-action-split" /></li>
        <li><IconText type="message" text={data.commentsCount} /><em className="ant-list-item-action-split" /></li>
        <li><IconText type="up-circle-o" text={data.votesCount} /></li>
      </ul>
      {/*<div className="article-tags">
        {data.tags.map((tag, index) => {
          return (
            <Tag key={tag} closable={false} color={(index > 0 ? 'blue' : 'magenta')}>{tag}</Tag>
          );
        })}
      </div>*/}
    </div>
  );
};

export default ArticleListItem;
