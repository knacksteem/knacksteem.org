import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';
import {Layout, Divider, Spin, Tag} from 'antd';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import ArticleMetaBottom from '../../components/Common/ArticleMetaBottom';
import {apiGet} from '../../services/api';
import Comments from '../../components/Comments';
import './index.css';
const {Content} = Layout;

//Article Detail route
class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoading: true
    };
  }
  componentDidMount() {
    this.getArticle();
  }
  getArticle = async () => {
    const {match} = this.props;
    try {
      //TODO load username from cookies
      let response = await apiGet(`/posts/${match.params.author}/${match.params.permlink}`, {username: Cookies.get('username') || undefined});
      this.setState({
        data: response.data.results,
        isLoading: false
      });
    } catch (error) {
      console.log(error);
      this.setState({
        data: {},
        isLoading: false
      });
    }
  };
  render() {
    const {data, isLoading} = this.state;

    //show spinner/loader while loading article from the backend
    if (isLoading) {
      return (
        <div><Content><Spin/></Content></div>
      );
    }

    return (
      <div>
        <Content>
          <h1>{data.title}</h1>
          <div className="article-author">Author: {data.author}</div>
          <div className="article-category">Category: {data.category}</div>
          <Divider/>
          <ReactMarkdown source={data.description} />
          <ArticleMetaBottom data={data} onUpvoteSuccess={this.getArticle} isArticleDetail />
          <div className="article-tags">
            {data.tags.map((tag, index) => {
              return (
                <Tag key={tag} closable={false} color={(index > 0 ? 'blue' : 'magenta')}>{tag}</Tag>
              );
            })}
          </div>
          <Divider/>
          <Comments data={data.comments} onUpvoteSuccess={this.getArticle} />
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
