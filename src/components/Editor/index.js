import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { throttle } from 'lodash';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { HotKeys } from 'react-hotkeys';
import Dropzone from 'react-dropzone';
import {Input, AutoComplete, Tag, Icon, Button,Row, message, Col, Form } from 'antd';
import EditorToolbar from './EditorToolBar';
import './index.css';

/**
 * Editor component for comments and articles
 */
class Editor extends Component {
  constructor(props) {
    super(props);
    const {articleData, isComment} = props;

    console.log(props);
    this.state = {
      contentHtml: '',
      noContent: false,
      imageUploading: false,
      dropzoneActive: false,
      value: '',
      loading: false,
      loaded: false,
      tags: (articleData && !isComment) ? articleData.tags : ['knacksteem'],
      inputTagsVisible: false,
      inputTagsValue: '',
      previewMarkdown: '',
      isMarkdownEditorActive: false
    };
  
    this.renderItems = this.renderItems.bind(this);
  }

  static hotkeys = {
    h1: 'ctrl+shift+1',
    h2: 'ctrl+shift+2',
    h3: 'ctrl+shift+3',
    h4: 'ctrl+shift+4',
    h5: 'ctrl+shift+5',
    h6: 'ctrl+shift+6',
    bold: 'ctrl+b',
    italic: 'ctrl+i',
    quote: 'ctrl+q',
    link: 'ctrl+k',
    image: 'ctrl+m',
    code: 'ctrl+n',
    unorderedlist: 'ctrl+shift+i'
  };

  renderItems(items) {
    return items;
  }

  

  componentDidMount() {
    if (this.input) {
      this.input.addEventListener('input', throttle(e => this.renderMarkdown(e.target.value), 500));
      this.input.addEventListener('paste', this.handlePastedImage);
    }

    // this.setValues(this.props);

    // eslint-disable-next-line react/no-find-dom-node
    const select = ReactDOM.findDOMNode(this.select);
    if (select) {
      const selectInput = select.querySelector('input,textarea,div[contentEditable]');
      if (selectInput) {
        selectInput.setAttribute('autocorrect', 'off');
        selectInput.setAttribute('autocapitalize', 'none');
      }
    }

  }

  setInput = (input) => {
     this.input = ReactDOM.findDOMNode(input);
  };

  renderMarkdown = (value) => {
    this.setState({
      contentHtml: value,
    });
  };

  insertCode = (type) => {
    if (!this.input) return;
    this.input.focus();

    switch (type) {
      case 'h1':
        this.insertAtCursor('# ', '', 2, 2);
        break;
      case 'h2':
        this.insertAtCursor('## ', '', 3, 3);
        break;
      case 'h3':
        this.insertAtCursor('### ', '', 4, 4);
        break;
      case 'h4':
        this.insertAtCursor('#### ', '', 5, 5);
        break;
      case 'h5':
        this.insertAtCursor('##### ', '', 6, 6);
        break;
      case 'h6':
        this.insertAtCursor('###### ', '', 7, 7);
        break;
      case 'b':
        this.insertAtCursor('**', '**', 2, 2);
        break;
      case 'i':
        this.insertAtCursor('*', '*', 1, 1);
        break;
      case 'q':
        this.insertAtCursor('> ', '', 2, 2);
        break;
      case 'link':
        this.insertAtCursor('[', '](url)', 1, 1);
        break;
      case 'image':
        this.insertAtCursor('![', '](url)', 2, 2);
        break;
      case 'code':
        this.insertAtCursor('``` language\n', '\n```', 4, 12);
        break;
      case 'unorderedlist':
        this.insertAtCursor('- ', '', 2, 2);
        break;
      default:
        break;
    }

    this.resizeTextarea();
    this.renderMarkdown(this.input.value);
    this.onUpdate();
  };

