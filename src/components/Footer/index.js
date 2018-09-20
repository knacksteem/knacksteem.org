import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import logo from '../../assets/images/logo_black.png';
const {Footer} = Layout;

/**
 * Header with login and user details
 */
const CustomFooter = ({location}) => {
  return (
    <Footer>
      <div id="footer-wrapper">
        <div className="logo"><img src={logo} alt="Knacksteem Logo" /></div>
        <div className="copyright">All rights reserved</div>
        <Menu mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="/how"><Link to="/how">How it works</Link></Menu.Item>
          <Menu.Item key="/about"><Link to="/about">About us</Link></Menu.Item>
          <Menu.Item key="/contribute"><Link to="/contribute">Contribute</Link></Menu.Item>
          <Menu.Item key="/contact"><Link to="/contact">Contact</Link></Menu.Item>
        </Menu>
      </div>
    </Footer>
  );
};

CustomFooter.propTypes = {
  location: PropTypes.object
};

export default withRouter(CustomFooter);
