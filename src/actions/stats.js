import * as types from './types';
import {apiGet, apiPost} from '../services/api';
import Cookies from 'js-cookie';

/**
 * get list of users (for moderative actions)
 * @param skip number of users to skip in the response
 * @param banned return banned or non-banned users
 * @param search use search string to search for users
 */
export const getUserList = (skip, banned, search) => {
  return async (dispatch) => {
    dispatch({
      type: types.USERLIST_REQUEST
    });

    try {
      //get user details from database, including the user role (supervisor, moderator, contributor)
      let response = await apiGet('/stats/users', {
        access_token: Cookies.get('accessToken'),
        skip: skip || 0,
        banned: !!banned,
        search: search || undefined
      });

      dispatch({
        type: types.USERLIST_GET,
        payload: response.data.results
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.USERLIST_GET,
        payload: []
      });
    }
  };
};

/**
 * create moderative action on specific user
 * @param username name of the user to deal with
 * @param action moderative action
 * @param banReason reason for ban
 * @param bannedUntil end date for user ban
 */
export const moderateUser = (username, action, banReason, bannedUntil) => {
  return async (dispatch) => {
    const modEndpoints = {
      addSupervisor: '/moderation/add/supervisor',
      removeSupervisor: '/moderation/remove/supervisor',
      addModerator: '/moderation/add/moderator',
      removeModerator: '/moderation/remove/moderator',
      ban: '/moderation/ban',
      unban: '/moderation/unban'
    };
    try {
      await apiPost(modEndpoints[action], {
        access_token: Cookies.get('accessToken'),
        username: username,
        banReason: banReason,
        bannedUntil: bannedUntil,
      });

      dispatch(getUserList());
    } catch (error) {
      console.log(error);
    }
  };
};
