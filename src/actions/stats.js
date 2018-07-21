import * as types from './types';
import {apiGet} from '../services/api';

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
