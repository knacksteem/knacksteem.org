import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {Layout, Divider, Spin, Tag, Row} from 'antd';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {apiGet} from '../../services/api';
import Comments from '../../components/Comments';
import Editor from '../../components/Editor';
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
      isReplyMode: false
    };
  }
  componentDidMount() {
    this.getArticle();
  }
  getArticle = async () => {
    const {match, dispatch} = this.props;
    try {
      this.setState({
        isLoading: true
      });
      let response = await apiGet(`/posts/${match.params.author}/${match.params.permlink}`, {username: Cookies.get('username') || undefined});
      //no article found, go back to main route
      if (response && response.data && response.data.results) {
        this.setState({
          data: response.data.results,
          isLoading: false
        });
      } else {
        dispatch(push('/'));
      }
    } catch (error) {
      //error handled in api get service
      dispatch(push('/'));
    }
  };
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
  render() {
    const {data, isLoading, isEditMode, isReplyMode} = this.state;

    //show spinner/loader while loading article from the backend
    if (isLoading) {
      return (
        <div><Content><Spin/></Content></div>
      );
    }

    return (
      <Row id="article-body" style={{width: '100%'}}>
        <Row type="flex" justify="center" id="article-detail">
          <Row className="article-detail">
            {!isEditMode && <h1>{data.title}</h1>}
            <div className="article-author">Author: {data.author}</div>
            <div className="article-category">Category: {data.category}</div>
            <Divider/>
            {isEditMode && <Editor isEdit={true} isComment={false} articleData={data} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} />}
            {!isEditMode && <ReactMarkdown source={data.description} />}
            <div className="article-footer">
              <ArticleMetaBottom data={data} onUpdate={this.getArticle} isArticleDetail onEditClick={this.onEditClick} onReplyClick={this.onReplyClick} isEditMode={isEditMode} />
            </div>
            <Divider/>
            {isReplyMode && <Editor isEdit={false} isComment={true} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} parentPermlink={data.permlink} parentAuthor={data.author} />}
            <Comments data={data.comments} onUpdate={this.getArticle} parentPermlink={data.permlink} parentAuthor={data.author} />
          </Row>
        </Row>
      </Row>
    );
  }
}

ArticleDetail.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object
};

export default withRouter(connect()(ArticleDetail));
