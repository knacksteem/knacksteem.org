import {USER_AUTH, USER_GET, USER_LOGOUT} from '../actions/types';

const initialState = {
  username: '',
  userObject: {},
  userObjectSteemit: {},
  accessToken: '',
  isContributor: false,
  isModerator: false,
  isSupervisor: false
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_AUTH:
      return initialState;
    case USER_GET:
      return {
        ...state,
        username: action.username,
        userObject: action.userObject,
        userObjectSteemit: action.userObjectSteemit,
        accessToken: action.accessToken,
        isContributor: action.userObject.roles && action.userObject.roles.indexOf('contributor') !== -1,
        isModerator: action.userObject.roles && action.userObject.roles.indexOf('moderator') !== -1,
        isSupervisor: action.userObject.roles && action.userObject.roles.indexOf('supervisor') !== -1
      };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default user;
