import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Button} from 'antd';
import PropTypes from 'prop-types';
import './index.css';
import sc2 from 'sc2-sdk';
const {Header} = Layout;

//Header with login and user details
const CustomHeader = ({user}) => {
  const getOathURL = () => {
    const api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: 'http://localhost:3000/callback',
      scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });
    return api.getLoginURL();
  };

  return (
    <Header>
      <div className="username-login">
        {user.username || <a href={getOathURL()}><Button>Login</Button></a>}
      </div>
    </Header>
  );
};

CustomHeader.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(connect(mapStateToProps)(CustomHeader));
