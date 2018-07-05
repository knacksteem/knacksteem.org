import {push} from 'react-router-redux';
import * as types from './types';
import {userLogout} from './user';
import {getUniquePermalink} from '../services/functions';
import sc2 from 'sc2-sdk';
import {apiPost, apiGet} from '../services/api';
import Config from '../config';

/**
 * get articles by category from backend
 */
export const getArticlesByCategory = (category, skip) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category: category
    });

    //get articles by category from server
    try {
      let response = await apiGet('/posts', {
        category: category || undefined,
        skip: skip || undefined //skip elements for paging
      });
      dispatch({
        type: types.ARTICLES_GET,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.ARTICLES_GET,
        payload: []
      });
    }
  };
};

/**
 * get articles by user from backend
 */
export const getArticlesByUser = (skip) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category: ''
    });

    const store = getState();

    //get user articles from server
    try {
      let response = await apiGet('/posts', {
        author: store.user.username,
        skip: skip || undefined //skip elements for paging
      });
      dispatch({
        type: types.ARTICLES_GET,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.ARTICLES_GET,
        payload: []
      });
    }
  };
};

/**
 * get pending articles, waiting for moderation
 */
export const getArticlesPending = (skip) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category: ''
    });

    //get articles by category from server
    try {
      let response = await apiGet('/stats/moderation/pending', {
        skip: skip || undefined //skip elements for paging
      });
      dispatch({
        type: types.ARTICLES_GET,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: types.ARTICLES_GET,
        payload: []
      });
    }
  };
};

/**
 * post article to blockchain and knacksteem backend
 */
export const postArticle = (title, body, tags) => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.ARTICLES_POSTING
    });

    const store = getState();

    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: Config.SteemConnect.callbackURL,
      accessToken: store.user.accessToken,
      scope: Config.SteemConnect.scope
    });

    try {
      //generate unique permalink for new article
      const newPermLink = getUniquePermalink(title);

      //post to blockchain
      await api.comment('', tags[0], store.user.username, newPermLink, title, body, {tags: tags});

      //successfully posted to blockchain, now posting to backend with permalink and category
      await apiPost('/posts/create', {
        author: store.user.username,
        permlink: newPermLink,
        access_token: store.user.accessToken,
        category: tags[1],
        tags: tags
      });

      //redirect to my contributions
      dispatch(push('/mycontributions'));
    } catch (error) {
      console.log(error);
      //invalidate login
      dispatch(userLogout());
    } finally {
      dispatch({
        type: types.ARTICLES_POSTED
      });
    }
  };
};
