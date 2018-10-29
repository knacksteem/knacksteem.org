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
import {getArticlesByCategory, getArticlesByUser} from '../../actions/articles';
const {Header} = Layout;

const menu = (
  <Menu>
    <Menu.Item>
    <Link to="/"><Button>Logout</Button></Link>
    </Menu.Item>
  </Menu>
);

 
class KnackHeader extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      searchString: ''
    };
  }

  loadArticles(skip = 0, search) {
    const {dispatch, match} = this.props;
    dispatch(getArticlesByCategory(match.params.category, skip, search));
  };

  //load own contributions

  navigateToLocation(){
    this.props.history.push('/search-result')
  }
  
  search () {

    const {searchString} = this.state
    const {articles} = this.props;
 

    if(searchString == ''){
        return
    }else{
      this.navigateToLocation();
      this.loadArticles(articles.data.length, searchString);
    }
    
    
  }

  render(){

      const {user} = this.props;

    return (
      <Header className="navbar">
          <Row type="flex" justify="center" align="middle" className="header-container ">
            
              <Row className="logo"  align="middle"  justify="center" type="flex">
                <Col className="brand">
                  <img style={{maxWidth: "100%"}} src={Logo}></img>
                </Col>  
              </Row>
              
              <Row type="flex" justify="center" className=" navbar__items input-container">
                <Col className="select">
                  <KnackSelect/>
                </Col>
                <Col className="ml">
                  <KnackSearch onSearch={(value) => {this.setState({searchString: value}); this.search()}}/>
                </Col>
              </Row>
              <Row type="flex" align="middle"  justify="end" className=" navbar__items button-container">
                  {user.username && 
                  <Col>
                    <Link to="/new"><Button className="ml"><Icon type="edit" theme="outlined" /> </Button></Link>
                  </Col>
                  }
                  {!user.username && <a href={this.getOathURL()}><Button>Login</Button></a>}
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
                        <Avatar shape="square" src={`https://steemitimages.com/u/${user.username}/avatar`}  icon="user" />
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
  } 

  getOathURL () {
    return SteemConnect.getLoginURL();
  };

  
}

const mapStateToProps = state => {
  return {
    user: state.user,
    articles: state.articles
  }
}


export default withRouter(connect(mapStateToProps)(KnackHeader));
