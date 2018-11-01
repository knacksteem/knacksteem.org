import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Icon, Button, Badge, Row, Col, Avatar, Dropdown, Menu} from 'antd';
import PropTypes from 'prop-types';
import {userLogout} from '../../actions/user';
import {toggleHeader} from '../../actions/header';
import './index.css';
import SteemConnect from '../../services/SteemConnect';
import Logo from '../../assets/images/logo_black.png';
import {KnackSelect} from '../../components/Select';
import {KnackSearch} from '../../components/Search';
import {getArticlesByCategory, getArticlesByUser} from '../../actions/articles';
const {Header} = Layout;





 
class KnackHeader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      searchString: ''
    };

    this.handleHeaderToggle = this.handleHeaderToggle.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  loadArticles(skip = 0, search) {
    const {dispatch, match} = this.props;
    dispatch(getArticlesByCategory(match.params.category, skip, search));
  };


  handleHeaderToggle(){ 
      const {dispatch, header} =this.props
      
      dispatch(toggleHeader(
        {
          isHeaderVisible: !header.isHeaderVisible
        }
      ))
  }

  //dispatch logout action
  onLogoutClick() {
    const {dispatch} = this.props
    dispatch(userLogout());
  };

  render(){

      const {user} = this.props;
      const {header} = this.props
      const styles = {
        header: {
            display: !header.isHeaderVisible ?
            'none': 'flex',
            transform: !header.isHeaderVisible
              ? `translateY( -700%)`
              : 'translateY(0)'
        }
    };

    const menu = (
      <Menu>
        <Menu.Item>
        <Link to="/"><Button onClick={e=>this.onLogoutClick(e)}>Logout</Button></Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Header className="navbar">
          <Row type="flex" justify="center" align="middle" className="header-container"  >
            
              <Row  className="logo"  align="middle"  justify="center" type="flex">
                <Col className="brand">
                  <img style={{maxWidth: "100%"}} src={Logo}></img>
                </Col>  
              </Row>
              
              <Row type="flex" justify="center" className=" navbar__items input-container">
                <Col className="select">
                  <KnackSelect/>
                </Col>
                <Col className="ml search">
                  <KnackSearch onSearch={(value) => {this.setState({searchString: value}); this.search()}}/>
                </Col>
              </Row>
                 
              <Row className="toggle-container"type="flex" align="middle">
              
              {user.username && 
                  <Col>
                    <Link to="/new"><Icon  style={{fontSize: "22px"}} type="edit"  /></Link>
                  </Col>
              }
              {!user.username && <a href={this.getOathURL()}><Button>Login</Button></a>}
              {user.username &&
                  <Col className="ml">
                    <span className="mx-auto ml" style={{ marginRight: 24 }}>
                      <Badge count={1}><Avatar style={{backgroundColor: "#22419c"}} shape="square" icon="bell" /></Badge>
                    </span>
                  </Col>
                  }  
              <Col>
              {user.username &&
                  <Col className="ml" >
                    <div >
                     
                      <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="#">
                        <Avatar size="small" src={`https://steemitimages.com/u/${user.username}/avatar`}  icon="user" />
                        </a>
                      </Dropdown>
                    </div>
                  </Col>
                  } 
              </Col>
                <Col className="navbar__link-toggle">
                    <Icon onClick={e => this.handleHeaderToggle(e)} type="menu-fold" style={{fontSize: "20px"}} />
                </Col>
              </Row> 
          </Row>
          <Row type="flex" justify="center" align="middle" style={Object.assign({}, styles.header)} className="collasped-header">
             <Row type="flex" align="middle">
              <Col  className=" mb">
                <KnackSelect/>
              </Col>
            </Row>
            <Row type="flex" align="middle">
              <Col className=" collasped-search mb">
                <KnackSearch onSearch={(value) => {this.setState({searchString: value})}}/>
              </Col>
            </Row>
              

          </Row>
      </Header>
    );
  } 

  getOathURL () {
    return SteemConnect.getLoginURL();
  };

  
}

const mapStateToProps = state => {
  return {
    user: state.user,
    articles: state.articles,
    header: state.header
  }
}
KnackHeader.PropTypes = {
  articles: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object,
  header: PropTypes.object,
  dispatch: PropTypes.func,
  match: PropTypes.object
}


export default withRouter(connect(mapStateToProps)(KnackHeader));
