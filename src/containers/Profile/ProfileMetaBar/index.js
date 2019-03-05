import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import {
  Button,
  Dropdown,
  Icon,
  Menu,
  Row,
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
    <Row  type="flex" justify="center" align="middle" style={{backgroundColor: '#fff', padding: '2px', flexWrap: 'wrap', flexFlow: 'row wrap'}} className="profile-meta-bar">
    
      <Row>
        <Menu
          mode="horizontal"
          style={{ borderRight: 0, borderBottom: 0, whiteSpace: 'pre-wrap !important'}}
        >
          <Menu.Item key="post">
            <div>
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ item }) => onArticlesFilterSelect(item.props.filterby)}
                    defaultSelectedKeys={[`${filterBy}`]}
                    style={{flexWrap: 'wrap', flexFlow: 'column', display: 'flex'}}
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
                  size="default"
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
          </Menu.Item>
          <Menu.Item key="location">
            <a href={`https://steemit.com/@${username}/followers`}>
              <span className="profile-meta-bar-label">Followers <strong>{ followersCount }</strong> </span>
            </a>
          </Menu.Item>

          <Menu.Item key="url" disabled={false}>
            <span className="profile-meta-bar-label">Following <strong>{ followingCount }</strong> </span>
          </Menu.Item>

          <Menu.Item key="time" disabled={false}>
            <span className="profile-meta-bar-label">Wallet</span>
          </Menu.Item>

          <Menu.Item key="power" disabled={false}>
            <span className="profile-meta-bar-label" style={{ fontWeight: 'bold' }}>Activity</span>
          </Menu.Item>
          {Cookies.get('username') === username &&
          <Menu.Item key="edit" disabled={false}>
            <div>
              <Button href={`https://steemit.com/@${username}/settings`} size="small" style={{ borderWidth: '2px', fontWeight: 'bold', width: 'inherit', background: 'transparent' }}>
                Edit profile
              </Button>
            </div>
          </Menu.Item>
          }

        </Menu>
      </Row>
    </Row>
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