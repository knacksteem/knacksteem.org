import {push} from 'react-router-redux';
import * as types from './types';
import {getUniquePermalink, getUniquePermalinkComment} from '../services/functions';
import {apiPost, apiGet, apiPut} from '../services/api';
import Cookies from 'js-cookie';
import SteemConnect from '../services/SteemConnect';
import {message} from 'antd';

const IMAGE_REGEX = /!\[.*?]\((.*?)\)/g;

/**
 * get categories from server
 */
export const getCategories = () => {
  return async (dispatch) => {
    try {
      let response = await apiGet('/categories');
      response.data.results = response.data.results.filter((category) => {
        if(category.key === 'vlog' || category.key === 'graphics' || category.key === 'art' || category.key === 'knack' || category.key === 'techtrends') {
          return true;
        }
        return false;
      });
      dispatch({
        type: types.CATEGORIES_GET,
        payload: response.data.results
      });
    } catch (error) {
      message.error('error getting categories');
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
export const getArticlesByUser = (skip, search, limit=25) => {
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
        search: search || undefined,
        limit
      });
      dispatch({
        type: types.ARTICLES_GET,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
      dispatch({
        type: types.ARTICLES_GET,
        payload: []
      });
    }
  };
};

export const getArticlesByUsername = (username, skip, search, category = '', limit=25) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category
    });

    //get user articles from server
    try {
      let response = await apiGet('/posts', {
        username: username || undefined,
        author: username,
        skip: skip || undefined, //skip elements for paging
        search: search || undefined,
        category: category || undefined,
        limit: limit || undefined
      });
      dispatch({
        type: types.ARTICLES_GET,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
      dispatch({
        type: types.ARTICLES_GET,
        payload: []
      });
    }
  };
};

/**
 * get articles for moderation
 * @param route can be /moderation/pending or /moderation/reserved, for example
 * @param skip number of elemnts to skip, used for lazy loading
 * @param search search string
 */

