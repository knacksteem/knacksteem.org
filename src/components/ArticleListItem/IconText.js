import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';

const IconText = ({type, text}) => (
  <span>
    <Icon type={type} style={{marginRight: 8}} />
    {text}
  </span>
);

IconText.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.any
};

export default IconText;
