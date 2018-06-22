import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Menu} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import logo from '../../assets/images/logo.png';
const {Sider} = Layout;

const menuElements = [
  {key: '/', name: 'All'},
  {key: '/categories/vlog', name: 'VLog'},
  {key: '/categories/graphics', name: 'Graphics'},
  {key: '/categories/art', name: 'Art'},
  {key: '/categories/knack', name: 'Knack'},
  {key: '/categories/onealtruism', name: 'One Altruism'},
  {key: '/categories/music', name: 'Music'},
  {key: '/categories/humor', name: 'Joke/Humor'},
  {key: '/categories/inspiring', name: 'Inspiring'},
  {key: '/categories/visibility', name: 'Visibility'},
  {key: '/categories/news', name: 'News'},
  {key: '/categories/quotes', name: 'Quotes'},
  {key: '/categories/techtrends', name: 'Tech Trends'},
  {key: '/categories/blogposts', name: 'Blog Posts'}
];

const CustomSidebar = ({location, user}) => {
  console.log(location.pathname);
  return (
    <Sider
      width={200}
      breakpoint="lg"
      collapsedWidth="0"
      onCollapse={(collapsed, type) => {console.log(collapsed, type);}}
    >
      <div className="logo"><img src={logo} alt="Knacksteem Logo" /></div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]} style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
        {user.username && <Menu.Item key="/mycontributions"><Link to="/mycontributions">My Contributions</Link></Menu.Item>}
        {user.username && <Menu.Item style={{height: 24}}><hr/></Menu.Item>}
        {menuElements.map((elem) => {
          return (
            <Menu.Item key={elem.key}>
              <Link to={elem.key}>{elem.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

CustomSidebar.propTypes = {
  location: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(CustomSidebar));
