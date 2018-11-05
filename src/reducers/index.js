import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import articlesReducer from './articles';
import headerReducer from './header';
import userReducer from './user';
import statsReducer from './stats';

export default combineReducers({
  routing: routerReducer,
  articles: articlesReducer,
  header: headerReducer,
  user: userReducer,
  stats: statsReducer
});
