import {ARTICLES_REQUEST, ARTICLES_GET, ARTICLES_POSTING, ARTICLES_POSTED, CATEGORIES_GET, ARTICLES_GET_SEARCH} from '../actions/types';

const initialState = {
  isBusy: false,
  currentCategory: '',
  searchString: '',
  data: [],
  categories: [],
  type: ''
};

const articles = (state = initialState, action) => {
  switch (action.type) {
    case CATEGORIES_GET:
      return {
        ...state,
        categories: action.payload
      };
    case ARTICLES_REQUEST:
      return {
        ...state,
        isBusy: true,
        currentCategory: action.category,
        data: action.skip ? state.data : [] //if lazyloading detected, keep data
      };
    case ARTICLES_GET:
      return {
        ...state,
        isBusy: false,
        data: action.skip ? [...state.data, ...action.payload] : action.payload //if lazy loading, combine arrays
      };
    case ARTICLES_GET_SEARCH:
      return {
        ...state,
        isBusy: false,
        type: 'post',
        data: action.skip ? [...state.data, ...action.payload] : action.payload //if lazy loading, combine arrays
      };
    case ARTICLES_POSTING:
      return {
        ...state,
        isBusy: true
      };
    case ARTICLES_POSTED:
      return {
        ...state,
        isBusy: false
      };
    default:
      return state;
  }
};

export default articles;
