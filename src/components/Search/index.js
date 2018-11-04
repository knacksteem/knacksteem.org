import React from 'react';
import {Input} from 'antd';
import PropTypes from 'prop-types';
const Search = Input.Search;

export const KnackSearch = props => {
  return(
    <Search
      placeholder="Search through Knacksteem"
      style={{width: 300}}
      onSearch={props.onSearch} 
    >    
    </Search>
  );
};

KnackSearch.propTypes = {
  onSearch: PropTypes.func
};