import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Layout, Menu } from 'antd';
import './ProfileInfoBar.css';

const styles = {
  barIcon: {
    fontSize: '16px',
    marginRight: '10px',
    color: '#999',
    display: 'inline-block',
    width: '20px'
  },
  modButton: {
    borderWidth: '2px',
    fontWeight: 'bold',
    width: 'inherit',
    marginBottom: '10px'
  },
  banButton: {
    borderWidth: '2px',
    fontWeight: 'bold',
    width: 'inherit',
    background: 'transparent'
  }
};

/**
 * Displays information for a user's profile.
 * 
 * @param {Object}    Object.style                - Style attributes for this SFC.
 * @param {Boolean}   Object.isSupervisor         - Is the logged in user a supervisor?
 * @param {Boolean}   Object.isModerator          - Is the logged in user a moderator?
 * @param {String}    Object.signupDate           - Profile user sign up date.
 * @param {String}    Object.about                - Profile user bio.
 * @param {String}    Object.location             - Profile user location.
 * @param {String}    Object.name                 - Profile user name.
 * @param {Double}    Object.votingPower          - Profile user levels of voting power.
 * @param {Double}    Object.voteValue            - Profile user vote worth.
 * @param {String}    Object.website              - Profile user website (if provided). 
 * @param {Function}  Object.onModChoiceSelect    - Callback function called when the moderator
 *                                                  choice is changed.
 * @param {Function}  Object.onBanButtonClick     - Callback function called when the ban button
 *                                                  is clicked.
 * @param {Object}    Object.user                 - The logged in user object.
 * 
 * @return {Object}
 */
const ProfileInfoBar = ({
  style,
  isSupervisor,
  isModerator,
  signupDate,
  about,
  location,
  name,
  votingPower,
  voteValue,
  website,
  onModChoiceSelect,
  onBanButtonClick,
  user
}) => {
  return (
    <div style={{...style}} className="profile-info-bar">
      <Layout.Sider width={250} style={{ background: '#fff', width: '100%' }}>
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

      {(Object.keys(user).length) > 0 &&
      <Layout.Sider width={250} style={{ background: 'transparent', boxShadow: 'none' }}>
        <div style={{ width: '100%', marginTop: '20px' }}>
          { isSupervisor &&
          <Dropdown
            overlay={
              <Menu onClick={({ item }) => onModChoiceSelect(item.props.choice, item.props.action)}>
                <Menu.Item
                  choice={'moderator'}
                  action={user.roles.indexOf('moderator') === -1 ? 'add' : 'remove'}
                  key="1"
                >
                  <Icon type="solution" />
                  {user.roles.indexOf('moderator') === -1 ? `Make ${name} a ` : `Remove ${name} as a `}
                  <b>Moderator</b>
                </Menu.Item>
                <Menu.Item
                  choice={'supervisor'}
                  key="2"
                  action={user.roles.indexOf('supervisor') === -1 ? 'add' : 'remove'}
                >
                  <Icon type="user" />
                  {user.roles.indexOf('supervisor') === -1 ? `Make ${name} a ` : `Remove ${name} as a `}
                  <b>Supervisor</b>
                </Menu.Item>
              </Menu>          
            }
            trigger={['click']}
          >
            <Button
              type="primary"
              size="large"
              style={styles.modButton}
            >
              {user.roles.indexOf('moderator') > -1 ? 'Strip Mod' : 'Make Mod'}
              / {user.roles.indexOf('supervisor') > -1 ? 'Remove Sup' : 'Make Sup'}
              <Icon type="down" />
            </Button>
          </Dropdown>
          }
          { (isSupervisor || isModerator) &&
          <Button
            onClick={e => onBanButtonClick(e)}
            size="large"
            type="primary"
            ghost
            style={styles.banButton}
          >
            {user.isBanned ? 'Unban': 'Ban'} {name}
          </Button>
          }
        </div>
      </Layout.Sider>
      }
    </div>
  );
};

ProfileInfoBar.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object,
  isSupervisor: PropTypes.bool,
  isModerator: PropTypes.bool,
  signupDate: PropTypes.string,
  about: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.string,
  onModChoiceSelect: PropTypes.func,
  onBanButtonClick: PropTypes.func,
  website: PropTypes.string,
  votingPower: PropTypes.string,
  voteValue: PropTypes.string
};

ProfileInfoBar.defaultProps = {
  isSupervisor: false
};

export default ProfileInfoBar;