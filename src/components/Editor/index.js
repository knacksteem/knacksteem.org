import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import RichTextEditor from 'react-rte';
import {Input, AutoComplete, Tag, Icon, Button,Row, message, Col } from 'antd';
import {postArticle, editArticle} from '../../actions/articles';
import './index.css';

/**
 * Editor component for comments and articles
 */
class Editor extends Component {
  constructor(props) {
    super(props);
    const {articleData, isComment} = props;
    this.state = {
      title: (articleData && !isComment) ? articleData.title : '',
      value: articleData ? RichTextEditor.createValueFromString(articleData.description, 'markdown') : RichTextEditor.createEmptyValue(),
      tags: (articleData && !isComment) ? articleData.tags : ['knacksteem'],
      inputTagsVisible: false,
      inputTagsValue: '',
      previewMarkdown: '',
      editor: false
    };
  }
  //will be called whenever the content of the editor changes
  onChange = (value) => {
    this.setState({
      value,
      previewMarkdown: value.toString('markdown')
    });
  };
  //callback for removing a tag
  handleCloseTag = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({tags});
  };
  //will get called when you click the "add tag" button, to show the input field for a new tag
  showInputTags = () => {
    //show input field for new tag and set focus to input or autocomplete (autocomplete for category tag)
    this.setState({inputTagsVisible: true, inputTagsValue: ''}, () => {
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
  onPostClick = async () => {
    const {dispatch, isComment, isEdit, articleData, onDone, parentPermlink, parentAuthor} = this.props;
    const {title, value, tags} = this.state;

    if (this.checkFieldErrors()) {
      return;
    }

    try {
      if (isEdit) {
        await dispatch(editArticle(title, value.toString('markdown'), tags, articleData, isComment, parentPermlink, parentAuthor));
      } else {
        await dispatch(postArticle(title, value.toString('markdown'), tags, isComment, parentPermlink, parentAuthor));
      }
      if (onDone) {
        onDone();
      }
    } catch(err) {
      //already handled in redux actions
    }
  };
  //check for correct input before posting/editing
  checkFieldErrors = () => {
    const {title, value, tags} = this.state;
    const {isComment} = this.props;
    const {categories} = this.props.articles;
    let error = false;

    //check if title is existing
    if (!isComment && !title.length) {
      message.error('title is missing');
      error = true;
    }
    //check if there is something in the rich text editor
    if (!value.getEditorState().getCurrentContent().hasText()) {
      message.error('content is missing');
      error = true;
    }
    //check if the second tag is one of the predefined categories
    if (!isComment && categories.map(elem => elem.key).indexOf(tags[1]) === -1) {
      message.error('second tag must be one of the predefined categories');
      error = true;
    }

    return error;
  };
  //reference to default input for new tags
  refInputTags = input => this.inputTags = input;
  //reference to autocomplete input for second tag (category)
  refInputTagsAutoComplete = input => this.inputTagsAutoComplete = input;
  render() {
    const {title, value, tags, inputTagsVisible, inputTagsValue, previewMarkdown} = this.state;
    const {isComment, isEdit, onCancel} = this.props;
    const {isBusy, categories} = this.props.articles;

    return (
      <div className="editor">
        <h3>Title</h3>
        {!isComment && <Input style={{
                                      backgroundColor: '#eee', 
                                      fontWeight: 'bolder', 
                                      border: '2px solid #e8e8e8'
                                    }} placeholder="Title" onChange={this.handleInputTitleChange} value={title} />}
        
        <Row type='flex' justify="space-between">
              <Col>
                <h3>Story</h3>
              </Col>
              <Col>
              <a href="#"><p>markdown</p></a>
              </Col>
            </Row>
        <RichTextEditor
          value={value}
          onChange={this.onChange}
          autoFocus={true}
          className="editor-rte"
          
        />
        <h3>Tags</h3>
        {!isComment &&
          <div className="editor-tags">
            {tags.map((tag, index) => {
              return (
                <Tag key={tag} closable={index > 1 || (index === 1 && !isEdit)} color={(index > 0 ? 'blue' : 'magenta')} afterClose={() => this.handleCloseTag(tag)}>{tag}</Tag>
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
                <Icon type="plus"/> Add Tag
              </Tag>
            )}
          </div>
        }
        <Row style={{width: '100%'}} >
          <Button  block style={{width: 'inherit', backgroundColor: "#22429d"}} type="primary" onClick={this.onPostClick} loading={isBusy}>{isEdit ? 'Update' : 'Post'}</Button>
          {onCancel && <Button block type="secondary" onClick={onCancel} className="button-cancel">Cancel</Button>}
        </Row>
        
        
          <ReactMarkdown className={"preview"}  source={previewMarkdown} />
       
        <Row type="flex" className="preview">

        </Row>
          
      </div>
    );
  }
}

Editor.propTypes = {
  dispatch: PropTypes.func,
  articles: PropTypes.object, //access to articles reducer
  isComment: PropTypes.bool, //is comment or article (which is a comment too in the blockchain, to be specific)
  isEdit: PropTypes.bool, //editor is for editing a post or for creating a new one
  articleData: PropTypes.object, //data of existing article for editing
  onCancel: PropTypes.func, //will get called on cancel click
  onDone: PropTypes.func, //will get called on post/update click
  parentPermlink: PropTypes.string,
  parentAuthor: PropTypes.string
};

Editor.defaultProps = {
  isComment: false,
  isEdit: false
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(Editor));
