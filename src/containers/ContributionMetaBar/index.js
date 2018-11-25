import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'
import { Button, Layout, Menu, Row, Col} from 'antd';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getRemoteUserData} from '../../actions/user';
import SteemConnect from '../../services/SteemConnect';
import { repLog10 } from '../../services/functions';
import Cookies from 'js-cookie';
import defaultCover from '../../assets/images/cover.jpg';
import './index.css';


const styles = {
  barIcon: {
    fontSize: '16px',
    color: '#999'
  },
  metaImageContainer: {},
  userImageContainer: {}
};

styles.metaImageContainer.backgroundImage = `url(${defaultCover})`;

/**
 * Displays available list of contributions.
 * 
 * @param {String}  Object.metaImage          -Background Image of User of Block Chain.
 * @param {String}  Object.name           - Name of user.
 * @param {Sting}   Object.reputation    - Reputation of user.
 * @param {String}  Object.username       - Profile user's username.
 * @param {Method}  Object.handleLogin    - 
 * 
 * @returns {Object<JSXElement>}
 */

class ContributionMetaBar extends React.Component {

  constructor (props) {
    super(props);
    this.getOathURL = this.getOathURL.bind(this);
  }

  /**
    * @method getoauthURL
    * 
    * @param <void>
    * 
    * @return {String}
    */

  getOathURL () {
    return SteemConnect.getLoginURL();
  }

  componentDidMount() {
    this.loadRemoteUserData();
  }
  /**
   * @method loadRemoteUserData
   * 
   * @param <void>
   * 
   */

  loadRemoteUserData() {
    const {dispatch} = this.props;
    dispatch(getRemoteUserData(Cookies.get('username')));
  }

  render () {

    let 
      coverImage,
      name,
      reputation,
      remoteUserObjectMeta,
      username;

  
    const {user, location} = this.props;
    const { remoteUserObject} = user;
    const hasLoadedRemoteUserObject = Object.keys(remoteUserObject).length > 0;
    const isUserLoggedIn = (user.username !== '');

    console.log(user);
    

    if (hasLoadedRemoteUserObject) {
      remoteUserObjectMeta = JSON.parse(remoteUserObject.json_metadata).profile;
      name = remoteUserObjectMeta.name;
      coverImage = remoteUserObjectMeta.cover_image;
      reputation = repLog10(parseFloat(remoteUserObject.reputation)); 
      username = Cookies.get('username');
    }  

    styles.userImageContainer.backgroundImage = `url(${coverImage})`;
  
    return (
      <div className="contribution-bar" style={{width: '200px'}}>
        <Layout style={{ backgroundColor: '#fff' }}>
          <div className="contribution-info-bar-container">
            {username &&
              <Row type="flex" justify="center"  align="middle" className="image" style={{width: '200px',flexDirection: 'column', ...styles.userImageContainer}}>
                <Row  type="flex" justify="center" align="middle">
                  <Col >
                    <h1 style={{color: '#fff', fontWeight: 'bolder', fontSize: '12px'}}>{name}</h1>
                  </Col>
                  <Col style={{marginLeft: '10px'}}>
                    <Button  style={{color: '#000', padding: '3px',fontWeight: 'bolder'}}>{reputation}</Button>
                  </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                  <Col>
                    <Col>
                      <span style={{color: '#eee'}}>@{username}</span>
                    </Col>
                  </Col>
                </Row>
              </Row>
            }  
            {!username &&
  
              <Row type="flex"  justify="center" className="image" style={{width: '200px', ...styles.metaImageContainer}}>
                <Row type="flex" justify="center" align="middle">
                  <Col style={{margin: 'auto'}}>
                    <a href={this.getOathURL()}><Button style={{backgroundColor: '#22429d',border: '1px solid #22429d ',color: '#fff', margin: 'auto' }}>Login</Button></a>
                  </Col>
                </Row>
              </Row>
  
            }
  
            <Menu style={{height: '100%', borderRight: 0}} selectedKeys={[location.pathname]}>
              { isUserLoggedIn && user.isContributor &&
                <Menu.Item key="feeds">
                  <Link to="/mycontributions">
                    <i style={styles.barIcon} className="fas fa-pen"/>
                    <span className="contribution-info-bar-label">Feeds</span>  
                  </Link>
                
                </Menu.Item>
              }
              
              <Menu.Item key="sponsor" disabled={false}>
                <Link to="/sponsors"></Link>
                <i style={styles.barIcon} className="fas fa-clock"/>
                <span className="contribution-info-bar-label">Sponsor</span>
              </Menu.Item>
              <Menu.Item key="moderator" disabled={false}>
                <i style={styles.barIcon} className="fas fa-user-tie"/>
                <span className="contribution-info-bar-label">Moderator </span>
              </Menu.Item>
              { (user.isModerator) &&
                <Menu.Item key="review" disabled={false}>
                  <Link to="/moderation/review">
                    <i style={styles.barIcon} className="fas fa-bookmark"/>
                    <span className="contribution-info-bar-label">Review</span>
                  </Link>
                </Menu.Item>
              }
              { (user.isModerator) &&
                <Menu.Item key="pending" disabled={false}>
                  <Link to="/moderation/pending">
                    <i style={styles.barIcon} className="fas fa-bars"/>
                    <span className="contribution-info-bar-label">Pending </span>
                  </Link>
                </Menu.Item>
              }
              { (user.isModerator) &&
                <Menu.Item key="reserve" disabled={false}>
                  <Link to="/moderation/reserved"></Link>
                  <i style={styles.barIcon} className="fas fa-bookmark"/>
                  <span className="contribution-info-bar-label">Reserved </span>
                </Menu.Item>
              }
             
              
            </Menu>
  
            <Menu style={{height: '100%', borderRight: 0, marginTop: '20px'}} selectedKeys={[location.pathname]}>
              <Menu.Item key="guidelines">
                <Link to="/guidelines">
                  <i style={styles.barIcon} className="fas fa-align-left"/>
                  <span className="contribution-info-bar-label">Guidelines</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="faq" disabled={false}>
                <Link to="/faq">
                  <i style={styles.barIcon} className="fas fa-file"/>
                  <span className="contribution-info-bar-label">TOS</span>
                </Link>
                <i style={styles.barIcon} className="fas fa-question-circle"/>
                <span className="contribution-info-bar-label">FAQ</span>
              </Menu.Item>
              <Menu.Item key="tos" disabled={false}>
                <Link to="/tos">
                  <i style={styles.barIcon} className="fas fa-file"/>
                  <span className="contribution-info-bar-label">TOS</span>
                </Link>
              </Menu.Item>
            </Menu>
          </div>
        </Layout>
      </div>
    );
  }
  
};

ContributionMetaBar.propTypes = {
  metaImage: PropTypes.string,
  reputation: PropTypes.number,
  name: PropTypes.string,
  username: PropTypes.string,
  handleLogin: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(ContributionMetaBar));