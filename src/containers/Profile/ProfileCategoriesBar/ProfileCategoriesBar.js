import React from 'react';
import PropTypes from 'prop-types';
import { Button, Layout, Menu } from 'antd';
import './ProfileCategoriesBar.css';

const ProfileCategoriesBar = (props) => {
  const {style} = props;

  return (
    <div style={{...style}} className="profile-categories-bar">
      <Layout.Sider width={250}>
        <div className="profile-categories-bar-container">
          <h2 className="profile-categories-bar-title">Categories</h2>

          <Menu style={{height: '100%', borderRight: 0, marginTop: '10px'}}>
            <Menu.Item key="location">
              <span className="profile-info-bar-label">DIY</span>
            </Menu.Item>

            <Menu.Item key="url" disabled={false}>
              <span className="profile-info-bar-label">Art</span>
            </Menu.Item>

            <Menu.Item key="time" disabled={false}>
              <span className="profile-info-bar-label">One Altruism</span>
            </Menu.Item>

            <Menu.Item key="power" disabled={false}>
              <span className="profile-info-bar-label">Fashion</span>
            </Menu.Item>

            <Menu.Item key="value" disabled={false}>
              <span className="profile-info-bar-label">Tech trend</span>
            </Menu.Item>

          </Menu>

          <div style={{ padding: '0 20px', width: '100%', marginTop: '15px' }}>
            <Button size="large" type="primary" ghost style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
                Show all
            </Button>
          </div>

        </div>

      </Layout.Sider>
    </div>
  );
};

ProfileCategoriesBar.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object
};

export default ProfileCategoriesBar;