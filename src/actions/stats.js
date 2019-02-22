import * as types from './types';
import steem from 'steem';

import {apiGet, apiPost} from '../services/api';
import Cookies from 'js-cookie';
import {message} from 'antd';

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
        access_token: Cookies.get('accessToken'),
        search: search || undefined
      });

      dispatch({
        type: types.USERLIST_GET,
        payload: response.data.results
      });
    } catch (error) {
      window.console.log(error);
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
      let req = await apiPost(modEndpoints[action], {
        username: username,
        banReason: banReason,
        bannedUntil: bannedUntil,
      },Cookies.get('accessToken'));

      message.success(req.data.message);

      dispatch(getUserList());
    } catch (error) {
      //error handled in api post service
    }
  };
};

export const getRewardFund = (method='get') => {
  return async (dispatch) => {
    try {
      let steemRewardFundData = await steem.api.getRewardFundAsync('post');

      dispatch({
        type: types.STEEM_REWARD_FUND_GET,
        rewardFundObject: (steemRewardFundData) ? steemRewardFundData : {}
      }); 

    } catch (error) {
      window.console.error('We were unable to fetch steem reward fund data.');
    }
  };
};

export const getCurrentMedianHistoryPrice = (method='get') => {
  return async (dispatch) => {
    try {
      let currentMedianHistoryPriceData = await steem.api.getCurrentMedianHistoryPriceAsync();

      dispatch({
        type: types.CURRENT_MEDIAN_HISTORY_PRICE_GET,
        currentMedianHistoryPriceObject: (currentMedianHistoryPriceData) ? currentMedianHistoryPriceData : {}
      });  
    } catch (error) {
      window.console.error('We were unable to fetch current median history price.');
    }
  };
};

export const getDynamicGlobalProperties = (method='get') => {
  return async (dispatch) => {
    try {
      let dynamicGlobalPropertiesData = await steem.api.getDynamicGlobalPropertiesAsync();

      dispatch({
        type: types.DYNAMIC_GLOBAL_PROPERTIES_GET,
        dynamicGlobalPropertiesObject: (dynamicGlobalPropertiesData) ? dynamicGlobalPropertiesData : {}
      });
    } catch (error) {
      window.console.error('We were unable to fetch dynamic global properties data.');
    }
  };
};

export const getUserListBySearch = (skip, search) => {
  return async (dispatch) => {
    dispatch({
      type: types.USERLIST_REQUEST
    });

    try {
      //get user details from database, including the user role (supervisor, moderator, contributor)
      let response = await apiGet('/stats/users', {
        skip: skip || 0,
        search: search || undefined
      });

      if(!response){
        message.info("No users found for searchterm: " + search);
      }

      dispatch({
        type: types.USERLIST_GET,
        payload: response && response.data ? response.data.results : []
      });
    } catch (error) {
      window.console.log(error);
      dispatch({
        type: types.USERLIST_GET,
        payload: []
      });
    }
  };
};