  handlers = {
    h1: () => this.insertCode('h1'),
    h2: () => this.insertCode('h2'),
    h3: () => this.insertCode('h3'),
    h4: () => this.insertCode('h4'),
    h5: () => this.insertCode('h5'),
    h6: () => this.insertCode('h6'),
    bold: () => this.insertCode('b'),
    italic: () => this.insertCode('i'),
    quote: () => this.insertCode('q'),
    link: (e) => {
      e.preventDefault();
      this.insertCode('link');
    },
    image: () => this.insertCode('image'),
    code: () => this.insertCode('code'),
    unorderedlist: () => this.insertCode('unorderedlist')
  };

  resizeTextarea = () => {
    if (this.originalInput) this.originalInput.resizeTextarea();
  };

  handleSubmit = (e) => {
    // NOTE: Wrapping textarea in getFormDecorator makes it impossible
    // to control its selection what is needed for markdown formatting.
    // This code adds requirement for body input to not be empty.
    e.preventDefault();
    this.onUpdate(e);
    return;
    this.props.form.validateFieldsAndScroll((err, values) => {
      
      if (!err && this.input.value !== '') {

        this.props.onSubmit({
          ...values,
          body: this.input.value,
        });
      } else if (this.input.value === '') {
        const errors = {
          ...err,
          body: {
            errors: [
              {
                field: 'body',
                message: "Content can't be empty",
              },
            ],
          },
        };
        this.setState({ noContent: true });
        this.props.onError(errors);
      } else {
        this.props.onError(err);
      }
    });
  };


//
// Editor methods
//

