import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { throttle } from 'lodash';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { HotKeys } from 'react-hotkeys';
import isArray from 'lodash/isArray';
import Dropzone from 'react-dropzone';
import {Input, Icon, Button,Row, Alert, Col, Form, Select} from 'antd';
import {editArticle} from '../../actions/articles';
import EditorToolbar from './EditorToolBar';
import './index.css';

/**
 * Editor component for comments and articles
 */
class Editor extends Component {
  constructor(props) {
    super(props);
    const {articleData, isComment} = props;

    this.state = {
      contentHtml: '',
      noContent: false,
      imageUploading: false,
      dropzoneActive: false,
      title:  '',
      value:  '',
      notOnDom: false,
      loading: false,
      loaded: false,
      previewMarkdown: '',
      tags: (articleData && !isComment) ? articleData.tags : ['knacksteem'],
      isMarkdownEditorActive: false,
      previewState: false
    };
  
    this.renderItems = this.renderItems.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
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

  /**
   * @method renderItems 
   * 
   * @params {Object} items
   * 
   * @retun {Object}
   */

  renderItems(items) {
    return items;
  }

  componentWillReceiveProps(nextProps){
  const {articleData} = nextProps;

  
  if (this.state.notOnDom){
    this.setValues(articleData);
    this.setState({
      notOnDom: true
    })
  }
  }

  componentDidMount() {
    if (this.input) {
      this.input.addEventListener('input', throttle(e => this.renderMarkdown(e.target.value), 500));
      this.input.addEventListener('paste', this.handlePastedImage);
    }


    // eslint-disable-next-line react/no-find-dom-node
    const select = ReactDOM.findDOMNode(this.select);
    if (select) {
      const selectInput = select.querySelector('input,textarea,div[contentEditable]');
      if (selectInput) {
        selectInput.setAttribute('autocorrect', 'off');
        selectInput.setAttribute('autocapitalize', 'none');
      }
    }
    const {articleData, isEdit} = this.props;
    if(isEdit){
      this.setValues(articleData);
    }
  }

/**
 * @method setInput
 * 
 * @param {elem} input - input element on the Dom 
 * 
 * @return <void>
 */
  setInput = (input) => {
     this.input = ReactDOM.findDOMNode(input);
  };


  /**
   * @method renderMarkdown 
   * 
   * @param {String} value - text in the editor
   * 
   * @return <void></void>
   */
  renderMarkdown = (value) => {
    this.setState({
      contentHtml: value,
    });
  };

  /**
   * @method insertCode
   * 
   * @param {String} type -- type of code to be entered as markdown e.g H1 is #
   * 
   * @return <void>
   */
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

/**
 * @method resizeTextarea
 * 
 * @param {Void}
 * 
 * @return {Void}
 */
  resizeTextarea = () => {
    if (this.originalInput) this.originalInput.resizeTextarea();
  };

  /**
   * @method handleSubmit 
   * 
   * @param {Object} e -- event 
   * 
   * @return {Object}
   */
  handleSubmit = (e) => {
    
    e.preventDefault();
    this.onUpdate(e);
    this.props.form.validateFieldsAndScroll((err, values) => {
      
     if (!err && this.input.value !== '') {
      values = {...values, body: this.input.value}
        if (this.props.isEdit){
          const {articleData, isComment, dispatch, onDone, parentPermlink, parentAuthor} = this.props;
          dispatch(editArticle(values.title, values.body, values.tags, articleData, isComment, parentPermlink, parentAuthor));
          if (onDone) {
            onDone();
          }
        }else {
          this.props.onSubmit({
            ...values,
            body: this.input.value,
         });
        }
        
        
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
        this.props.form.getFieldError(errors)
      } else {
        
      }
    });
  };

/**
 * @method handlePastedImage
 * 
 * @param {Object} e --  event
 * 
 * @return <void>
 **/

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

  /**
   * @method handleImageChange
   * 
   * @param {Object} e -- event
   * 
   * @return <void>
   */

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

  /**
   * @method handleDrop
   * 
   * @param {Array} files -- images
   * 
   * @return <void>
   */

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

  /**
   * @method handleDragEnter -- method to handle draging files into the Editor
   */

  handleDragEnter = () => this.setState({ dropzoneActive: true });

  /**
   * @method handleDragLeave -- method to handle drag leaving into the Editor
   */

  handleDragLeave = () => this.setState({ dropzoneActive: false });

  /**
   * @method insertAtCursor 
   * 
   * @param {String} before -- point before selection
   * 
   * @param {String} after -- point before selection
   * 
   * @param {String} deltaStart -- point of starting selection
   * 
   * @param {String} deltaEnd -- point of ending selection
   * 
   * @return <void>
   */

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

/**
 * @method onUpdate
 * 
 * @param {Object} e onchange event from the form input
 */

  onUpdate = (e) => { 
    const {isEdit} = this.props;

    if (!isEdit){
      const values =  this.getValues(e);
      this.props.onUpdate(values);
    }else {
      this.getValues(e);
    }
    
  };

/**
 * @method insertImage 
 * 
 * @param {String} image -- image url
 * 
 * @param {String} imageName -- image name but a default of image is set.
 * 
 * @return <void></void>
 */
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

/**
 * @method checkTags -- method to validate tags for any error
 * 
 * @param {Array} rule -- all rules to validate
 * 
 * @param {Array} value -- all values from tag selection
 * 
 * @param {Function} callback -- callback funtion
 */

checkTags = (rule, value, callback) => {
    
    if (!value || value.length < 1 || value.length > 4) {
      callback('You have to add 1 to 4 tags');
    };

    if (value){
      const {isComment} = this.props;
      const {categories} = this.props.articles;
      if (!isComment && categories.map(elem => elem.key).indexOf(value[0]) === -1) {
        callback('first tag must be any of the following; graphics, art, vlog, knack, techtrends ');
      }   
    }
    if(value) {
      value
      .map(tag => ({ tag, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(tag) }))
      .filter(tag => !tag.valid)
      .map(tag => callback(`Tag ${tag.tag} is invalid`));
    }
    

    callback();
};

  setValues = (post) => {
    const {isEdit} = this.props
    if(isEdit){
      this.props.form.setFieldsValue({
        title: post.title,
        tags: post.tags.filter(tags => tags !== 'knacksteem')
      });
    } else {
      this.props.form.setFieldsValue({
        title: post.title,
        tags: post.tags
      });
    }

    if (isEdit) {
      if (this.input && post.description !== '') {
        this.input.value = post.description;
        this.renderMarkdown(this.input.value);
        this.resizeTextarea();
      }
    } else {
      if (this.input && post.body !== '') {
        this.input.value = post.body;
        this.renderMarkdown(this.input.value);
        this.resizeTextarea();
      }
    }
    
  };

/**
 * @method getValue --- antd API is inconsistent and returns event or just value depending of input type.
 * ---this code extracts value from event based of event type
 * ---(array or just value for Select, proxy event for inputs and checkboxes)
 * 
 * @param {Object} e -- event
 * 
 * @param {Array} tags
 * 
 * @return {Object}
 */
  getValues = (e) => {
    const {isEdit} =this.props
    

    if (isEdit) {
      const values = {
        ...this.props.form.getFieldsValue(['title', 'tags']),
        body: this.input.value,
      };

      if (!e) return values;

      if (isArray(e)) {
        values.tags = [...['knacksteem'], ...e];
      }
      this.setState({
        previewMarkdown: this.input.value.toString('markdown')
      });

      return values;

    } else {
      const values = {
        ...this.props.form.getFieldsValue(['title', 'tags']),
        body: this.input.value,
      };

      if (!e) return values;

      if (isArray(e)) {
        values.tags = [...['knacksteem'], ...e];
      }

      this.setState({
        previewMarkdown: this.input.value.toString('markdown')
      });

      return values;
    }
    

    
  };

 /**
  * @method handleEditorToggle -- method to toggle editortoolbar
  */
  handleEditorToggle() {
    this.setState({
      isMarkdownEditorActive: !this.state.isMarkdownEditorActive
    });
  }

  /**
   * @method handlePreview -- method shows the preview
   * 
   */
  handlePreview () {
    this.setState({
      previewState: !this.state.previewState
    });
  } 


  //reference to default input for new tags
  refInputTags = input => this.inputTags = input;

  //reference to autocomplete input for second tag (category)
  refInputTagsAutoComplete = input => this.inputTagsAutoComplete = input;

  render() {
    const { previewMarkdown, previewState } = this.state;
    const { form, isComment, isEdit } = this.props;
    const { isBusy} = this.props.articles;
    const { isMarkdownEditorActive } = this.state;
    return (
    <Row type="flex" style={{width: '100%'}}>
      <Form layout="vertical" onSubmit={ this.handleSubmit} style={{width: '100%'}}>
        <div  className={` ${isMarkdownEditorActive ? 'markdown-editor-is-active' : 'markdown-editor-is-inactive'}`}>
          <Form.Item>
            <h3>Title</h3>
            {!isComment && form.getFieldDecorator('title', {
              rules: [{ required: true, message: 'Title cant be Empty!' }],
              })(<Input
                  ref={(title) => {
                    this.title = title;
                  }}
                  style={{fontWeight: '900'}}
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
            <Form.Item 
            validateStatus={
                this.state.noContent ? 'error' : ''
              }
              help={
                this.state.noContent && <Alert message="Content can't be empty" type="error" showIcon />
                }>
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
          <Row style={{marginTop: '20px'}} className="Editor__imagebox">
            <input type="file" id="inputfile" onChange={this.handleImageChange} />
            <label htmlFor="inputfile">
              {this.state.imageUploading ? (
                <div>
                  <Icon type="loading" />
                </div>
                  
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
          <Form.Item
              label={
                <span className="Editor__tags">
                Tags
              </span>
              }
              extra='Separate tags with commas. Only lowercase letters, numbers and hyphen character is permitted.'
            >
              { !isComment && form.getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter some tags',
                    type: 'array',
                  },
                  { validator: this.checkTags },
                ],
              })(
                <Select
                  ref={(ref) => {
                    this.select = ref;
                  }}
                  onChange={this.onUpdate}
                  className="Editor__tags"
                  mode="tags"
                  placeholder='Add story tag here'
                  dropdownStyle={{ display: 'none' }}
                  tokenSeparators={[' ', ',']}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Row type="flex" justify="end" >
                <Col>
                  <Button onClick={()=>this.handlePreview()} style={{marginRight: '5px'}}>
                    <p>{previewState ? 'Close Preview' : 'Preview'}</p>
                  </Button>
                </Col>
                <Col>
                  <Button
                    style={{
                      backgroundColor: '#22429d'
                    }}
                    htmlType='submit'
                    type={'primary'}
                    loading={isBusy}>
                      {isEdit ? 'Update' : 'Post'}
                  </Button>

                  </Col>
                
                </Row>
              </Form.Item>
              <Form.Item>
                <div style={{
                  maxWidth: '100%', 
                  wordWrap: 'break-word', 
                  border: `${previewState ? '1px solid #22429d' : 'none'}`, 
                  padding: '3px'
                  }}>
                  <ReactMarkdown className={`'preview' ${previewState ? 'preview-active' : 'preview-inactive'}`} source={previewMarkdown}/>
                </div>
                <Row  style={{maxWidth: '100%'}} className='preview'> 
                </Row>
              </Form.Item>
   
        </div>
        </Form>
      </Row>
    );
  }
}

Editor.propTypes = {
  dispatch: PropTypes.func,
  articles: PropTypes.object, //access to articles reducer
  isComment: PropTypes.bool, //is comment or article (which is a comment too in the blockchain, to be specific)
  isEdit: PropTypes.bool, //editor is for editing a post or for creating a new one
  articleData: PropTypes.object, //data of existing article for editing
};

Editor.defaultProps = {
  isComment: false,
  isEdit: false
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default connect(mapStateToProps)(Form.create()(Editor));