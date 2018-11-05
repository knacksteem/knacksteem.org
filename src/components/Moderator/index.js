import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowButton from '../Common/FollowButton';
import { Link } from 'react-router-dom';
import './index.css';

export default class Moderator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steemPower: 0,
      avatar: ''
    };
  }

  render() {
    return (
      <div className="moderator-container" key={this.props.username}>
        <div className="moderator-avatar-container" style={{backgroundImage: `url(https://steemitimages.com/u/${
          this.props.username
        }/avatar)`}}>
        </div>
        <div><p className="moderator-username-container"><Link className="moderator-username" to={'/@'+this.props.username}>{this.props.username}</Link></p>
          <p className="moderator-steem-username">@{this.props.username}</p></div>
        <FollowButton />
      </div>
    );
  }
}

Moderator.propTypes = {
  username: PropTypes.string
};
