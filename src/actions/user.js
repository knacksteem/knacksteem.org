import * as types from './types';
import sc2 from 'sc2-sdk';
import Cookies from 'js-cookie';

/**
 * check if the user is logged in already (with a cookie)
 */
export const checkLoginData = () => {
  return async (dispatch) => {
    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      dispatch(userLogin(accessToken));
    }
  };
};

/**
 * initialize the login after steem connect callback
 */
export const userLogin = (accessToken) => {
  return async (dispatch) => {
    dispatch({
      type: types.USER_AUTH
    });

    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/callback' : 'http://knacksteem.org/callback',
      accessToken: accessToken,
      scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });
    let response = await api.me();

    //TODO error handling if the token does not work (anymore) - try/catch

    Cookies.set('accessToken', accessToken);

    dispatch({
      type: types.USER_GET,
      username: response.user,
      userObject: response,
      accessToken: accessToken
    });
  };
};

/**
 * logout from SteemConnect and clear cookie
 */
export const userLogout = () => {
  return (dispatch, getState) => {
    const store = getState();

    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/callback' : 'http://knacksteem.org/callback',
      accessToken: store.user.accessToken
    });
    api.revokeToken();

    Cookies.remove('accessToken');

    dispatch({
      type: types.USER_LOGOUT
    });
  };
};
