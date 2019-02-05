import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Row, Col, Layout, Menu } from 'antd';
import './ProfileInfoBar.css';

const styles = {
  barIcon: {
    fontSize: '12px',
    color: '#999',
    marginRight: '5px'

  },
  modButton: {
    borderWidth: '2px',
    fontWeight: 'bold',
    width: 'inherit',
    fontSize: '12px',
    marginBottom: '10px'
  },
  banButton: {
    borderWidth: '2px',
    fontWeight: 'bold',
    fontSize: '12px',
    width: 'inherit',
    background: 'transparent'
  }
};

const ModerationControls = ({
  name,
  user,
  isModerator,
  isSupervisor,
  isMasterSupervisor,
  onModChoiceSelect,
  onBanButtonClick
}) => {
  return (
    <Layout  style={{ background: 'transparent', boxShadow: 'none' }}>
      <div style={{ width: '100%', marginTop: '20px' }}>
        { (Object.keys(user).length > 0) &&
          <div>
            {(isMasterSupervisor || isSupervisor ) &&
            <Dropdown
              overlay={
                <Menu  onClick={({ item }) => onModChoiceSelect(item.props.choice, item.props.action)}>
                {(isMasterSupervisor || isSupervisor) &&
                  <Menu.Item
                    choice={'moderator'}
                    action={user.roles.indexOf('moderator') === -1 ? 'add' : 'remove'}
                    key="1"
                  >
                    <Icon type="solution" />
                    {user && user.roles.indexOf('moderator') === -1 ? ' a ' : ' as a '}
                    <b>Moderator</b>
                  </Menu.Item>
                }
                { isMasterSupervisor && (
                  <Menu.Item
                    choice={'supervisor'}
                    key="2"
                    action={user && user.roles.indexOf('supervisor') === -1 ? 'add' : 'remove'}
                  >
                    <Icon type="user" />
                    {user && user.roles.indexOf('supervisor') === -1 ? 'Make  ' : ' as a '}
                    <b>Supervisor</b>
                  </Menu.Item>
                )}
                </Menu>
              }
              trigger={['click']}
            >
              <Button
                type="primary"
                size="large"
                style={styles.modButton}
              >
                {user && user.roles.indexOf('moderator') > -1 ? 'Strip Mod' : 'Make Mod'}
                / {user && user.roles.indexOf('supervisor') > -1 ? 'Remove Sup' : 'Make Sup'}
                <Icon type="down" />
              </Button>
            </Dropdown>
            }
            {(isMasterSupervisor || isSupervisor) &&
            <Button
              onClick={e => onBanButtonClick(e)}
              size="large"
              type="primary"
              ghost
              style={styles.banButton}
            >
              {user && user.isBanned ? 'Unban': 'Ban'} {name}
            </Button>
            }
          </div>
        }
      </div>
    </Layout>
  );
};

ModerationControls.propTypes = {
  user: PropTypes.object,
  isModerator: PropTypes.bool,
  isSupervisor: PropTypes.bool,
  isMasterSupervisor: PropTypes.bool,
  name: PropTypes.string,
  onModChoiceSelect: PropTypes.func,
  onBanButtonClick: PropTypes.func,
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
  signupDate,
  about,
  location,
  name,
  votingPower,
  voteValue,
  website,
  isModerator,
  isSupervisor,
  isMasterSupervisor,
  onModChoiceSelect,
  onBanButtonClick,
  user
}) => {
  return (
    <div className="profile-info-bar" style={{width: '220px'}}>
      <Layout  style={{ background: '#fff' }}>
        <Row type="flex" style={{ flexDirection: 'column', padding: '5px'}} className="profile-info-bar-container">
          <Col style={{paddingLeft: '12px',paddingTop: '10px', textAlign: 'left', width: '100%', overflowWrap: 'break-word'}}>
            {(about !== undefined && about.length > 0) &&   
              <h4 className="profile-info-bar-title">{about}</h4>
            }
          </Col>
          <Col>
            <Menu style={{height: '100%', borderRight: 0}}>
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

              {(user.tokens !== undefined) &&
                <Menu.Item key="tokens" disabled={false}>
                  <span className="profile-info-bar-label">KNT Count: {user.tokens}</span>
                </Menu.Item>
              }

            </Menu>
          </Col>
          
        </Row>
      </Layout>
      {Object.keys(user) &&
      <ModerationControls
        isModerator={isModerator}
        isSupervisor={isSupervisor}
        isMasterSupervisor={isMasterSupervisor}
        user={user}
        onModChoiceSelect={onModChoiceSelect}
        onBanButtonClick={onBanButtonClick}
        name={user.username}
      />
      }
    </div>
  );
};

ProfileInfoBar.propTypes = {
  style: PropTypes.object,
  user: PropTypes.object,
  isModerator: PropTypes.bool,
  isSupervisor: PropTypes.bool,
  isMasterSupervisor: PropTypes.bool,
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