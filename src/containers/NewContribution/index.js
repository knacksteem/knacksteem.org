import React from 'react';
import { Row, Col} from 'antd';
import Editor from '../../components/Editor';
import debounce from 'lodash/debounce';
import kebabCase from 'lodash/kebabCase';



/**
 * Route for adding a new article/contribution with rich text editor
 */
class  NewContribution extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      initialTitle: '',
      initialBody: '',
      isUpdating: false,
      parsedPostData: null,
      banned: false,
    };

  }


  onUpdate = debounce(form => {
    const data = this.getNewPostData(form)
    this.setState({parsedPostData: data})
  }, 400);


  handleImageInserted = (blob, callback, errorCallback) => {
    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://test.api`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => {
        errorCallback();
      });


  };

  render() {
    return (
      <Row type="flex" justify="center" className="editor-container">
        <Col
          type="flex"
          style={{
            minHeight: '780px',
            width: '90vw'
          }}>
          <Editor isComment={false} 
                  isEdit={false}
                  ref={this.setForm}
                  onSubmit={this.onSubmit}
                  onUpdate={this.onUpdate}
                  onImageInserted={this.handleImageInserted}
                  />
        </Col>
      </Row>
    );
  }

};

export default NewContribution;
