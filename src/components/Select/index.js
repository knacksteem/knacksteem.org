import React from 'react';
import {Select} from 'antd';
const Option = Select.Option;

export const KnackSelect = () => {
  return  (
    <Select defaultValue="Categories" style={{ width: 150 }}>
	  <Option value="All">All</Option>
    <Option value="gaming">Gaming</Option>
    <Option value="documentary">Documentary</Option>
    <Option value="art" >Art</Option>
    <Option value="altruism">Altruism</Option>
    <Option value="techtrends">Tech trends</Option>
	  <Option value="humour">Humour</Option>
	  <Option value="music">Music</Option>
	  <Option value="diy">DIY</Option>
	  <Option value="fashion">Fashion</Option>
    </Select>
  ); 
};

