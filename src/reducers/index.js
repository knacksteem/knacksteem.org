import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import articlesReducer from './articles';

export default combineReducers({
  routing: routerReducer,
  articles: articlesReducer
});
