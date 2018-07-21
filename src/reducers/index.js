import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import articlesReducer from './articles';
import userReducer from './user';
import statsReducer from './stats';

export default combineReducers({
  routing: routerReducer,
  articles: articlesReducer,
  user: userReducer,
  stats: statsReducer
});
