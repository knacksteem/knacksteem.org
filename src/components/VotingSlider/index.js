import React, { Component } from 'react';
import './index.css';
import store from '../../store';
import {votePowerChange} from '../../actions/votingSlider';
import { Slider, Icon } from 'antd';
import { calculateVoteValue } from '../../services/functions';
import delay from './delay';
import {
  getRewardFund,
  getCurrentMedianHistoryPrice,
  getDynamicGlobalProperties,
} from '../../actions/stats';

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
};
export default class VotingSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      votePower: store.getState().votingSlider.value,
      voteWorth: 0
    };

  }
  async componentDidMount() {
    if(store.getState().stats.rewardFundObject.reward_balance === undefined)
      Promise.all([store.dispatch(getRewardFund()),
        store.dispatch(getCurrentMedianHistoryPrice()),
        store.dispatch(getDynamicGlobalProperties())]).then(res => {
        return res;
      });

    if(store.getState().user.userObjectSteemit.account === undefined) {
      await delay(5000);
    }
    const state = store.getState();
    const voteValue = calculateVoteValue({
      votingPower: state.user.userObjectSteemit.account.voting_power * (this.state.votePower / 10000),
      lastVoteTime: state.user.userObjectSteemit.account.last_vote_time,
      rewardBalance: state.stats.rewardFundObject.reward_balance,
      recentClaims: state.stats.rewardFundObject.recent_claims,
      currentMedianHistoryPrice: state.stats.currentMedianHistoryPriceObject,
      vestingShares: state.user.userObjectSteemit.account.vesting_shares,
      receivedVestingShares: state.user.userObjectSteemit.account.received_vesting_shares,
      delegatedVestingShares: state.user.userObjectSteemit.account.delegated_vesting_shares,
      totalVestingFundSteem: state.stats.dynamicGlobalPropertiesObject.total_vesting_fund_steem,
      totalVestingShares: state.stats.dynamicGlobalPropertiesObject.total_vesting_shares
    });

    this.setState({
      voteWorth: voteValue
    });

  }
  handleChange = async (e) => {
    const value = Number(e);
    store.dispatch(votePowerChange(value * 100));
    const state = store.getState();
    const voteValue = calculateVoteValue({
      votingPower: state.user.userObjectSteemit.account.voting_power * (value * 100 / 10000),
      lastVoteTime: state.user.userObjectSteemit.account.last_vote_time,
      rewardBalance: state.stats.rewardFundObject.reward_balance,
      recentClaims: state.stats.rewardFundObject.recent_claims,
      currentMedianHistoryPrice: state.stats.currentMedianHistoryPriceObject,
      vestingShares: state.user.userObjectSteemit.account.vesting_shares,
      receivedVestingShares: state.user.userObjectSteemit.account.received_vesting_shares,
      delegatedVestingShares: state.user.userObjectSteemit.account.delegated_vesting_shares,
      totalVestingFundSteem: state.stats.dynamicGlobalPropertiesObject.total_vesting_fund_steem,
      totalVestingShares: state.stats.dynamicGlobalPropertiesObject.total_vesting_shares
    });
    this.setState({
      votePower: value,
      voteWorth: voteValue
    });
  }
  render() {
    return (
      <div className="voting-container">
        <div className="voting-buttons-container">
          <span>
            <button className="voting-button"><Icon style={{color: '#22419c'}} type="check-circle" /> Confirm</button>
            <button className="voting-button"><Icon type="close-circle" /> Cancel</button>
          </span>
          <span>Vote worth: ${this.state.voteWorth}</span>
        </div>

        <Slider onChange={this.handleChange} marks={marks} defaultValue={100} />

      </div>
    );
  }
}
