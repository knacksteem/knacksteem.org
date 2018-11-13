import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';
import './ProfileCategoriesBar.css';

/**
 * Displays available categories within the profile.
 * 
 * @param {Object}  Object.style          - Style attributes for this SFC.
 * @param {String}  Object.activeCategory - The category that is currently active.
 * @param {Array}   Object.categories     - Array of categories available.
 * @param {String}  Object.username       - Profile user's username.
 * 
 * @returns {Object<JSXElement>}
 */
const ProfileCategoriesBar = ({
  style,
  activeCategory,
  categories,
  username
}) => {

  return (
    <div style={{...style}} className="profile-categories-bar">
      <Layout style={{ background: '#fff' }}>
        <div className="profile-categories-bar-container" style={{padding: '10px'}}>
          <h2 style={{textAlign: 'center'}} className="profile-categories-bar-title">Categories</h2>

          <Menu
            style={{height: '100%', borderRight: 0, marginTop: '10px'}}
            defaultSelectedKeys={[`/${activeCategory}`]}
          >
            {categories.length > 0 && categories.map((elem) => {
              return (
                <Menu.Item key={`/${elem.key}`}>
                  <Link to={`/@${username}?category=${elem.key}`}>
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

      </Layout>
    </div>
  );
};

ProfileCategoriesBar.propTypes = {
  style: PropTypes.object,
  categories: PropTypes.array,
  activeCategory: PropTypes.string,
  username: PropTypes.string
};

export default ProfileCategoriesBar;