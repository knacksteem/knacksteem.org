import React from 'react';
import {Row, Col, message} from 'antd';
import Editor from '../../components/Editor';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import {postArticle} from '../../actions/articles';
import {HowToPost} from '../../components/HowToPost/';
import {push} from 'react-router-redux';
import S3 from '../../services/DigitalOcean';
import Config from '../../config';
import { uniqueKeyName } from '../../services/functions';
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

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (!validImageTypes.includes(blob.type)) {
      message.info('Please Upload Valid Image');
      return errorCallback();
    }

    // Creating a unique key to be send to Digital Ocean Spaces
    const uniqueName = uniqueKeyName(blob.name);
    const params = { Body: blob, Bucket: 'knacsteem', Key: uniqueName };

    // Sending the file to the Spaces
    S3.putObject(params)
      .on('build', request => {
        request.httpRequest.headers.Host = `${Config.digitalOceanSpaces}`;
        request.httpRequest.headers['Content-Length'] = blob.size;
        request.httpRequest.headers['Content-Type'] = blob.type;
        request.httpRequest.headers['x-amz-acl'] = 'public-read';
      })
      .send((err) => {
        if (err) errorCallback();
        else {
          // If there is no error updating the editor with the imageUrl
          const imageUrl = `${Config.digitalOceanSpaces}` + uniqueName
          callback(imageUrl, uniqueName)
        }
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
      tags: form.tags,
      reward: form.reward
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
    
    dispatch(postArticle(parsedPostData.title, this.replaceAtMentionsWithLinks(parsedPostData.body), tags, isComment, parsedPostData.parentPermlink, parsedPostData.parentAuthor, parseInt(parsedPostData.reward, 10))); 

    if (onDone) {
      onDone();
    }
  }

  /**
   * @method replaceAtMentionsWithLinks
   * @description Replace username with markdown link url text
   * @param {String} text 
   * @return {String}
   */
  replaceAtMentionsWithLinks = text => {
    return text.replace(/\s@([a-z\d_]+)/ig, '[@$1](http://knacksteem.org/@$1)');
  }

  render() {

    const {user, dispatch} = this.props;
    const isUserBanned = user.userObject.isBanned;

    if(isUserBanned) {
      message.error("You are banned from posting on KnackSteem");
      dispatch(push('/'));
    }

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
