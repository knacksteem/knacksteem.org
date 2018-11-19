import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Input} from 'antd';
import PropTypes from 'prop-types';
const Search = Input.Search;
const SearchLength = 2;

class KnackSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
  }

  // On Click of Enter calling onSearch function, which will fire only when
  // the search string is different and length of search string is more than 1
  onSearch = (searchVal) => {
    if(this.state.searchString !== searchVal && searchVal.length >= SearchLength){
  	  this.setState({ searchString: searchVal });
      window.location = '/search?q='+searchVal;
    }
  };

  // Getting the q parameters and seeting the state
  // This is done so that people can share the URL
  componentDidMount(){
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const searchVal = params.get('q');
    this.setState({ searchString: searchVal });
  }

  render() {
	  return(
	    <Search
	      placeholder="Enter two or more characters to search"
	      style={{width: 300}}
        defaultValue={this.state.searchString}
	      onSearch={value => this.onSearch(value)}
	    >    
	    </Search>
	  );
	}
}

KnackSearch.propTypes = {
  onSearch: PropTypes.func
};

const mapStateToProps = state => ({
  searchString: state.searchString
});

export default withRouter(connect(mapStateToProps)(KnackSearch));