import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Layout } from 'antd';
import {getArticlesByUser} from '../../actions/articles';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  loadArticlesUser() {
    const {dispatch} = this.props;

    dispatch(getArticlesByUser());
  }

  componentDidMount() {
    this.loadArticlesUser();
  }

  render () {
    return (
      <Layout.Content style={{minHeight: 1080}}>
        <div>
          <h1>Profile</h1>
        </div>
      </Layout.Content>
    );
  }
}

Profile.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(Profile));