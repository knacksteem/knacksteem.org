import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Divider, Spin, Tag} from 'antd';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import IconText from '../../components/ArticleListItem/IconText';
import './index.css';
import {apiGet} from '../../services/api';
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
      let response = await apiGet(`/posts/${match.params.author}/${match.params.permlink}`);
      this.setState({
        data: response.data,
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
          <ReactMarkdown source={data.body} />
          <ul className="ant-list-item-action">
            <li><IconText type="clock-circle-o" text={data.created} /><em className="ant-list-item-action-split" /></li>
            <li><IconText type="message" text={data.replies.length} /><em className="ant-list-item-action-split" /></li>
            <li><IconText type="up-circle-o" text={data.net_votes} /></li>
          </ul>
          {/*<div className="article-tags">
            {data.tags.map((tag, index) => {
              return (
                <Tag key={tag} closable={false} color={(index > 0 ? 'blue' : 'magenta')}>{tag}</Tag>
              );
            })}
          </div>*/}
        </Content>
      </div>
    );
  }
}

ArticleDetail.propTypes = {
  match: PropTypes.object
};

const mapStateToProps = state => ({
  /*articles: state.articles,
  user: state.user*/
});

export default withRouter(connect(mapStateToProps)(ArticleDetail));
