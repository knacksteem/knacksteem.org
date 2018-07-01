import React from 'react';
import {Link} from 'react-router-dom';
import {Divider, Tag} from 'antd';
import IconText from './IconText';
import {prettyDate} from '../../services/functions';
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
      <div>
        <IconText type="clock-circle-o" text={prettyDate(data.postedAt)} />
        <Divider type="vertical" />
        <IconText type="message" text={data.commentsCount} />
        <Divider type="vertical" />
        <IconText type="up-circle-o" text={data.votesCount} />
      </div>
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
