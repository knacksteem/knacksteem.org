import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {Layout, Divider, Spin, Row, Col, Tag, message} from 'antd';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {apiGet} from '../../services/api';
import Comments from '../../components/Comments';
import Editor from '../../components/Editor';
import SimilarPosts from '../../components/SimilarPosts';
import AnnouncementMetaBar  from '../../components/AnnouncementMetaBar';
import VotingSlider from '../../components/VotingSlider'
import './index.css';
import S3 from '../../services/DigitalOcean';
import Config from '../../config';
import { uniqueKeyName } from '../../services/functions';
const {Content} = Layout;


//Article Detail route
class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isUpdating: false,
      parsedPostData: null,
      isLoading: true,
      isEditMode: false,
      isReplyMode: false,
      limit: 3,
      disableShowMore: false
    };
  };
  componentDidMount() {
    this.getArticle(true);
  };

  componentDidUpdate (prevProps, prevState) {
    // This had to be made because of Update Blocking -> https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
    // None of the solutions were solving this issue. Not sure if this is the correct way or if it is a low-quality workaround
    if (prevProps.match.url !== this.props.match.url) {
      this.getArticle();
    }
  };

  getArticle = async (loadingOnRefresh) => {
    const {match, dispatch} = this.props;
    try {
      this.setState({
        limit: 3,
        disableShowMore: false,
        isLoading: loadingOnRefresh
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
              <div className="article-author">Author: <a href={"/@" + data.author}>{data.author}</a></div>
              <div className="article-category">Category: {data.category}</div>
              <Divider/>
              {isEditMode && <Editor isEdit={true} parentPermlink={data.permlink} parentAuthor={data.author} articleData={data} isComment={false}  onImageInserted={this.handleImageInserted}  />}
              {!isEditMode && <ReactMarkdown source={data.description} escapeHtml={false} />}
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
              {!isReplyMode &&
              <div>
                {data.tags.map((tag, index )=>{
                  return(
                    <Tag key={tag} closable={false}>{tag}</Tag>
                  )
                })}
              </div>
              }
              {isReplyMode && <Editor isEdit={false} isComment={true} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} parentPermlink={data.permlink} parentAuthor={data.author} />}
              <Comments data={data.comments} onUpdate={this.getArticle} parentPermlink={data.permlink} parentAuthor={data.author} />
          </Row>
          <Row style={{width: '33%', }} justify="center" type="flex" >
              <Col className="announcement-container" style={{marginBottom: '30px', position: 'fixed'}}>
              <AnnouncementMetaBar/>
              </Col>
              <Col style={{position: 'fixed', top: '400px'}} className="similarpost-container" >
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
