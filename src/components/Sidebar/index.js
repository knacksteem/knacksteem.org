import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Menu, Divider} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
const {Sider} = Layout;

//Sidebar with category menu
const CustomSidebar = ({location, user, articles}) => {
  return (
    <Sider
      width={200}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu mode="inline" selectedKeys={[location.pathname]} style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
        {user.username && user.isContributor && <Menu.Item key="/mycontributions"><Link to="/mycontributions">My Contributions</Link></Menu.Item>}
        {user.username && user.isContributor && <Menu.Item><Divider/></Menu.Item>}
        {(user.isModerator || process.env.NODE_ENV === 'development') && <Menu.Item key="/moderation/pending"><Link to="/moderation/pending">Pending</Link></Menu.Item>}
        {(user.isSupervisor || process.env.NODE_ENV === 'development') && <Menu.Item key="/moderation/reserved"><Link to="/moderation/reserved">Reserved</Link></Menu.Item>}
        {(user.isModerator || process.env.NODE_ENV === 'development') && <Menu.Item key="/users"><Link to="/users">Users</Link></Menu.Item>}
        {(user.isModerator || process.env.NODE_ENV === 'development') && <Menu.Item><Divider/></Menu.Item>}
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
