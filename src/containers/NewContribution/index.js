import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import {Layout, Input, Tag, Icon, Button} from 'antd';
import {postArticle} from '../../actions/articles';
import './index.css';
const {Content} = Layout;

class NewContribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'testtitle',
      value: RichTextEditor.createEmptyValue(),
      tags: ['knacksteem'],
      inputVisible: false
    };
  }
  onChange = (value) => {
    this.setState({value});
    if (this.props.onChange) {
      //TODO create a preview below the editor?
      this.props.onChange(
        value.toString('html')
      );
    }
  };
  handleCloseTag = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({tags});
  };
  showInput = () => {
    this.setState({inputVisible: true}, () => this.input.focus());
  };
  handleInputChange = (e) => {
    this.setState({inputValue: e.target.value});
  };
  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };
  //post article on blockchain and in backend db
  onPostClick = () => {
    const {dispatch} = this.props;
    const {title, value, tags} = this.state;
    dispatch(postArticle(title, value.toString('markdown'), tags));
  };
  saveInputRef = input => this.input = input;
  render() {
    const {value, tags, inputVisible, inputValue} = this.state;

    return (
      <div className="editor">
        <Content>
          <RichTextEditor
            value={value}
            onChange={this.onChange}
            autoFocus={true}
          />
          <div className="editor-tags">
            {tags.map((tag, index) => {
              return (
                <Tag key={tag} closable={index !== 0} color={(index > 0 ? 'blue' : 'magenta')} afterClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
              );
            })}
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{width: 200}}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (tags.length < 5) && (
              <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}
              >
                <Icon type="plus" /> Add Tag
              </Tag>
            )}
          </div>
          <Button type="primary" onClick={this.onPostClick}>Post</Button>
        </Content>
      </div>
    );
  }
}

NewContribution.propTypes = {
  onChange: PropTypes.func,
  dispatch: PropTypes.func
};

export default withRouter(connect()(NewContribution));
