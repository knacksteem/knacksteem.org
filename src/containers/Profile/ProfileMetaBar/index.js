import React from 'react';
import PropTypes from 'prop-types';

import {
  Layout,
  Button,
  Dropdown,
  Icon,
  Menu
} from 'antd';
import './ProfileMetaBar.css';

/**
 * Displays meta information about the profile user.
 * 
 * @param {Object}  Object.style                  - Style attributes for this SFC.
 * @param {Integer} Object.followingCount         - Total Steemians following the profile user.  
 * @param {Integer} Object.followersCount         - Profile user total followers.
 * @param {String}  Object.username               - Profile user's username followers.
 * @param {String}  Object.filterBy               - Criteria to filter articles by.
 * @param {Integer} Object.onArticlesFilterSelect - Called when the articles filter changes.
 * 
 * @return {Object<JSXElement>}
 */
const ProfileMetaBar = ({
  style,
  followingCount,
  followersCount,
  username,
  filterBy,
  onArticlesFilterSelect
}) => {
  let filterDisplayText;

  switch (filterBy) {
    case 'accepted':
      filterDisplayText = 'Accepted posts';
      break;

    case 'pending':
      filterDisplayText = 'Pending posts';
      break;

    case 'declined':
      filterDisplayText = 'Declined posts';
      break;
    default:
      filterDisplayText = 'All posts';
      break;
  }

  return (
    <div style={{...style}} className="profile-meta-bar">
      <Layout className="content-layout">
        <div className="profile-meta-bar-container">
          <section className="profile-meta-bar-content">
            <div style={{ display: 'inline-block' }}>
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ item }) => onArticlesFilterSelect(item.props.filterby)}
                    defaultSelectedKeys={[`${filterBy}`]}
                  >
                    {filterBy !== '' &&
                    <Menu.Item
                      filterby=""
                      key=""
                    >
                      <Icon type="menu-fold" theme="outlined" />
                      All posts
                    </Menu.Item>
                    }

                    {filterBy !== 'accepted' &&
                    <Menu.Item
                      filterby="accepted"
                      key="accepted"
                    >
                      <Icon type="like" theme="outlined" />
                      Only accepted posts
                    </Menu.Item>
                    }
                    {filterBy !== 'pending' &&
                    <Menu.Item
                      key="pending"
                      filterby="pending"
                    >
                      <Icon type="meh" theme="outlined" />
                      Only pending posts
                    </Menu.Item>
                    }
                    {filterBy !== 'declined' &&
                    <Menu.Item
                      key="declined"
                      filterby="declined"
                    >
                      <Icon type="dislike" theme="outlined" />
                      Only declined posts
                    </Menu.Item>
                    }
                  </Menu>          
                }
                trigger={['click']}

              >
                <Button
                  size="large"
                  style={{
                    borderWidth: '2px',
                    fontWeight: 'bold',
                    width: 'inherit',
                    background: 'transparent'
                  }}>
                  {filterDisplayText}
                  <Icon type="caret-down" />
                </Button>
              </Dropdown>
            </div>

            <div style={{ display: 'inline-block' }}>
              <Menu
                mode="horizontal"
                style={{height: '100%', borderRight: 0, borderBottom: 0}}
              >
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

            <div style={{ display: 'inline-block', float: 'right', marginTop: '5px' }}>
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
  followersCount: PropTypes.number,
  filterBy: PropTypes.string,
  onArticlesFilterSelect: PropTypes.func
};

export default ProfileMetaBar;