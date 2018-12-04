import {VOTE_POWER_CHANGE, TOGGLE_SLIDER} from './types';

export const votePowerChange = props => async dispatch => {
  dispatch({
    type: VOTE_POWER_CHANGE,
    payload: props
  });
};

export const toggleSlider = payload => {
  return {
    type: TOGGLE_SLIDER,
    payload
  };
};