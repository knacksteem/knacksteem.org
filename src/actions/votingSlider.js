import {VOTE_POWER_CHANGE} from './types';

export const votePowerChange = props => async dispatch => {
  dispatch({
    type: VOTE_POWER_CHANGE,
    payload: props
  });
};
