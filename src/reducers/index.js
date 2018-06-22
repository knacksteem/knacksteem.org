import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import articlesReducer from './articles';
import userReducer from './user';

export default combineReducers({
  routing: routerReducer,
  articles: articlesReducer,
  user: userReducer
});
