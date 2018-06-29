import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import {Layout, Input, AutoComplete, Tag, Icon, Button} from 'antd';
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
    //show input field for new tag and set focus to input or autocomplete (autocomplete for category tag)
    this.setState({inputTagsVisible: true}, () => {
      if (this.inputTags) {
        this.inputTags.focus();
      } else {
        this.inputTagsAutoComplete.focus();
      }
    });
  };
  handleInputTagsChange = (e) => {
    //store input change in state - autocomplete input only sends the value as parameter
    this.setState({inputTagsValue: e.target ? e.target.value : e});
  };
  handleInputTitleChange = (e) => {
    this.setState({title: e.target.value});
  };
  handleInputConfirm = (value) => {
    const {inputTagsValue, tags} = this.state;
    const {categories} = this.props.articles;
    let newTags = tags;
    const categoriesFlat = categories.map(elem => elem.key);
    const newTagValue = this.inputTags ? inputTagsValue : value;

    //check if second tag is one of the categories and do not allow to add tag if it is not
    if (tags.length === 1 && categoriesFlat.indexOf(newTagValue) === -1) {
      this.setState({
        tags: newTags,
        inputTagsVisible: false,
        inputTagsValue: ''
      });
      return;
    }

    if (newTagValue && tags.indexOf(newTagValue) === -1) {
      newTags = [...newTags, newTagValue];
    }
    this.setState({
      tags: newTags,
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
  refInputTagsAutoComplete = input => this.inputTagsAutoComplete = input;
  render() {
    const {value, tags, inputTagsVisible, inputTagsValue} = this.state;
    const {isPosting, categories} = this.props.articles;

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
            {inputTagsVisible && (tags.length >= 2) && (
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
            {inputTagsVisible && (tags.length === 1) && (
              <AutoComplete
                ref={this.refInputTagsAutoComplete}
                dataSource={categories.map(elem => elem.key)}
                style={{width: 200}}
                value={inputTagsValue}
                filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                onChange={this.handleInputTagsChange}
                onBlur={this.handleInputConfirm}
                onSelect={this.handleInputConfirm}
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
