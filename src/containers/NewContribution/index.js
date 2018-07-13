import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import RichTextEditor from 'react-rte';
import {Layout, Input, AutoComplete, Tag, Icon, Button, Divider} from 'antd';
import {postArticle} from '../../actions/articles';
import './index.css';
const {Content} = Layout;

/**
 * Route for adding a new article/contribution with rich text editor
 */
class NewContribution extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'testtitle',
      value: RichTextEditor.createEmptyValue(),
      tags: ['knacksteem'],
      inputTagsVisible: false,
      previewMarkdown: ''
    };
  }
  //will be called whenever the content of the editor changes
  onChange = (value) => {
    this.setState({
      value,
      previewMarkdown: value.toString('markdown')
    });
  };
  //callbcack for removing a tag
  handleCloseTag = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({tags});
  };
  //will get called when you click the "add tag" button, to show the input field for a new tag
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
  //store input change in state - autocomplete input only sends the value as parameter
  handleInputTagsChange = (e) => {
    const {tags} = this.state;
    const {categories} = this.props.articles;

    //if second tag not in categories list, do not allow to add character
    if (tags.length === 1 && !e.target && !categories.filter((elem) => elem.key.indexOf(e.toLowerCase()) !== -1).length) {
      return;
    }
    this.setState({inputTagsValue: e.target ? e.target.value : e});
  };
  //callback for changing the value of the title input
  handleInputTitleChange = (e) => {
    this.setState({title: e.target.value});
  };
  //callback for confirming a new tag, will get called on enter, mouse click (autocomplete input) and on blur
  handleInputConfirm = (value) => {
    const {inputTagsValue, tags} = this.state;
    const {categories} = this.props.articles;
    let newTags = tags;
    const categoriesFlat = categories.map(elem => elem.key);
    const newTagValue = this.inputTags ? inputTagsValue : value;

    //check if second tag is one of the categories and do not allow to add tag if it is not
    if (tags.length === 1 && categoriesFlat.indexOf(newTagValue) === -1) {
      this.setState({
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
  //reference to default input for new tags
  refInputTags = input => this.inputTags = input;
  //reference to autocomplete input for second tag (category)
  refInputTagsAutoComplete = input => this.inputTagsAutoComplete = input;
  render() {
    const {value, tags, inputTagsVisible, inputTagsValue, previewMarkdown} = this.state;
    const {isBusy, categories} = this.props.articles;

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
          <Button type="primary" onClick={this.onPostClick} loading={isBusy}>Post</Button>
          <Divider />
          <ReactMarkdown source={previewMarkdown} />
        </Content>
      </div>
    );
  }
}

NewContribution.propTypes = {
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(NewContribution));
