import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Input, Spin} from 'antd';
import {getUserList} from '../../actions/stats';
const {Header, Content} = Layout;
const Search = Input.Search;

const styles = {
  articlesList: {display: 'flex', flexDirection: 'column'}
};

//Review Overview
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      banned: false
    };
  }
  //scroll handler for lazy loading
  onScroll = () => {
    const {stats} = this.props;

    //if in loading process, don´t do anything
    if (stats.isBusy) {
      return;
    }
    //if user hits bottom, load next batch of items
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if ((window.innerHeight + scrollTop) >= document.body.scrollHeight) {
      this.loadUsers(stats.users.length);
    }
  };
  componentDidMount() {
    this.loadUsers();

    //on scroll, load the next batch of articles
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount() {
    //remove scroll event again when hitting another route
    window.removeEventListener('scroll', this.onScroll);
  }
  loadUsers = (skip = 0) => {
    const {dispatch} = this.props;

    dispatch(getUserList(skip));
  };
  render() {
    const {searchString} = this.state;
    const {stats} = this.props;
    const {users} = stats;

    console.log(users);

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
          <div className="ant-list ant-list-vertical ant-list-lg ant-list-split ant-list-something-after-last-item" style={styles.articlesList}>
            {users.map((data, index) => {
              return (
                <div key={data.username}>{data.username}</div>
              );
            })}
            {(!users.length && !stats.isBusy) && <div>No users...</div>}
          </div>
          {stats.isBusy && <Spin/>}
        </Content>
      </div>
    );
  }
}

Users.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  dispatch: PropTypes.func,
  stats: PropTypes.object
};

const mapStateToProps = state => ({
  stats: state.stats
});

export default withRouter(connect(mapStateToProps)(Users));
