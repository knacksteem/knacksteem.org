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
      voteWorth: 0
    };

  }
  async componentDidMount() {
    this.setState({
      voteWorth: await getVoteWorth()
    });

  }
  handleChange = async (e) => {
    const value = Number(e);
    store.dispatch(votePowerChange(value * 100));
    this.setState({
      votePower: value,
      voteWorth: await getVoteWorth()
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

        <Slider onAfterChange={this.handleChange} marks={marks} defaultValue={100} />

      </div>
    );
  }
}
