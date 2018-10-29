import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Icon, Button, Badge, Row, Col, Avatar, Dropdown, Menu} from 'antd';
import PropTypes from 'prop-types';
import {userLogout} from '../../actions/user';
import './index.css';
import SteemConnect from '../../services/SteemConnect';
import Logo from '../../assets/images/logo_black.png';
import {KnackSelect} from '../../components/Select';
import {KnackSearch} from '../../components/Search';

 


const {Header} = Layout;

/**
 * Header with login and user details
 */
const CustomHeader = ({user, dispatch}) => {
  //get OAuth URL for Steem Connect
  const getOathURL = () => {
    return SteemConnect.getLoginURL();
  };
  //dispatch logout action
  const onLogoutClick = () => {
    dispatch(userLogout());
  };

  const menu = (
    <Menu>
      <Menu.Item>
      <Link to="/"><Button onClick={onLogoutClick}>Logout</Button></Link>
      </Menu.Item>
    </Menu>
  );
  
      
    
  return (
    <Header className="navbar">
        <Row type="flex" justify="center" align="middle" className="header-container ">
          
            <Row className="logo"  align="middle"  justify="center" type="flex">
              <Col className="brand">
                <img style={{maxWidth: "100%"}} src={Logo}></img>
              </Col>  
            </Row>
            
            <Row type="flex" justify="center" className=" navbar__items input-container">
              <Col className="select" >
                <KnackSelect/>
              </Col>
              <Col className="ml">
                <KnackSearch/>
              </Col>
            </Row>
            <Row type="flex" align="middle"  justify="end" className=" navbar__items button-container">
                {user.username && 
                <Col>
                  <Link to="/new"><Button className="ml"><Icon type="edit" theme="outlined" /> </Button></Link>
                </Col>
                }
                {!user.username && <a href={getOathURL()}><Button>Login</Button></a>}
                {user.username &&
                <Col>
                  <span className="mx-auto ml" style={{ marginRight: 24 }}>
                    <Badge count={1}><Avatar style={{backgroundColor: "#22419c"}} shape="square" icon="bell" /></Badge>
                  </span>
                </Col>
                }
            
                {user.username &&
                <Col >
                  <div className="ml">
                   
                    <Dropdown overlay={menu}>
                      <a className="ant-dropdown-link" href="#">
                      <Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"  icon="user" />
                        <Icon type="down" />
                      </a>
                    </Dropdown>
                  </div>
                </Col>
                }
                
            </Row>    
            <Row className="toggle-container"type="flex">
              <Col className="navbar__link-toggle">
                  <Icon type="menu-fold" theme="outlined" />
              </Col>
            </Row> 
        </Row>
    </Header>
  );
};

CustomHeader.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(CustomHeader));
