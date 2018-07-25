import {push} from 'react-router-redux';
import * as types from './types';
import {getUniquePermalink, getUniquePermalinkComment} from '../services/functions';
import sc2 from 'sc2-sdk';
import {apiPost, apiGet, apiPut} from '../services/api';
import Config from '../config';
import Cookies from 'js-cookie';

/**
 * get categories from server
 */
export const getCategories = () => {
  return async (dispatch) => {
    try {
      let response = await apiGet('/categories');
      dispatch({
        type: types.CATEGORIES_GET,
        payload: response.data.results
      });
    } catch (error) {
      console.log(error);
    }
  };
};

/**
 * get articles by category from backend
 */
export const getArticlesByCategory = (category, skip, search) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category: category
    });

    //get articles by category from server
    try {
      let response = await apiGet('/posts', {
        username: Cookies.get('username') || undefined,
        category: category || undefined,
        skip: skip || undefined, //skip elements for paging
        search: search || undefined
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
export const getArticlesByUser = (skip, search) => {
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
        username: Cookies.get('username') || undefined,
        author: store.user.username,
        skip: skip || undefined, //skip elements for paging
        search: search || undefined
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
        username: Cookies.get('username') || undefined,
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
export const postArticle = (title, body, tags, isComment, parentPermlink, parentAuthor) => {
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
      //post to blockchain
      if (isComment) {
        //generate unique permalink for new comment
        const newPermLink = getUniquePermalinkComment(parentPermlink);
        await api.comment(parentAuthor, parentPermlink, store.user.username, newPermLink, '', body, {});
      } else {
        //generate unique permalink for new article
        const newPermLink = getUniquePermalink(title);
        await api.comment('', tags[0], store.user.username, newPermLink, title, body, {tags: tags});

        //successfully posted to blockchain, now posting to backend with permalink and category
        await apiPost('/posts/create', {
          author: store.user.username,
          permlink: newPermLink,
          access_token: store.user.accessToken,
          category: tags[1],
          tags: tags
        });
      }

      if (!isComment) {
        //redirect to my contributions
        dispatch(push('/mycontributions'));
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch({
        type: types.ARTICLES_POSTED
      });
    }
  };
};

/**
 * edit article on blockchain - knacksteem backend changes are only for tags
 */
export const editArticle = (title, body, tags, articleData, isComment, parentPermlink, parentAuthor) => {
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
      if (isComment) {
        //edit comment on blockchain
        await api.comment(parentAuthor, parentPermlink, store.user.username, articleData.permlink, '', body, {});
      } else {
        //edit post on blockchain
        await api.comment('', tags[0], store.user.username, articleData.permlink, title, body, {tags: tags});

        //successfully edited post on blockchain, now editing tags on backend
        await apiPut('/posts/update', {
          permlink: articleData.permlink,
          access_token: store.user.accessToken,
          tags: tags
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      dispatch({
        type: types.ARTICLES_POSTED
      });
    }
  };
};

/**
 * approve article by mod
 */
export const approveArticle = (permlink) => {
  return async (dispatch, getState) => {
    const store = getState();

    try {
      //approve article with permalink and status
      await apiPost('/moderation/moderate', {
        permlink: permlink,
        approved: true,
        access_token: store.user.accessToken
      });
    } catch (error) {
      console.log(error);
    } finally {
      //reload pending articles after approval
      dispatch(getArticlesPending());
    }
  };
};

/**
 * reject article by mod
 */
export const rejectArticle = (permlink) => {
  return async (dispatch, getState) => {
    const store = getState();

    try {
      //approve article with permalink and status
      await apiPost('/moderation/moderate', {
        permlink: permlink,
        approved: false,
        access_token: store.user.accessToken
      });
    } catch (error) {
      console.log(error);
    } finally {
      //reload pending articles after approval
      dispatch(getArticlesPending());
    }
  };
};

/**
 * upvote article or comment
 * @param author author of the article or comment
 * @param permlink permalink of the article of comment
 * @param weight weight of the upvote (10000 is 100%)
 */
export const upvoteElement = (author, permlink, weight) => {
  return async (dispatch, getState) => {
    const store = getState();

    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: Config.SteemConnect.callbackURL,
      accessToken: store.user.accessToken,
      scope: Config.SteemConnect.scope
    });

    return await api.vote(store.user.username, author, permlink, weight);
  };
};

/**
 * delete article or comment
 * @param permlink permalink of the article of comment
 */
export const deleteElement = (permlink) => {
  return async (dispatch, getState) => {
    const store = getState();

    let api = sc2.Initialize({
      app: 'knacksteem.app',
      callbackURL: Config.SteemConnect.callbackURL,
      accessToken: store.user.accessToken,
      scope: Config.SteemConnect.scope
    });

    //use broadcast operation to delete comment
    return await api.broadcast([
      ['delete_comment', {
        'author': store.user.username,
        'permlink': permlink
      }]
    ]);
  };
};
