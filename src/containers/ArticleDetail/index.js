import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {Layout, Divider, Spin, Row, Col, Tag} from 'antd';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {apiGet} from '../../services/api';
import Comments from '../../components/Comments';
import Editor from '../../components/Editor';
import SimilarPosts from '../../components/SimilarPosts';
import AnouncementMetaBar  from '../../components/AnnouncementMetaBar';
import VotingSlider from '../../components/VotingSlider'
import './index.css';
const {Content} = Layout;

//Article Detail route
class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoading: true,
      isEditMode: false,
      isReplyMode: false,
      limit: 3,
      disableShowMore: false
    };
  };
  componentDidMount() {
    this.getArticle();
  };

  componentDidUpdate (prevProps, prevState) {
    // This had to be made because of Update Blocking -> https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
    // None of the solutions were solving this issue. Not sure if this is the correct way or if it is a low-quality workaround
    if (prevProps.match.url !== this.props.match.url) {
      this.getArticle();
    }
  };

  getArticle = async () => {
    const {match, dispatch} = this.props;
    try {
      this.setState({
        limit: 3,
        disableShowMore: false,
        isLoading: true
      });
      let response = await apiGet(`/posts/${match.params.author}/${match.params.permlink}`, {username: Cookies.get('username') || undefined});
      //no article found, go back to main route
      if (response && response.data && response.data.results) {
        this.setState({
          data: response.data.results,
          isLoading: false
        });
      await this.getSimilarPosts();
      } else {
        dispatch(push('/'));
      }
    } catch (error) {
      //error handled in api get service
      dispatch(push('/'));
    }
  };

  onUpdate = form => {
    const data = this.getNewPostData(form)
    this.setState({parsedPostData: data})
  };

  getNewPostData = (form) => {
    
    const data = {
      body: form.body,
      title: form.title,
      tags: form.tags
    };

    console.log(data);

    
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
    const {dispatch, articleData, onDone, user} = this.props;
   
    if (isEdit){
      //dispatch(editArticle(parsedPostData.title, parsedPostData.body, tags, articleData, isComment, parsedPostData.parentPermlink, parsedPostData.parentAuthor));
    }

    if (onDone) {
      onDone();
    }
  }

  getSimilarPosts = async () => {
    let {match} = this.props;
    let {data} = this.state;
    let similarPosts = await apiGet(`/posts`, {category: data.category, search: `${data.title} ${data.description}  ${data.permlink}`, limit: this.state.limit});
    if(similarPosts.data.results.length !== this.state.limit){
      this.setState({
        disableShowMore: true
      });
    }
    this.setState((prevState) => ({
      data: {...prevState.data, similarPosts: (similarPosts.data.results.filter(similarPost => similarPost.permlink !== match.params.permlink)) },
      limit: prevState.limit * 2
    }));

  }
  onEditClick = () => {
    this.setState({
      isEditMode: true
    });
  };
  onReplyClick = () => {
    this.setState({
      isReplyMode: true
    });
  };
  onCancelEditorClick = () => {
    this.setState({
      isEditMode: false,
      isReplyMode: false
    });
  };
  onDoneEditorClick = () => {
    this.setState({
      isEditMode: false,
      isReplyMode: false,
      isLoading: true
    });
    //reload after update
    this.getArticle();
  };
  showMore = () => {
      this.getSimilarPosts();
  };
  render() {
    const {data, isLoading, isEditMode, isReplyMode} = this.state;
    const {votingSlider} = this.props;

    //show spinner/loader while loading article from the backend
    if (isLoading) {
      return (
        <div><Content><Spin/></Content></div>
      );
    }
    return (
      
      <Row id="article-body" type="flex" style={{width: '75%'}}>
          <Row type="flex" style={{width: '67%'}} id="article-detail">
            <Row className="article-detail" style={{width: '100%'}}>
              {!isEditMode && <h1>{data.title}</h1>}
              <div className="article-author">Author: {data.author}</div>
              <div className="article-category">Category: {data.category}</div>
              <Divider/>
              {isEditMode && <Editor isEdit={true} isComment={false} onSubmit={(e)=>{ this.onSubmit()}} onUpdate={this.onUpdate} articleData={data} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} />}
              {!isEditMode && <ReactMarkdown source={data.description} />}
              { votingSlider.isVotingSliderVisible &&
              <div>
                <VotingSlider/>
              </div>
              }
              <div className="article-footer">
                <ArticleMetaBottom data={data} onUpdate={this.getArticle} isArticleDetail onEditClick={this.onEditClick} onReplyClick={this.onReplyClick} isEditMode={isEditMode} />
              </div>
            </Row>
              <Divider/>
              <div>
                {data.tags.map((tag, index )=>{
                  return(
                    <Tag key={tag} closable={false}>{tag}</Tag>
                  )
                })}
              </div>
              {isReplyMode && <Editor isEdit={false} isComment={true} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} parentPermlink={data.permlink} parentAuthor={data.author} />}
              <Comments data={data.comments} onUpdate={this.getArticle} parentPermlink={data.permlink} parentAuthor={data.author} />
          </Row>
          <Row style={{width: '33%', }} justify="center" type="flex" >
              <Col className="announcement-container" style={{marginBottom: '30px'}}>
                <AnouncementMetaBar/>
              </Col>
              <Col className="similarpost-container" >
                {data.similarPosts && <SimilarPosts data={data.similarPosts} showMore={this.showMore} disableShowMore={this.state.disableShowMore}/>}
              </Col>
          </Row>
      </Row>
    );
  }
}

ArticleDetail.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = state => ({
  votingSlider: state.votingSlider
});

export default withRouter(connect(mapStateToProps)(ArticleDetail));
