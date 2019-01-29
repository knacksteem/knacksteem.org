import {VOTE_POWER_CHANGE, TOGGLE_SLIDER} from '../actions/types';

const initialState = {
  value: 10000,
  isVotingSliderVisible: false
};

const votingSlider = (state = initialState, action) => {
  switch (action.type) {
    case VOTE_POWER_CHANGE:
      return {
        value: action.payload
      };
    case TOGGLE_SLIDER:
      return {
        isVotingSliderVisible: !initialState.isVotingSliderVisible
      }
    default:
      return state;
  }
};

export default votingSlider;
