import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './index.css';
import {Layout, Input, Spin, Tag, List, Button, Avatar} from 'antd';
import {getUserList} from '../../actions/stats';
const {Header, Content} = Layout;
const Search = Input.Search;

const UserItemTitle = ({username, roles, isBanned}) => {
  return (
    <div>
      <a href={`https://www.steemit.com/${username}`}>{username}</a>
      <div className="mod-tags">
        {roles.filter(role => role !== 'contributor').map((role) => {
          return (
            <Tag key={`${username}-${role}`} color={(role === 'supervisor') ? 'magenta' : 'blue'}>{role}</Tag>
          );
        })}
        {/*isBanned && */<Tag color="red">banned</Tag>}
      </div>
    </div>
  );
};

const UserItem = (item) => {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={`https://steemitimages.com/u/${item.username}/avatar`} />}
        title={<UserItemTitle username={item.username} roles={item.roles} isBanned={item.isBanned} />}
        description={`Contributions: ${item.contributions || 0}`}
      />
      <div className="mod-buttons">
        <Button size="small">Ban</Button>
      </div>
    </List.Item>
  );
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
          <List
            dataSource={users}
            renderItem={UserItem}
          />
          {(!users.length && !stats.isBusy) && <div>No users...</div>}
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
