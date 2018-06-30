import React from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Button} from 'antd';
import PropTypes from 'prop-types';
import {userLogout} from '../../actions/user';
import './index.css';
import sc2 from 'sc2-sdk';
import Config from '../../config';
const {Header} = Layout;

/**
 * Header with login and user details
 */
const CustomHeader = ({user, dispatch}) => {
  //get OAuth URL for Steem Connect
  const getOathURL = () => {
    const api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: Config.SteemConnect.callbackURL,
      scope: Config.SteemConnect.scope
    });
    return api.getLoginURL();
  };
  //dispatch logout action
  const onLogoutClick = () => {
    dispatch(userLogout());
  };
  return (
    <Header>
      <div className="username-login">
        {user.username && <Link to="/new"><Button>New Contribution</Button></Link>}
        {!user.username && <a href={getOathURL()}><Button>Login</Button></a>}
        {user.username && <Link to="/"><Button onClick={onLogoutClick}>Logout</Button></Link>}
      </div>
    </Header>
  );
};

CustomHeader.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(CustomHeader));
