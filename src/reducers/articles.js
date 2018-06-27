import {ARTICLES_REQUEST, ARTICLES_GET} from '../actions/types';

const initialState = {
  currentCategory: '',
  searchString: '',
  data: [],
  categories: [
    {key: 'vlog', name: 'VLog'},
    {key: 'graphics', name: 'Graphics'},
    {key: 'art', name: 'Art'},
    {key: 'knack', name: 'Knack'},
    {key: 'onealtruism', name: 'One Altruism'},
    {key: 'music', name: 'Music'},
    {key: 'humor', name: 'Joke/Humor'},
    {key: 'inspiring', name: 'Inspiring'},
    {key: 'visibility', name: 'Visibility'},
    {key: 'news', name: 'News'},
    {key: 'quotes', name: 'Quotes'},
    {key: 'techtrends', name: 'Tech Trends'},
    {key: 'blogposts', name: 'Blog Posts'}
  ]
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
      return state;
  }
};

export default articles;
