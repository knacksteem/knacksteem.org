import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Menu} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import logo from '../../assets/images/logo.png';
const {Sider} = Layout;

//Sidebar with category menu
const CustomSidebar = ({location, user, articles}) => {
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
        <Menu.Item key="/review"><Link to="/review">Review</Link></Menu.Item>
        {user.username && <Menu.Item style={{height: 24}}><hr/></Menu.Item>}
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
