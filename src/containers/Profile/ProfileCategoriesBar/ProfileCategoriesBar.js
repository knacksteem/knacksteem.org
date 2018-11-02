import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import './ProfileCategoriesBar.css';

const ProfileCategoriesBar = (props) => {
  const {style, categories} = props;

  return (
    <div style={{...style}} className="profile-categories-bar">
      <Layout.Sider width={250}>
        <div className="profile-categories-bar-container">
          <h2 className="profile-categories-bar-title">Categories</h2>

          <Menu style={{height: '100%', borderRight: 0, marginTop: '10px'}}>
            {categories.length > 0 && categories.map((elem) => {
              return (
                <Menu.Item key={`/categories/${elem.key}`}>
                  <Link to={`/categories/${elem.key}`}>
                    <span className="profile-info-bar-label">{elem.name}</span>
                  </Link>
                </Menu.Item>
              );
            })}

          </Menu>

          <div style={{ padding: '0 20px', width: '100%', marginTop: '15px' }}>
            <Button size="large" style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
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
  user: PropTypes.object,
  categories: PropTypes.array
};

export default ProfileCategoriesBar;