export const getArticlesModeration = (route, skip, search, username) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category: ''
    });

    //get articles by category from server
    try {
      let response = await apiGet(`/stats${route}`, {
        skip: skip || undefined, //skip elements for paging
        search: search || undefined,
        username: username || undefined
      });
      dispatch({
        type: types.ARTICLES_GET,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
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
  let images = [];
  let matches;

  // eslint-disable-next-line
  while ((matches = IMAGE_REGEX.exec(body))) {
    if (images.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
      images.push(matches[1]);
    }
  }

  return async (dispatch, getState) => {
    dispatch({
      type: types.ARTICLES_POSTING
    });

    const store = getState();
   
    try {
      //post to blockchain

      if (isComment) {
        //generate unique permalink for new comment
        
        const newPermLink = getUniquePermalinkComment(parentPermlink);
        await SteemConnect.comment(parentAuthor, parentPermlink, store.user.username, newPermLink, '', body, {});
      } else {
        //generate unique permalink for new article
        const newPermLink = getUniquePermalink(title);
    
        //post with beneficiaries
        const operations = [
          ['comment',
            {
              parent_author: '',
              parent_permlink: tags[0],
              author: store.user.username,
              permlink: newPermLink,
              title: title,
              body: body,
              json_metadata: JSON.stringify({
                tags: tags,
                image: images
              })
            }
          ],
          ['comment_options', {
            author: store.user.username,
            permlink: newPermLink,
            max_accepted_payout: '100000.000 SBD',
            percent_steem_dollars: 50,
            allow_votes: true,
            allow_curation_rewards: true,
            extensions: [
              [0, {
                beneficiaries: [{account: 'knacksteem.org', weight: 1500}]
              }]
            ]
          }]
        ];
      
        await SteemConnect.broadcast(operations);


        //successfully posted to blockchain, now posting to backend with permalink and category
        await apiPost('/posts/create', {
          author: store.user.username,
          permlink: newPermLink,
          category: tags[1],
          tags: tags
        }, store.user.accessToken);
      }

      if (!isComment) {
        //redirect to my contributions
        dispatch(push('/feeds'));
      } 
      return true;
    } catch (error) {
      message.error('error creating article');
    } finally {
      dispatch({
        type: types.ARTICLES_POSTED
      });
    }
    return false;
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
    try {
      if (isComment) {
        //edit comment on blockchain
        await SteemConnect.comment(parentAuthor, parentPermlink, store.user.username, articleData.permlink, '', body, {});
      } else {
        //edit post on blockchain

        const operations = [
          ['comment',
            {
              parent_author: '',
              parent_permlink: 'knacksteem',
              author: store.user.username,
              permlink: articleData.permlink,
              title: title,
              body: body,
              json_metadata: JSON.stringify({
                tags: tags
              })
            }
          ],
        ];

        await SteemConnect.broadcast(operations);

        //successfully edited post on blockchain, now editing tags on backend
        await apiPut('/posts/update', {
          permlink: articleData.permlink,
          tags: tags
        }, store.user.accessToken);
      }
      if (!isComment) {
        //redirect to my contributions
        dispatch(push('/feeds'));
      }

      return true;
    } catch (error) {
      message.error('error editing element');
    } finally {
      dispatch({
        type: types.ARTICLES_POSTED
      });
    }
    return false;
  };
};

/**
 * reserve article by mod
 */
export const reserveArticle = (permlink, status) => {
  return async (dispatch, getState) => {
    const store = getState();

    try {
      //approve article with permalink and status
      await apiPost('/moderation/reserve', {
        permlink: permlink,
        approved: true,
      }, store.user.accessToken);
    } catch (error) {
      //handled in api service
    } finally {
      //reload pending articles after approval
      dispatch(getArticlesModeration(`/moderation/${status}`));
    }
  };
};

/**
 * approve article by mod
 */
export const approveArticle = (permlink, status) => {
  return async (dispatch, getState) => {
    const store = getState();

    try {
      //approve article with permalink and status
      await apiPost('/moderation/moderate', {
        permlink: permlink,
        approved: true,
      },store.user.accessToken);
    } catch (error) {
      //handled in api service
    } finally {
      //reload pending articles after approval
      dispatch(getArticlesModeration(`/moderation/${status}`));
    }
  };
};

/**
 * reject article by mod
 */
export const rejectArticle = (permlink, status) => {
  return async (dispatch, getState) => {
    const store = getState();

    try {
      //approve article with permalink and status
      await apiPost('/moderation/moderate', {
        permlink: permlink,
        approved: false,
      }, store.user.accessToken);
    } catch (error) {
      //handled in api service
    } finally {
      //reload pending articles after approval
      dispatch(getArticlesModeration(`/moderation/${status}`));
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

    try {
      return await SteemConnect.vote(store.user.username, author, permlink, weight);
    } catch (error) {
      message.error('error upvoting element');
    }
  };
};

/**
 * delete article or comment
 * @param permlink permalink of the article of comment
 */
export const deleteElement = (permlink) => {
  return async (dispatch, getState) => {
    const store = getState();

    try {
      //use broadcast operation to delete comment
      return await SteemConnect.broadcast([
        ['delete_comment', {
          'author': store.user.username,
          'permlink': permlink
        }]
      ]);
    } catch (error) {
      message.error('error deleting element');
    }
  };
};

/**
 * get articles by search term
 */
export const getArticlesBySearchTerm = (skip, searchterm) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      skip: skip || undefined,
      category: ''
    });

    //get articles by search term from server
    try {
      let response = await apiGet('/posts', {
        skip: skip || undefined, //skip elements for paging
        search: searchterm || undefined
      });
      dispatch({
        type: types.ARTICLES_GET_SEARCH,
        skip: skip || undefined,
        payload: response.data.results
      });
    } catch (error) {
      dispatch({
        type: types.ARTICLES_GET_SEARCH,
        payload: []
      });
    }
  };
};
