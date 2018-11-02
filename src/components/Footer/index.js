import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {Layout, Col, Row} from 'antd';
import './index.css';
import logo from '../../assets/images/logo_black.png';
const {Footer} = Layout;

const KnackFooter = () => {
  return (
    <Footer className="footer-container">
      <Row className="inner-container " style={{paddingTop: '10px'}} justify="center" type="flex">
        <Row type="flex" style={{ width: '50%'}} align="middle" justify="center" >
          <Col className="logo"><img  style={{maxWidth: '100%'}} src={logo}  alt="Knacksteem Logo" /></Col>
          <Col style={{marginLeft: '10px', fontSize: '12px'}}><div  className="copyright">All rights reserved</div></Col>
        </Row>
        <Row type="flex" align="middle" justify="space-around">
          <Col>
            <Link to="/">Home</Link>
            <Link to="/how">How it works</Link>
            <Link to="/about">About us</Link>
            <Link to="/contribute">Contribute</Link>
            <Link to="/contact">Contact</Link>
          </Col>
        </Row>
      </Row>
    </Footer>
  );
};

export default withRouter(KnackFooter);

