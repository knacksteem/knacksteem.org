import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Layout, Col, Row} from 'antd';
import './index.css';
import logo from '../../assets/images/logo_black.png';
const {Footer} = Layout;

const KnackFooter = () => {
  return (
    <Footer className="footer-container">
      <Row className="inner-container " type="flex">
        <Row type="flex" className="logo-container" style={{padding: '5px'}}  align="middle"  >
          <Col className="logo"><img  style={{maxWidth: '100%'}} src={logo}  alt="Knacksteem Logo" /></Col>
          <Col style={{ fontSize: '12px', marginLeft: '5px'}}><div  className="copyright">All rights reserved</div></Col>
        </Row>
        <Row  className="link-container"  style={{padding: '5px'}} align="middle">
          <Col className="footer-links">
            <Link className="footer-links-item" to="/">Home</Link>
            <Link className="footer-links-item" to="/how">How it works</Link>
            <Link className="footer-links-item" to="/about">About us</Link>
            <Link  className="footer-links-item" to="/contribute">Contribute</Link>
            <Link className="footer-links-item" to="/contact">Contact</Link>
          </Col>
        </Row>
      </Row>
    </Footer>
  );
};

export default withRouter(KnackFooter);

