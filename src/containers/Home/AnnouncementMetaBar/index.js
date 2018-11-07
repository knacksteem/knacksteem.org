import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Menu } from 'antd';
import './index.css';

const styles = {
  barIcon: {
    fontSize: '16px',
    color: '#999',
  }
};

const AnnouncementMetaBar = (props) => {

  return (
    <div className="contribution-bar ">
      <Layout style={{ backgroundColor: '#fff' }}>
        <div className="profile-info-bar-container">
            
            <h3 className="profile-info-bar-title">about</h3>
          

          <Menu style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
            <Menu.Item key="location">
              <i style={styles.barIcon} className="fas fa-map-marker-alt"/>
              <span className="profile-info-bar-label">location</span>
            </Menu.Item>
            <Menu.Item key="url" disabled={false}>
              <i style={styles.barIcon} className="fas fa-globe-asia"/>
              <span className="profile-info-bar-label">website</span>
            </Menu.Item>
            <Menu.Item key="time" disabled={false}>
              <i style={styles.barIcon} className="far fa-clock"/>
              <span className="profile-info-bar-label">Joined 16 March 2018</span>
            </Menu.Item>
            <Menu.Item key="power" disabled={false}>
              <i style={styles.barIcon} className="fas fa-bolt"/>
              <span className="profile-info-bar-label">Voting power: </span>
            </Menu.Item>
            <Menu.Item key="value" disabled={false}>
              <i style={styles.barIcon} className="fas fa-dollar-sign"/>
              <span className="profile-info-bar-label">Vote value: </span>
            </Menu.Item>
          </Menu>
        </div>
      </Layout>
    </div>
  );
};


export default AnnouncementMetaBar;