import React, { Component } from 'react';
import './index.css';
import Moderator from '../../components/Moderator/';
import {apiGet} from '../../services/api';
export default class Moderators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moderators: []
    };
  }
  async componentDidMount() {
    const apiCall = await apiGet('/stats/users');
    const moderators = apiCall.data.results.filter(user => {
      return user.roles.includes('moderator');
    });
    this.setState({
      moderators
    });
  }
  render() {
    return (
      <div className="moderators-container">
        <h1 className="moderators-h1">Moderators</h1>
        <p className="moderators-about">Meet KnackSteem moderators. They are a team of professionals who review/scrutinize all incoming contributions and make sure that they are up to standard. They also give valuable feedback to our contributors to help them improve.</p>

        <div className="moderators-data-container">
          {this.state.moderators.map(moderator => {

            return <Moderator key={moderator.username} username={moderator.username}/>;
          })}
        </div>
      </div>
    );
  }
}
