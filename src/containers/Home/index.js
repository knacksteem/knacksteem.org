import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Input} from 'antd';
import ArticleListItem from '../../components/ArticleListItem';
import {getArticlesByCategory, getArticlesByUser} from '../../actions/articles';
const {Header, Content} = Layout;
const Search = Input.Search;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
  }
  componentDidMount() {
    const {location, dispatch, match} = this.props;

    if (location.pathname === '/mycontributions') {
      //load user contributions
      dispatch(getArticlesByUser());
    } else {
      //load contributions by category
      dispatch(getArticlesByCategory(match.params.category));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const {dispatch, location, match} = this.props;

    if (prevProps.location.pathname !== location.pathname) {
      //location change detected, load new data
      dispatch(getArticlesByCategory(match.params.category));
    }
  }
  render() {
    const {searchString} = this.state;
    const {articles} = this.props;
    let articlesData = articles.data;
    if (searchString !== '') {
      articlesData = articlesData.filter((elem) => {
        if (elem.title.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
          return true;
        }
        if (elem.description.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
          return true;
        }
        return false;
      });
    }

    return (
      <div>
        <Header>
          <Search
            placeholder="Search through Knacksteem"
            onSearch={value => this.setState({searchString: value})}
            style={{width: 300}}
          />
        </Header>
        <Content>
          <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={{display: 'flex', flexDirection: 'column'}}>
            {articlesData.map((data, index) => {
              return (
                <ArticleListItem key={index} data={data} />
              );
            })}
          </div>
        </Content>
      </div>
    );
  }
}

Home.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(Home));
