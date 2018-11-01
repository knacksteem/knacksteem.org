import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu } from 'antd';
import './ProfileMetaBar.css';

const ProfileMetaBar = (props) => {
  const {style, followingCount, followersCount} = props;

  return (
    <div style={{...style}} className="profile-meta-bar">
      <section className="content-layout">
        <div className="profile-meta-bar-container">
          <section className="profile-meta-bar-content">
            <div style={{ display: 'inline-block' }}>
              <Button size="large" style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
                All posts
                <Icon type="caret-down" />
              </Button>
            </div>

            <div style={{ display: 'inline-block' }}>
              <Menu mode="horizontal" style={{height: '100%', borderRight: 0, borderBottom: 0}}>
                <Menu.Item key="location">
                  <span className="profile-meta-bar-label">Followers <strong>{ followersCount }</strong> </span>
                </Menu.Item>

                <Menu.Item key="url" disabled={false}>
                  <span className="profile-meta-bar-label">Following <strong>{ followingCount }</strong> </span>
                </Menu.Item>

                <Menu.Item key="time" disabled={false}>
                  <span className="profile-meta-bar-label">Wallet</span>
                </Menu.Item>

                <Menu.Item key="power" disabled={false}>
                  <span className="profile-meta-bar-label">Activity</span>
                </Menu.Item>

              </Menu>
            </div>

            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
              <Button size="large" style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
                Edit profile
              </Button>
            </div>

          </section>
        </div>
      </section>
    </div>
  );
};

ProfileMetaBar.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object,
  followingCount: PropTypes.number,
  followersCount: PropTypes.number
};

export default ProfileMetaBar;