  handlePastedImage = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      Array.from(items).forEach((item) => {
        if (item.kind === 'file') {
          e.preventDefault();

          this.setState({
            imageUploading: true,
          });

          const blob = item.getAsFile();
          this.props.onImageInserted(blob, this.insertImage, () =>
            this.setState({
              imageUploading: false,
            }),
          );
        }
      });
    }
  };

  handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      this.setState({
        imageUploading: true,
      });
      this.props.onImageInserted(e.target.files[0], this.insertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      // Input reacts on value change, so if user selects the same file nothing will happen.
      // We have to reset its value, so if same image is selected it will emit onChange event.
      e.target.value = '';
    }
  };

  handleDrop = (files) => {
    if (files.length === 0) {
      this.setState({
        dropzoneActive: false,
      });
      return;
    }

    this.setState({
      dropzoneActive: false,
      imageUploading: true,
    });
    let callbacksCount = 0;
    Array.from(files).forEach((item) => {
      this.props.onImageInserted(
        item,
        (image, imageName) => {
          callbacksCount += 1;
          this.insertImage(image, imageName);
          if (callbacksCount === files.length) {
            this.setState({
              imageUploading: false,
            });
          }
        },
        () => {
          this.setState({
            imageUploading: false,
          });
        },
      );
    });
  };

  handleDragEnter = () => this.setState({ dropzoneActive: true });

  handleDragLeave = () => this.setState({ dropzoneActive: false });

  insertAtCursor = (before, after, deltaStart = 0, deltaEnd = 0) => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    this.input.value =
      this.input.value.substring(0, startPos) +
      before +
      this.input.value.substring(startPos, endPos) +
      after +
      this.input.value.substring(endPos, this.input.value.length);

    this.input.selectionStart = startPos + deltaStart;
    this.input.selectionEnd = endPos + deltaEnd;
  };

  onUpdate = (e) => { 
      const values =  this.getValues(e, this.state.tags);
      this.props.onUpdate(values);
  };

  insertImage = (image, imageName = 'image') => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const imageText = `![${imageName}](${image})\n`;
    this.input.value = `${this.input.value.substring(
      0,
      startPos,
    )}${imageText}${this.input.value.substring(endPos, this.input.value.length)}`;
    this.resizeTextarea();
    this.renderMarkdown(this.input.value);
    this.setInputCursorPosition(startPos + imageText.length);
    this.onUpdate();
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

  setValues = (post) => {
    this.props.form.setFieldsValue({
      title: post.title,
    });
    if (this.input && post.body !== '') {
      this.input.value = post.body;
      this.renderMarkdown(this.input.value);
      this.resizeTextarea();
    }
  };


  getValues = (e, tags) => {
    // NOTE: antd API is inconsistent and returns event or just value depending of input type.
    // this code extracts value from event based of event type
    // (array or just value for Select, proxy event for inputs and checkboxes)

    const values = {
      title: this.props.form.getFieldsValue(['title']).title,
      body: this.input.value,
      tags
    };

    // values.title = e.target.value;
    this.setState({
      previewMarkdown: this.input.value.toString('markdown')
    });


    if (!e) return values;

    return values;
  };

 

  //toggle Editor display
  handleEditorToggle() {
    this.setState({
      isMarkdownEditorActive: !this.state.isMarkdownEditorActive
    });
  }
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
    const { tags, inputTagsVisible, inputTagsValue, previewMarkdown} = this.state;
    const {form, isComment, isEdit, onCancel} = this.props;
    const {isBusy, categories} = this.props.articles;
    const {isMarkdownEditorActive} = this.state;
    return (
    <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
      <div  className={`editor ${isMarkdownEditorActive ? 'markdown-editor-is-active' : 'markdown-editor-is-inactive'}`}>
        <Form.Item>
          <h3>Title</h3>
          {!isComment && form.getFieldDecorator('title')(<Input
                ref={(title) => {
                  this.title = title;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder='Add title'
            />)
          }
        </Form.Item>
        
        
        <Row type="flex" justify="space-between">
          <Col>
            <h3>Story</h3>
          </Col>
          <Col>
            <a onClick={e=>this.handleEditorToggle(e)}>
              <p>{ isMarkdownEditorActive ? 'visual' : 'markdown' }</p>
            </a>
          </Col>
        </Row>
        <Row style={{border: '1px solid #eee', padding: '10px', background: '#fff', minHeight: '500px'}}>
          <Form.Item>
          <EditorToolbar onSelect={this.insertCode} style={{margin: 'auto'}}/>
          <Row className="Editor__dropzone-base" style={{width: 'inherit', height: '400px'}}>
                <Dropzone
                  disableClick
                  style={{}}
                  accept="image/*"
                  onDrop={this.handleDrop}
                  onDragEnter={this.handleDragEnter}
                  onDragLeave={this.handleDragLeave}
                >
                  {this.state.dropzoneActive && (
                    <div className="Editor__dropzone">
                      <div>
                        <i className="iconfont icon-picture" />
                        <p> Drop your images here...</p>
                      </div>
                    </div>
                  )}
                  <HotKeys keyMap={Editor.hotkeys} handlers={this.handlers}>
                  <Input.TextArea
                      className="editor_input"
                      style={{ border: 'none', height: '450px', marginTop: '10px', boxShadow: 'none'}}
                      autosize={{ minRows: 20, maxRows: 20 }}
                      onChange={this.onUpdate}
                      ref={ref => this.setInput(ref)}
                      placeholder='Write your story...'
                    />
                  </HotKeys>
                </Dropzone>
            </Row>
          </Form.Item>
        </Row>
        <Row className="Editor__imagebox">
              <input type="file" id="inputfile" onChange={this.handleImageChange} />
              <label htmlFor="inputfile">
                {this.state.imageUploading ? (
                    <Icon type="loading" />
                  ) : (
                    <i className="iconfont icon-picture" />
                  )}
                {this.state.imageUploading ? (
                    <p>Upload your image...</p>
                  ) : (
                    <p>Select image or paste it from the clipboard.</p>
                  )}
              </label>
        </Row>
        <Form.Item>
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
        </Form.Item>
       
       <Form.Item>
          <Row type="flex" justify="end" >
            <Col>
              <Button style={{marginRight: '5px'}}>
                Preview
              </Button>
            </Col>
            <Col>
              <Button
                style={{
                  backgroundColor: '#22429d'
                }}
                htmlType="submit"
                type={'primary'}
                loading={isBusy}>
                  {isEdit ? 'Update' : 'Post'}
              </Button>
            </Col>
          </Row>
          </Form.Item>
          <Row type="flex" className="preview">
            
          </Row> 
      </div>
      </Form>
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

export default connect(mapStateToProps)(Form.create()(Editor));
