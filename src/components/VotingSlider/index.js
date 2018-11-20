import React, { Component } from 'react';
import './index.css';
import store from '../../store';
import {votePowerChange} from '../../actions/votingSlider';
import { Slider, Icon } from 'antd';
import getVoteWorth from './getVoteWorth';
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
      voteWorth: 0,
      maxVoteWorth: 0
    };
  }
  async componentDidMount() {
    await this.setState({
      maxVoteWorth: await getVoteWorth({
        isMaxVote: true
      }),
      voteWorth: await getVoteWorth({
        isMaxVote: false
      }),
    });
  }
  handleChange = async (e) => {
    const value = Number(e);
    store.dispatch(votePowerChange(value * 100));
    await this.setState({
      votePower: value * 100,
      voteWorth: await getVoteWorth({
        isMaxVote: false
      })
    });
  }
  handleTip = () => {
    return `${this.state.votePower / 100}% $${this.state.voteWorth}`;
  }
  render() {
    return (
      <div className="voting-container">
        <div className="voting-buttons-container">
          <span>
            <button className="voting-button"><Icon style={{color: '#22419c'}} type="check-circle" /> Confirm</button>
            <button className="voting-button"><Icon type="close-circle" /> Cancel</button>
          </span>
          <span>{this.state.voteWorth === 0 ? <div className="loader"/> : `$${this.state.maxVoteWorth}`}</span>
        </div>
        <Slider disabled={this.state.maxVoteWorth === 0 ? true : false} onChange={this.handleChange} max={100} min={0} marks={marks} defaultValue={100} value={this.state.votePower / 100} tipFormatter={this.handleTip}/>
      </div>
    );
  }
}
