import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Menu, Row, Col} from 'antd';
import defaultCover from '../../../assets/images/cover.jpg';
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

const ContributionMetaBar = (props) => {
  const {metaImage, name, reputation, username, handleLogin} = props;
  styles.userImageContainer.backgroundImage = `url(${metaImage})`;

  return (
    <div className="contribution-bar ">
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
                  <a href={handleLogin}><Button style={{backgroundColor: '#22429d',border: '1px solid #22429d ',color: '#fff', margin: 'auto' }}>Login</Button></a>
                </Col>
              </Row>
            </Row>

          }

          <Menu style={{height: '100%', borderRight: 0}}>
            <Menu.Item key="contibution">
              <i style={styles.barIcon} className="fas fa-pen"/>
              <span className="contribution-info-bar-label">Contribution</span>
            </Menu.Item>
            <Menu.Item key="review" disabled={false}>
              <i style={styles.barIcon} className="fas fa-bookmark"/>
              <span className="contribution-info-bar-label">Review</span>
            </Menu.Item>
            <Menu.Item key="sponsor" disabled={false}>
              <i style={styles.barIcon} className="fas fa-clock"/>
              <span className="contribution-info-bar-label">Sponsor</span>
            </Menu.Item>
            <Menu.Item key="moderator" disabled={false}>
              <i style={styles.barIcon} className="fas fa-user-tie"/>
              <span className="contribution-info-bar-label">Moderator </span>
            </Menu.Item>
            <Menu.Item key="pending" disabled={false}>
              <i style={styles.barIcon} className="fas fa-bars"/>
              <span className="contribution-info-bar-label">Pending </span>
            </Menu.Item>
            <Menu.Item key="reserve" disabled={false}>
              <i style={styles.barIcon} className="fas fa-bookmark"/>
              <span className="contribution-info-bar-label">Reserved </span>
            </Menu.Item>
          </Menu>

          <Menu style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
            <Menu.Item key="guidelines">
              <i style={styles.barIcon} className="fas fa-align-left"/>
              <span className="contribution-info-bar-label">Guidelines</span>
            </Menu.Item>
            <Menu.Item key="faq" disabled={false}>
              <i style={styles.barIcon} className="fas fa-question-circle"/>
              <span className="contribution-info-bar-label">FAQ</span>
            </Menu.Item>
            <Menu.Item key="tos" disabled={false}>
              <i style={styles.barIcon} className="fas fa-file"/>
              <span className="contribution-info-bar-label">TOS</span>
            </Menu.Item>
          </Menu>
        </div>
      </Layout>
    </div>
  );
};

ContributionMetaBar.propTypes = {
  metaImage: PropTypes.string,
  reputation: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string,
  handleLogin: PropTypes.func,
};

export default ContributionMetaBar;