import React from 'react';
import {Link} from 'react-router-dom';
import {List, Icon, Avatar} from 'antd';
import './index.css';

const IconText = ({type, text}) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const Article = ({data}) => {
  console.log(data);
  return (
    <List.Item
      key={data.title}
      actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
      extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
    >
      <List.Item.Meta
        avatar={<Avatar src={data.avatar} />}
        title={<a href={data.href}>{data.title}</a>}
        description={data.description}
      />
      {data.content}
    </List.Item>
  );
};

export default Article;
