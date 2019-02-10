import React, { Component } from 'react';
import './index.css';
import store from '../../store';
import {votePowerChange} from '../../actions/votingSlider';
import { Slider, Icon, Button } from 'antd';
import getVoteWorth from './getVoteWorth';
import PropTypes from 'prop-types';

const marks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
};

const negativeMarks = {
  '0': '0%',
  '-25': '-25%',
  '-50': '-50%',
  '-75': '-75%',
  '-100': '-100%'
};

class VotingSlider extends Component {
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
    this.props.onVotePowerChange(value * 100);
    await this.setState({
      votePower: value * 100,
      voteWorth: await getVoteWorth({
        isMaxVote: false
      })
    });
    
  }
  handleTip = () => {
    const {showVoteWorth} = this.props;
    const returnValue = showVoteWorth ? `${this.state.votePower / 100}% $${this.state.voteWorth}` : `${this.state.votePower / 100}%`
    return returnValue;
  }
  render() {
    const {onConfirm, onCancel, votingDirection, showVoteWorth} = this.props;
    const voteValues = votingDirection > 0 ? marks : negativeMarks;
    return (
      <div className="voting-container">
        <div className="voting-header-container">
          <span>
            <button className="voting-button-header" onClick={onConfirm}><Icon style={{color: '#22419c'}} type="check-circle" /> Confirm</button>
            <button className="voting-button-header" onClick={onCancel}><Icon type="close-circle" /> Cancel</button>
          </span>
          <span>{showVoteWorth && (this.state.voteWorth === 0 ? <div className="loader"/> : `$${this.state.maxVoteWorth}`)}</span>
        </div>
        {
          votingDirection >= 0 && <Slider disabled={this.state.maxVoteWorth === 0 ? true : false} onChange={this.handleChange} max={100} min={0} marks={voteValues} defaultValue={100} value={this.state.votePower / 100} tipFormatter={this.handleTip}/>
        }
        {
          votingDirection < 0 && <Slider disabled={this.state.maxVoteWorth === 0 ? true : false} onChange={this.handleChange} max={0} min={-100} marks={voteValues} defaultValue={-100} value={this.state.votePower / 100} tipFormatter={this.handleTip}/>
        }
        
        <div className="voting-buttons-container">
          {votingDirection >= 0 && Object.keys(voteValues).map(key => {
            return <Button className="voting-button" disabled={this.state.maxVoteWorth === 0 ? true : false} key={key} onClick={() => this.handleChange(key)}>{key}%</Button>;
          })}
          {votingDirection < 0 && Object.keys(voteValues).sort((a, b) => a - b).map(key => {
            return <Button className="voting-button" disabled={this.state.maxVoteWorth === 0 ? true : false} key={key} onClick={() => this.handleChange(key)}>{key}%</Button>;
          })}
        </div>
        { showVoteWorth && <div className="voting-worth-information">
            Your vote will be worth: ${this.state.voteWorth}.
          </div>
        }
      </div>
    );
  }
}

VotingSlider.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onVotePowerChange: PropTypes.func,
  votingDirection: PropTypes.number
};

VotingSlider.defaultProps = {
  onConfirm: () => {},
  onCancel: () => {},
  onVotePowerChange: () => {},
};

export default VotingSlider;
