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
      inputTagsVisible: false
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
  showInputTags = () => {
    this.setState({inputTagsVisible: true}, () => this.inputTags.focus());
  };
  handleInputTagsChange = (e) => {
    this.setState({inputTagsValue: e.target.value});
  };
  handleInputTitleChange = (e) => {
    this.setState({title: e.target.value});
  };
  handleInputConfirm = () => {
    const state = this.state;
    const inputTagsValue = state.inputTagsValue;
    let tags = state.tags;
    if (inputTagsValue && tags.indexOf(inputTagsValue) === -1) {
      tags = [...tags, inputTagsValue];
    }
    this.setState({
      tags,
      inputTagsVisible: false,
      inputTagsValue: ''
    });
  };
  //post article on blockchain and in backend db
  onPostClick = () => {
    const {dispatch} = this.props;
    const {title, value, tags} = this.state;
    dispatch(postArticle(title, value.toString('markdown'), tags));
  };
  refInputTags = input => this.inputTags = input;
  render() {
    const {value, tags, inputTagsVisible, inputTagsValue} = this.state;
    const {isPosting} = this.props.articles;

    return (
      <div className="editor">
        <Content>
          <Input
            placeholder="Title"
            onChange={this.handleInputTitleChange}
          />
          <RichTextEditor
            value={value}
            onChange={this.onChange}
            autoFocus={true}
            className="editor-rte"
          />
          <div className="editor-tags">
            {tags.map((tag, index) => {
              return (
                <Tag key={tag} closable={index !== 0} color={(index > 0 ? 'blue' : 'magenta')} afterClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
              );
            })}
            {inputTagsVisible && (
              <Input
                ref={this.refInputTags}
                type="text"
                size="small"
                style={{width: 200}}
                value={inputTagsValue}
                onChange={this.handleInputTagsChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputTagsVisible && (tags.length < 5) && (
              <Tag onClick={this.showInputTags} style={{background: '#fff', borderStyle: 'dashed'}}
              >
                <Icon type="plus" /> Add Tag
              </Tag>
            )}
          </div>
          <Button type="primary" onClick={this.onPostClick} loading={isPosting}>Post</Button>
        </Content>
      </div>
    );
  }
}

NewContribution.propTypes = {
  onChange: PropTypes.func,
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(NewContribution));
