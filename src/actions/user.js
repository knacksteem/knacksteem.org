import * as types from './types';
import Cookies from 'js-cookie';
import {push} from 'react-router-redux';
import {apiGet} from '../services/api';
import SteemConnect from '../services/SteemConnect';

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

    SteemConnect.setAccessToken(accessToken);
    let response = await SteemConnect.me();

    //TODO error handling if the token does not work (anymore) - try/catch

    Cookies.set('accessToken', accessToken);
    Cookies.set('username', response.user);

    //get user details from database, including the user role (supervisor, moderator, contributor)
    let userData = await apiGet('/stats/users', {
      username: response.user,
      access_token: accessToken
    });

    dispatch({
      type: types.USER_GET,
      username: response.user,
      userObject: (userData.data && userData.data.results) ? userData.data.results[0] : {},
      userObjectSteemit: response,
      accessToken: accessToken
    });
  };
};

/**
 * logout from SteemConnect and clear cookie
 */
export const userLogout = () => {
  return (dispatch) => {
    SteemConnect.revokeToken();

    Cookies.remove('accessToken');
    Cookies.remove('username');

    dispatch({
      type: types.USER_LOGOUT
    });
    dispatch(push('/'));
  };
};
