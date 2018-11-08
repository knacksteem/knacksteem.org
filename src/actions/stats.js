import * as types from './types';
import axios from 'axios';

import {apiGet, apiPost} from '../services/api';
import Cookies from 'js-cookie';
import {message} from 'antd';

const REMOTE_STEEM_API = 'https://api.steemjs.com';

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
        access_token: Cookies.get('accessToken'),
        username: username,
        banReason: banReason,
        bannedUntil: bannedUntil,
      });

      message.success(req.data.message);

      dispatch(getUserList());
    } catch (error) {
      //error handled in api post service
    }
  };
};

export const getRewardFund = (method='get') => {
  return async (dispatch) => {
    const url = `${REMOTE_STEEM_API}/getRewardFund?name=post`;
    const params = {};

    try {
      let steemRewardFundData = await axios({
        method,
        url,
        params,
        responseType: 'json'
      });

      dispatch({
        type: types.STEEM_REWARD_FUND_GET,
        rewardFundObject: (steemRewardFundData) ? steemRewardFundData.data : {}
      });  
    } catch (error) {
      window.console.error('We were unable to fetch steem reward fund data.');
    }
  };
};

export const getCurrentMedianHistoryPrice = (method='get') => {
  return async (dispatch) => {
    const url = `${REMOTE_STEEM_API}/getCurrentMedianHistoryPrice`;
    const params = {};

    try {
      let currentMedianHistoryPriceData = await axios({
        method,
        url,
        params,
        responseType: 'json'
      });

      dispatch({
        type: types.CURRENT_MEDIAN_HISTORY_PRICE_GET,
        currentMedianHistoryPriceObject: (currentMedianHistoryPriceData) ? currentMedianHistoryPriceData.data : {}
      });  
    } catch (error) {
      window.console.error('We were unable to fetch current median history price.');
    }
  };
};

export const getDynamicGlobalProperties = (method='get') => {
  return async (dispatch) => {
    const url = `${REMOTE_STEEM_API}/getDynamicGlobalProperties`;
    const params = {};

    try {
      let dynamicGlobalPropertiesData = await axios({
        method,
        url,
        params,
        responseType: 'json'
      });

      dispatch({
        type: types.DYNAMIC_GLOBAL_PROPERTIES_GET,
        dynamicGlobalPropertiesObject: (dynamicGlobalPropertiesData) ? dynamicGlobalPropertiesData.data : {}
      });
    } catch (error) {
      window.console.error('We were unable to fetch dynamic global properties data.');
    }
  };
};