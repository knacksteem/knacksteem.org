import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {push} from 'react-router-redux';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {Layout, Divider, Spin, Tag} from 'antd';
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
      isEditMode: false
    };
  }
  componentDidMount() {
    this.getArticle();
  }
  getArticle = async () => {
    const {match, dispatch} = this.props;
    try {
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
      console.log(error);
      dispatch(push('/'));
    }
  };
  onEditClick = () => {
    this.setState({
      isEditMode: true
    });
  };
  onReplyClick = () => {
    //TODO open a new editor window that includes details about eh comment to reply on
  };
  onCancelEditorClick = () => {
    this.setState({
      isEditMode: false
    });
  };
  onDoneEditorClick = () => {
    //TODO reload
    this.setState({
      isEditMode: false
    });
  };
  render() {
    const {data, isLoading, isEditMode} = this.state;

    //show spinner/loader while loading article from the backend
    if (isLoading) {
      return (
        <div><Content><Spin/></Content></div>
      );
    }

    return (
      <div>
        <Content>
          {!isEditMode && <h1>{data.title}</h1>}
          <div className="article-author">Author: {data.author}</div>
          <div className="article-category">Category: {data.category}</div>
          <Divider/>
          {isEditMode && <Editor isEdit={true} isComment={false} articleData={data} onCancel={this.onCancelEditorClick} onDone={this.onDoneEditorClick} />}
          {!isEditMode && <ReactMarkdown source={data.description} />}
          <ArticleMetaBottom data={data} onUpdate={this.getArticle} isArticleDetail onEditClick={this.onEditClick} onReplyClick={this.onReplyClick} isEditMode={isEditMode} />
          <div className="article-tags">
            {data.tags.map((tag, index) => {
              return (
                <Tag key={tag} closable={false} color={(index > 0 ? 'blue' : 'magenta')}>{tag}</Tag>
              );
            })}
          </div>
          <Divider/>
          <Comments data={data.comments} onUpdate={this.getArticle} />
        </Content>
      </div>
    );
  }
}

ArticleDetail.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.object
};

const mapStateToProps = state => ({
  /*user: state.user*/
});

export default withRouter(connect(mapStateToProps)(ArticleDetail));
