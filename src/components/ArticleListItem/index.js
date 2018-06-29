import React from 'react';
import {Link} from 'react-router-dom';
import {Icon} from 'antd';
import './index.css';

const IconText = ({type, text}) => (
  <span>
    <Icon type={type} style={{marginRight: 8}} />
    {text}
  </span>
);

//Single Item for Article Overview
const ArticleListItem = ({data}) => {
  return (
    <div className="ant-list-item">
      <Link to="/articles/permalink1">
        <div style={{width: 280, float: 'left', marginRight: 20}}><img src="http://placekitten.com/280/160" alt="Article"/></div>
        <h2 className="ant-list-item-meta-title">{data.title}</h2>
        <div className="ant-list-item-content">{data.description}</div>
      </Link>
      <ul className="ant-list-item-action">
        <li><IconText type="clock-circle-o" text="156" /><em className="ant-list-item-action-split" /></li>
        <li><IconText type="message" text="156" /><em className="ant-list-item-action-split" /></li>
        <li><IconText type="up-circle-o" text="2" /></li>
      </ul>
    </div>
  );
};

export default ArticleListItem;
