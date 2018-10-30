import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Menu } from 'antd';
import './ProfileInfoBar.css';

const styles = {
  barIcon: {
    fontSize: '16px',
    marginRight: '10px',
    color: '#999'
  }
};

const ProfileInfoBar = (props) => {
  const {style} = props;

  return (
    <div style={{...style}} className="profile-info-bar">
      <Layout.Sider width={250}>
        <div className="profile-info-bar-container">
          <h3 className="profile-info-bar-title">UI/UX Designer | Design Addict | Perfectionist</h3>

          <Menu style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
            <Menu.Item key="location">
              <i style={styles.barIcon} className="fas fa-map-marker-alt"/>
              <span className="profile-info-bar-label">Europe</span>
            </Menu.Item>

            <Menu.Item key="url" disabled={false}>
              <i style={styles.barIcon} className="fas fa-globe-asia"/>
              <span className="profile-info-bar-label">knacksteem.org/@creatrixity</span>
            </Menu.Item>

            <Menu.Item key="time" disabled={false}>
              <i style={styles.barIcon} className="far fa-clock"/>
              <span className="profile-info-bar-label">Joined 16 March 2018</span>
            </Menu.Item>

            <Menu.Item key="power" disabled={false}>
              <i style={styles.barIcon} className="fas fa-bolt"/>
              <span className="profile-info-bar-label">Voting power: 100%</span>
            </Menu.Item>

            <Menu.Item key="value" disabled={false}>
              <i style={styles.barIcon} className="fas fa-dollar-sign"/>
              <span className="profile-info-bar-label">Vote value: $0.03</span>
            </Menu.Item>

          </Menu>
        </div>
      </Layout.Sider>

      <Layout.Sider width={250} style={{ background: 'transparent', boxShadow: 'none' }}>
        <div style={{ width: '100%', marginTop: '20px' }}>
          <Button type="primary" size="large" style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', marginBottom: '10px' }}>
            Make a Mod / Sup
          </Button>

          <Button size="large" type="primary" ghost style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
            Ban / Unban
          </Button>
        </div>
      </Layout.Sider>
    </div>
  );
};

ProfileInfoBar.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object
};

export default ProfileInfoBar;