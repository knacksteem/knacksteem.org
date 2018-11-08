import React from 'react';
import PropTypes from 'prop-types';

import { Layout, Button, Icon, Menu } from 'antd';
import './ProfileMetaBar.css';

const ProfileMetaBar = (props) => {
  const {style, followingCount, followersCount, username} = props;

  return (
    <div style={{...style}} className="profile-meta-bar">
      <Layout className="content-layout">
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
                  <a href={`https://steemit.com/@${username}/followers`}>
                    <span className="profile-meta-bar-label">Followers <strong>{ followersCount }</strong> </span>
                  </a>
                </Menu.Item>

                <Menu.Item key="url" disabled={false}>
                  <a href={`https://steemit.com/@${username}/following`}>
                    <span className="profile-meta-bar-label">Following <strong>{ followingCount }</strong> </span>
                  </a>
                </Menu.Item>

                <Menu.Item key="time" disabled={false}>
                  <a href={`https://steemit.com/@${username}/transfers`}>
                    <span className="profile-meta-bar-label">Wallet</span>
                  </a>
                </Menu.Item>

                <Menu.Item key="power" disabled={false}>
                  <a href={`https://steemit.com/@${username}/recent-replies`}>
                    <span className="profile-meta-bar-label">Activity</span>
                  </a>
                </Menu.Item>

              </Menu>
            </div>

            <div style={{ display: 'inline-block', marginLeft: '10px' }}>
              <Button href={`https://steemit.com/@${username}/settings`} size="large" style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
                Edit profile
              </Button>
            </div>

          </section>
        </div>
      </Layout>
    </div>
  );
};

ProfileMetaBar.propTypes = {
  style: PropTypes.object,
  username: PropTypes.string,
  followingCount: PropTypes.number,
  followersCount: PropTypes.number
};

export default ProfileMetaBar;