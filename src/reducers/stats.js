import {USERLIST_REQUEST, USERLIST_GET} from '../actions/types';

const initialState = {
  isBusy: false,
  users: []
};

const stats = (state = initialState, action) => {
  switch (action.type) {
    case USERLIST_REQUEST:
      return {
        ...state,
        isBusy: true,
        users: action.skip ? state.users : [] //if lazyloading detected, keep data
      };
    case USERLIST_GET:
      return {
        ...state,
        isBusy: false,
        users: action.skip ? [...state.users, ...action.payload] : action.payload //if lazy loading, combine arrays
      };
    default:
      return state;
  }
};

export default stats;
