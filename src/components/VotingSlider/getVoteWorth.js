import steem from 'steem';
import store from '../../store';
import delay from './delay';
import {
  getRewardFund,
  getCurrentMedianHistoryPrice,
  getDynamicGlobalProperties,
} from '../../actions/stats';
const getVoteWorth = async props => {
  const oldState = store.getState();
  if(oldState.user.userObjectSteemit.account === undefined) {
    await delay(5000);
  }
  if(oldState.stats.rewardFundObject.reward_balance === undefined || oldState.stats.currentMedianHistoryPriceObject.base === undefined) {
    await Promise.all([store.dispatch(getRewardFund()),
      store.dispatch(getCurrentMedianHistoryPrice()),
      store.dispatch(getDynamicGlobalProperties())]).then(res => {
      return res;
    });
  }
  const profile = await store.getState().user.userObjectSteemit;
  const slidingVotingPower = props.isMaxVote === true ? 1 : (store.getState().votingSlider.value / 10000);
  const votingPower =
    profile.account.voting_power * slidingVotingPower;
  const vestingShares =
    parseFloat(profile.account.vesting_shares.split(' ')[0]) +
    parseFloat(profile.account.received_vesting_shares.split(' ')[0]) -
    parseFloat(profile.account.delegated_vesting_shares.split(' ')[0]);
  const stats = store.getState().stats;
  const globalData = stats.dynamicGlobalPropertiesObject;
  const rewardFund = stats.rewardFundObject;
  const price = stats.currentMedianHistoryPriceObject;
  const steemPower = steem.formatter.vestToSteem(
    vestingShares,
    parseFloat(globalData.total_vesting_shares),
    parseFloat(globalData.total_vesting_fund_steem)
  );

  let m = parseInt((100 * votingPower * (100 * 100)) / 10000);
  m = parseInt((m + 49) / 50);
  const i =
    parseFloat(rewardFund.reward_balance.replace(' STEEM', '')) /
    parseFloat(rewardFund.recent_claims);
  const o =
    parseFloat(price.base.replace(' SBD', '')) /
    parseFloat(price.quote.replace(' STEEM', ''));
  const a =
    globalData.total_vesting_fund_steem.replace(' STEEM', '') /
    globalData.total_vesting_shares.replace(' VESTS', '');
  const r = steemPower / a;
  let vote;
  vote = parseInt(r * m * 100) * i * o;
  vote = vote / 100;
  return vote.toFixed(2);
};
export default getVoteWorth;
