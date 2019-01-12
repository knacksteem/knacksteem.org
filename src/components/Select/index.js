import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Select} from 'antd';
import PropTypes from 'prop-types';
const Option = Select.Option;

class KnackSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'Categories'
    };
  }

  onChange(item) {
    this.setState({
      selectedCategory: item
    });
    this.props.onChangeCategory(item);
  }

  render() {
	  return(
      <Select defaultValue={this.state.selectedCategory} style={{ width: 120 }} 
              value={this.state.selectedCategory}
              onChange={this.onChange.bind(this)}>
        <Option value="Graphic">Graphic</Option>
        <Option value="Vlog">Vlog</Option>
        <Option value="Art" >Art</Option>
        <Option value="Tech Trend">Tech Trend</Option>
        <Option value="Knack">Knack</Option>
      </Select>
	  );
	}
}

KnackSelect.propTypes = {
  onChangeCategory: PropTypes.func
};

const mapStateToProps = state => ({
  selectedCategory: state.selectedCategory
});

export default withRouter(connect(mapStateToProps)(KnackSelect));

