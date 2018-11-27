import {SIDEBAR_VISIBILITY_SET} from '../actions/types';

const initialState = {
  isSidebarVisible: true,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case SIDEBAR_VISIBILITY_SET:
      return {
        ...state,
        isSidebarVisible: action.payload.isSidebarVisible
      };  
    default:
      return state;
  }  
};

export default app;

