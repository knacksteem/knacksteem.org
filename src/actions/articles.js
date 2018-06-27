import * as types from './types';
import {userLogout} from './user';
import sc2 from 'sc2-sdk';

/**
 * get articles by category from backend
 */
export const getArticlesByCategory = (category) => {
  return async (dispatch) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      category: category
    });

    //TODO get this from server
    const data = [];
    for (let i = 1; i <= 20; i++) {
      data.push({
        title: `Article ${i} for Category "${category || 'all'}"`,
        description: 'Ask for petting sleep, paw at your fat belly and eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap so somehow manage to catch a bird but have no idea what to do next, so play with it until it dies of shock, so while happily ignoring when being called need to chase tail. Curl up and sleep on the freshly laundered towels drool. Allways wanting food howl uncontrollably for no reason for pushes butt to face stinky cat and lick the plastic bag hopped up on catnip weigh eight pounds but take up a full-size bed. Spend six hours per day washing, but still have a crusty butthole trip on catnip or eat half my food and ask for more, stand with legs in litter box, but poop outside. Meow meow, i tell my human please stop looking at your phone and pet me, hate dog, and sniff all the things.'
      });
    }

    dispatch({
      type: types.ARTICLES_GET,
      payload: data
    });
  };
};

/**
 * get articles by user from backend
 */
export const getArticlesByUser = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.ARTICLES_REQUEST,
      category: ''
    });

    const store = getState();

    //TODO get this from server
    const data = [];
    for (let i = 1; i <= 3; i++) {
      data.push({
        title: `Article for user ${store.user.username}`,
        description: 'Ask for petting sleep, paw at your fat belly and eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap so somehow manage to catch a bird but have no idea what to do next, so play with it until it dies of shock, so while happily ignoring when being called need to chase tail. Curl up and sleep on the freshly laundered towels drool. Allways wanting food howl uncontrollably for no reason for pushes butt to face stinky cat and lick the plastic bag hopped up on catnip weigh eight pounds but take up a full-size bed. Spend six hours per day washing, but still have a crusty butthole trip on catnip or eat half my food and ask for more, stand with legs in litter box, but poop outside. Meow meow, i tell my human please stop looking at your phone and pet me, hate dog, and sniff all the things.'
      });
    }

    dispatch({
      type: types.ARTICLES_GET,
      payload: data
    });
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
      callbackURL: 'http://localhost:3000/callback',
      accessToken: store.user.accessToken,
      scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment']
    });

    try {
      let response = await api.comment('', tags[0], store.user.username, tags[0], title, body, {tags: tags.join(' ')});
      console.log(response);
      //TODO successfully posted to blockchain, now posting to backend with permalink and category
    } catch (error) {
      //invalidate login
      dispatch(userLogout());
    } finally {
      dispatch({
        type: types.ARTICLES_POSTED
      });
    }
  };
};