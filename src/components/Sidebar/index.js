import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Menu, Divider} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import cover_generic from '../../assets/images/cover.jpg';
const {Sider} = Layout;

const UserBox = (user) => {
  if (typeof user.userObjectSteemit.account === 'undefined') {
    return null;
  }
  const userMeta = JSON.parse(user.userObjectSteemit.account.json_metadata);
  let coverImg = userMeta.profile.cover_image;
  if (typeof coverImg === 'undefined' || coverImg === '') {
    coverImg = cover_generic;
  }
  let displayName = userMeta.profile.name;
  if (typeof displayName === 'undefined' || displayName === '') {
    displayName = user.username;
  }

  return (
    <div className="user-box" style={{backgroundImage: 'url(' + coverImg + ')' }}>
      <span className="name">{displayName}</span><br />
      <span className="account">@{user.username}</span>
    </div>
  );
};

//Sidebar with category menu
const CustomSidebar = ({location, user, articles}) => {
  const isUserLoggedIn = (user.username === '');

  let userBox = UserBox(user);
  let links = [];
  if (isUserLoggedIn && user.isContributor) {
    links.push(
      <Menu.Item key="/mycontributions"><Link to="/mycontributions"><i className="fas fa-pen"></i>My Contributions</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="user-divider"><Divider/></Menu.Item>
    );
  }
  if (user.isModerator || process.env.NODE_ENV === 'development') {
    links.push(
      <Menu.Item key="/moderation/pending"><Link to="/moderation/pending"><i className="fas fa-bars"></i>Pending</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="/moderation/reserved"><Link to="/moderation/reserved"><i className="fas fa-bookmark"></i>Reserved</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="/users"><Link to="/users"><i className="fas fa-users"></i>Users</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="mod_divider"><Divider/></Menu.Item>
    );
  }
  return (
    <Sider width={200}>
      {userBox}
      <Menu mode="inline" selectedKeys={[location.pathname]} style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
        {links}
        <Menu.Item key="/guidelines">
          <Link to="/guidelines"><i className="fas fa-th"></i>Guidelines</Link>
        </Menu.Item>
        <Menu.Item key="/faq">
          <Link to="/faq"><i className="fas fa-question-circle"></i>FAQ</Link>
        </Menu.Item>
        <Menu.Item key="/tos">
          <Link to="/tos"><i className="fas fa-file-contract"></i>ToS</Link>
        </Menu.Item>
        <Menu.Item key="mod_divider"><Divider/></Menu.Item>
        <Menu.Item key="/">
          <Link to="/">All</Link>
        </Menu.Item>
        {articles.categories.map((elem) => {
          return (
            <Menu.Item key={`/categories/${elem.key}`}>
              <Link to={`/categories/${elem.key}`}>{elem.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

CustomSidebar.propTypes = {
  location: PropTypes.object,
  user: PropTypes.object,
  articles: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  articles: state.articles
});

export default withRouter(connect(mapStateToProps)(CustomSidebar));
