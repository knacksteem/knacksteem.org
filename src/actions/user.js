import * as types from './types';
import sc2 from 'sc2-sdk';

//TODO store access token on client (cookie, maybe redux-persist?)
export const userLogin = (accessToken) => {
  return async (dispatch) => {
    dispatch({
      type: types.USER_AUTH
    });

    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: 'http://localhost:3000/callback',
      accessToken: accessToken,
      scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });
    let response = await api.me();

    dispatch({
      type: types.USER_GET,
      username: response.user,
      userObject: response,
      accessToken: accessToken
    });
  };
};
