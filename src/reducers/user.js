import {USER_AUTH, USER_GET, USER_LOGOUT} from '../actions/types';

const initialState = {
  username: '',
  userObject: {},
  accessToken: ''
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_AUTH:
      return {
        ...state,
        username: '',
        accessToken: '',
        userObject: {}
      };
    case USER_GET:
      return {
        ...state,
        username: action.username,
        userObject: action.userObject,
        accessToken: action.accessToken
      };
    case USER_LOGOUT:
      return {
        ...state,
        username: '',
        accessToken: '',
        userObject: {}
      };
    default:
      return state;
  }
};

export default user;
