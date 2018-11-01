import {
  USERLIST_REQUEST,
  USERLIST_GET,
  STEEM_REWARD_FUND_GET,
  CURRENT_MEDIAN_HISTORY_PRICE_GET,
  DYNAMIC_GLOBAL_PROPERTIES_GET
} from '../actions/types';

const initialState = {
  isBusy: false,
  users: [],
  rewardFundObject: {},
  dynamicGlobalPropertiesObject: {},
  currentMedianHistoryPriceObject: {}
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
    case STEEM_REWARD_FUND_GET:
      return {
        ...state,
        rewardFundObject: action.rewardFundObject
      };
    case CURRENT_MEDIAN_HISTORY_PRICE_GET:
      return {
        ...state,
        currentMedianHistoryPriceObject: action.currentMedianHistoryPriceObject
      };
    case DYNAMIC_GLOBAL_PROPERTIES_GET:
      return {
        ...state,
        dynamicGlobalPropertiesObject: action.dynamicGlobalPropertiesObject
      };
    default:
      return state;
  }
};

export default stats;
