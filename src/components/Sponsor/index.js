import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowButton from '../Common/FollowButton';
import steem from 'steem';
import { Link } from 'react-router-dom';
import './index.css';

export default class Sponsor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steemPower: 0
    };
  }
  async componentDidMount() {
    const steemPower = steem.formatter.vestToSteem(
      this.props.data.vesting_shares,
      parseFloat(this.props.total_vesting_shares),
      parseFloat(this.props.total_vesting_fund_steem)
    );
    this.setState({
      steemPower
    });
  }
  render() {
    return (
      <div className="sponsor-container" key={this.props.data.trx_id}>
        <img className="sponsor-avatar" src={`https://steemitimages.com/u/${
          this.props.data.delegator
        }/avatar`} alt={this.props.data.delegator + ' avatar'}/>
        <div><p className="sponsor-username-container"><Link className="sponsor-username" to={'/@'+this.props.data.delegator}>{this.props.data.delegator}</Link></p>
          <p className="sponsor-delegation">Delegated: {this.state.steemPower.toFixed(0) + ' STEEM'}</p></div>
        <FollowButton />
      </div>
    );
  }
}

Sponsor.propTypes = {
  data: PropTypes.object,
  total_vesting_shares: PropTypes.string,
  total_vesting_fund_steem: PropTypes.string
};
