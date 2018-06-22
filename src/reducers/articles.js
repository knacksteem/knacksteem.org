import {ARTICLES_REQUEST, ARTICLES_GET} from '../actions/types';

const initialState = {
  currentCategory: '',
  searchString: '',
  data: []
};

const articles = (state = initialState, action) => {
  switch (action.type) {
    case ARTICLES_REQUEST:
      return {
        ...state,
        currentCategory: action.category,
        data: []
      };
    case ARTICLES_GET:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state
  }
};

export default articles;
