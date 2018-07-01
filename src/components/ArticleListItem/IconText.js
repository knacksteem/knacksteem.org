import React from 'react';
import {Icon} from 'antd';

export default ({type, text}) => (
  <span>
    <Icon type={type} style={{marginRight: 8}} />
    {text}
  </span>
);
