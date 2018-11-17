import {VOTE_POWER_CHANGE} from '../actions/types';

const initialState = {
  value: 10000
};

const votingSlider = (state = initialState, action) => {
  switch (action.type) {
    case VOTE_POWER_CHANGE:
      return {
        value: action.payload
      };
    default:
      return state;
  }
};

export default votingSlider;
