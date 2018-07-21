import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Layout, Input, Spin, Tag, List, Avatar, Popover} from 'antd';
import {getUserList} from '../../actions/stats';
import ModButtons from '../../components/Common/ModButtons';
import {timestampToDate} from '../../services/functions';
import './index.css';
const {Header, Content} = Layout;
const Search = Input.Search;

//title of list entry - user, avatar, link and tags
const Title = ({username, roles, isBanned, bannedBy, bannedReason, bannedUntil}) => {
  const bannedPopover = (
    <div>
      <p>Reason: {bannedReason}</p>
      <p>Banned Until: {timestampToDate(bannedUntil)}</p>
      <p>Banned By: {bannedBy}</p>
    </div>
  );
  return (
    <div>
      <a href={`https://www.steemit.com/@${username}`}>{username}</a>
      <div className="mod-tags">
        {roles.filter(role => role !== 'contributor').map((role) => {
          return (
            <Tag key={`${username}-${role}`} color={(role === 'supervisor') ? 'magenta' : 'blue'}>{role}</Tag>
          );
        })}
        {isBanned && <Popover content={bannedPopover} title="Ban Details"><Tag color="red">banned</Tag></Popover>}
      </div>
    </div>
  );
};

Title.propTypes = {
  username: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  isBanned: PropTypes.bool,
  bannedBy: PropTypes.string,
  bannedReason: PropTypes.string,
  bannedUntil: PropTypes.number
};
Title.defaultProps = {
  isBanned: false
};

//user list for moderative actions
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
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
  componentDidUpdate(prevProps, prevState) {
    const {searchString} = this.state;

    if (searchString !== prevState.searchString) {
      this.loadUsers(0, false, searchString);
    }
  }
  loadUsers = (skip = 0, banned = false, search) => {
    const {dispatch} = this.props;

    dispatch(getUserList(skip, banned, search));
  };
  onChangeSearchString = (value) => {
    this.setState({
      searchString: value
    });
  };
  render() {
    const {stats} = this.props;
    const {users} = stats;

    return (
      <div>
        <Header>
          <Search
            placeholder="Search for users"
            onSearch={this.onChangeSearchString}
            style={{width: 300}}
          />
        </Header>
        <Content>
          <List
            dataSource={users}
            renderItem={item => {
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={`https://steemitimages.com/u/${item.username}/avatar`} />}
                    title={<Title username={item.username} roles={item.roles} isBanned={item.isBanned} bannedBy={item.bannedBy} bannedReason={item.bannedReasons} bannedUntil={item.bannedUntil} />}
                    description={`Contributions: ${item.contributions || 0}`}
                  />
                  <ModButtons item={item} />
                </List.Item>
              );
            }}
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
