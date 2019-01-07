import React from 'react';
import { Row, Col} from 'antd';
import Editor from '../../components/Editor';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import {postArticle} from '../../actions/articles';
import {HowToPost} from '../../components/HowToPost/'
import './index.css';



/**
 * Route for adding a new article/contribution with rich text editor
 */
class  NewContribution extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      isUpdating: false,
      parsedPostData: null,
      banned: false,
      isEdit: false,
      isComment: false,
      tags: ['knacksteem']
    };
  }
  
  
  onUpdate = form => {
    const data = this.getNewPostData(form)
    this.setState({parsedPostData: data})
  };

  /**
   * @method handleImageInserted
   * 
   * @param {String} blob 
   * 
   * @param {Function} callback - to resolve promise
   * 
   * @param {Function} errorCallback - to handle error
   * 
   * @return <promise>
   */


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

  /**
   * @method getNewPostData
   * 
   * @param {Object} form - gotten from the form HOC 
   * 
   * @return {Object}
   */

  getNewPostData = (form) => {
    
    const data = {
      body: form.body,
      title: form.title,
      tags: form.tags
    };

    // if(form.tags === undefined){
    //   return
    // } else {
    //   data.tags = [...this.state.tags, ...form.tags]
    // }
    
    data.parentAuthor =  '';

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;
    data.parentPermlink = '';
    return data;
  };

/**
 * @method onsubmit
 * 
 * @param {void}
 * 
 * @return {void} 
 */
  onSubmit = () => {
    const form = this.state.parsedPostData;
    const data = this.getNewPostData(form);
    this.setState({parsedPostData: data});
    this.proceedSubmit(data.tags);
  };

  /**
   * @method proceedSubmit
   * 
   * @param {Array} -Tags entered by the user on the editor
   * 
   * @return <void>
   */

  proceedSubmit = (tags) => {
    const {isComment, parsedPostData} = this.state;
    const {dispatch, onDone} = this.props;
 
      dispatch(postArticle(parsedPostData.title, parsedPostData.body, tags, isComment, parsedPostData.parentPermlink, parsedPostData.parentAuthor)); 

    if (onDone) {
      onDone();
    }
  }

  render() {

    return (
      <Row type="flex" style={{ width: '75%'}} >
        <Row  style={{width: '67%'}} type="flex" className="editor-container" >
          <Col style={{width: '100%'}}>
            <Editor isComment={false} 
                    isEdit={false}
                    ref={this.setForm}
                    onSubmit={(e)=>{ this.onSubmit()}}
                    onUpdate={this.onUpdate}
                    onImageInserted={this.handleImageInserted}
            />
          </Col> 
        </Row>
        <Row type="flex" justify="center" style={{width: '33%'}} className="how-to-post-container" >
          <Col style={{position: 'fixed'}} className="htp-inner-container">
            <HowToPost/>
          </Col>
        </Row>
      </Row>
    );
  }

};

NewContribution.propTypes = {
  dispatch: PropTypes.func,
  articles: PropTypes.object,
  isComment: PropTypes.bool, //is comment or article (which is a comment too in the blockchain, to be specific)
  isEdit: PropTypes.bool, //editor is for editing a post or for creating a new one
  onDone: PropTypes.func, //will get called on post/update click
  parentPermlink: PropTypes.string,
  parentAuthor: PropTypes.string,
  user: PropTypes.object
};


const mapStateToProps = state => ({
  articles: state.articles,
  user: state.user
});

export default withRouter(connect(mapStateToProps)(NewContribution));
