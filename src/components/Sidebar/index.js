import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Menu, Divider} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
const {Sider} = Layout;

//Sidebar with category menu
const CustomSidebar = ({location, user, articles}) => {
  let links = [];
  if (user.username && user.isContributor) {
    links.push(
      <Menu.Item key="/mycontributions"><Link to="/mycontributions">My Contributions</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="user-divider"><Divider/></Menu.Item>
    );
  }
  if (user.isModerator || process.env.NODE_ENV === 'development') {
    links.push(
      <Menu.Item key="/moderation/pending"><Link to="/moderation/pending">Pending</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="/moderation/reserved"><Link to="/moderation/reserved">Reserved</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="/users"><Link to="/users">Users</Link></Menu.Item>
    );
    links.push(
      <Menu.Item key="mod_divider"><Divider/></Menu.Item>
    );
  }
  return (
    <Sider width={200}>
      <Menu mode="inline" selectedKeys={[location.pathname]} style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
        {links}
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
