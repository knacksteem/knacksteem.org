import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Menu } from 'antd';
import './ProfileInfoBar.css';

const styles = {
  barIcon: {
    fontSize: '16px',
    marginRight: '10px',
    color: '#999',
    display: 'inline-block',
    width: '20px'
  }
};

const ProfileInfoBar = (props) => {
  const {
    style,
    signupDate,
    about,
    location,
    votingPower,
    voteValue,
    website
  } = props;

  return (
    <div style={{...style}} className="profile-info-bar">
      <Layout.Sider width={250} style={{ background: '#fff' }}>
        <div className="profile-info-bar-container">
          {(about !== undefined && about.length > 0) &&   
            <h4 className="profile-info-bar-title">{about}</h4>
          }

          <Menu style={{height: '100%', borderRight: 0, marginTop: '20px'}}>
            {(location !== undefined && location.length > 0) &&
            <Menu.Item key="location">
              <i style={styles.barIcon} className="fas fa-map-marker-alt"/>
              <span className="profile-info-bar-label">{location}</span>
            </Menu.Item>
            }

            {(website !== undefined && website.length > 0) &&
            <Menu.Item key="url" disabled={false}>
              <i style={styles.barIcon} className="fas fa-globe-asia"/>
              <span className="profile-info-bar-label">{website}</span>
            </Menu.Item>
            }

            <Menu.Item key="time" disabled={false}>
              <i style={styles.barIcon} className="far fa-clock"/>
              <span className="profile-info-bar-label">Joined {signupDate}</span>
            </Menu.Item>

            {(votingPower !== undefined) &&
            <Menu.Item key="power" disabled={false}>
              <i style={styles.barIcon} className="fas fa-bolt"/>
              <span className="profile-info-bar-label">Voting power: {votingPower}%</span>
            </Menu.Item>
            }

            {(voteValue !== undefined) &&
            <Menu.Item key="value" disabled={false}>
              <i style={styles.barIcon} className="fas fa-dollar-sign"/>
              <span className="profile-info-bar-label">Vote value: ${voteValue}</span>
            </Menu.Item>
            }

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
  signupDate: PropTypes.string,
  about: PropTypes.string,
  location: PropTypes.string,
  website: PropTypes.string,
  votingPower: PropTypes.string,
  voteValue: PropTypes.string
};

export default ProfileInfoBar;