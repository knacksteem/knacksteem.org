import * as types from './types';
import sc2 from 'sc2-sdk';
import Cookies from 'js-cookie';
import {push} from 'react-router-redux';
import Config from '../config';

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
      callbackURL: Config.SteemConnect.callbackURL,
      accessToken: accessToken,
      scope: Config.SteemConnect.scope
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
      callbackURL: Config.SteemConnect.callbackURL,
      accessToken: store.user.accessToken,
      scope: Config.SteemConnect.scope
    });
    api.revokeToken();

    Cookies.remove('accessToken');

    dispatch({
      type: types.USER_LOGOUT
    });
    dispatch(push('/'));
  };
};
