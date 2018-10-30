import {HEADER_VISIBILITY_SET} from '../actions/types';

const initialState = {
  isHeaderVisible: false
};

const header = (state = initialState, action) => {
  switch (action.type) {
        case HEADER_VISIBILITY_SET:
        return {
            ...state,
            isHeaderVisible: action.payload.isHeaderVisible
        }
        break;   
    }
  return state;
};

export default header;

