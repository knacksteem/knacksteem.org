import React from 'react';
import { Row, Col} from 'antd';
import Editor from '../../components/Editor';
import debounce from 'lodash/debounce';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {withRouter} from "react-router-dom";
import {postArticle, editArticle} from '../../actions/articles';



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
      isComment: false
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

  getNewPostData = (form) => {
    const data = {
      body: form.body,
      title: form.title,
      tags: form.tags
    };


    data.parentAuthor =  '';

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;
    data.parentPermlink = '';
    return data;
  };

  onSubmit = () => {
    const form = this.state.parsedPostData;
    const data = this.getNewPostData(form);


    this.setState({parsedPostData: data});
    this.proceedSubmit(data.tags);
  };

  proceedSubmit = (tags) => {
    const {isComment, isEdit, parsedPostData} = this.state;
    const {dispatch, articleData} = this.props;

    if (isEdit){
      dispatch(editArticle(parsedPostData.title, parsedPostData.body, tags, articleData, isComment, parsedPostData.parentPermlink, parsedPostData.parentAuthor));
    }else {
      dispatch(postArticle(parsedPostData.title, parsedPostData.body, tags, isComment, parsedPostData.parentPermlink, parsedPostData.parentAuthor));
    }
  }

  render() {

    return (
      <Row type="flex" justify="center" style={{marginTop: '100px'}} className="editor-container">
        <Col>
          {/* <ProfileInfoBar
            name={displayName}
            about={about}
            location={location}
            website={website}
            votingPower={votingPower}
            voteValue={voteValue}
            signupDate={signupDate}
            user={knacksteemUserObject}
            banReason={this.state.banReason}
            banDuration={this.state.banDuration}
            onModChoiceSelect={(choice, action) => this.handleModChoiceSelect(choice, action)}
            onBanButtonClick={() => this.handleBanStatusToggle()}
            isModerator={
              Object.keys(userObject).length > 0 ? 
                userObject.roles.includes('moderator') :
                false
            }
            isSupervisor={
              Object.keys(userObject).length > 0 ? 
                userObject.roles.includes('supervisor') :
                false
            }/> */}
        </Col>
        <Col>
          <Editor isComment={false} 
                  isEdit={false}
                  ref={this.setForm}
                  onSubmit={(e)=>{ this.onSubmit()}}
                  onUpdate={this.onUpdate}
                  onImageInserted={this.handleImageInserted}
                  />
        </Col>
        <Col>
          {/* <ProfileCategoriesBar
          activeCategory={activeCategory}
          categories={articles.categories}
          username={match.params.username}
          /> */}
        </Col>
      </Row>
    );
  }

};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(NewContribution));
