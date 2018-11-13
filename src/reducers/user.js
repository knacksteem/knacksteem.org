import {
  USER_AUTH,
  USER_GET,
  KNACKSTEEM_USER_GET,
  REMOTE_USER_GET,
  REMOTE_USER_FOLLOW_GET,
  USER_LOGOUT
} from '../actions/types';

const initialState = {
  username: '',
  userObject: {},
  knacksteemUserObject: {},
  remoteUserObject: {},
  remoteUserFollowObject: {
    follower_count: 0,
    following_count: 0
  },
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
    case REMOTE_USER_GET:
      return {
        ...state,
        remoteUserObject: action.remoteUserObject
      };
    case KNACKSTEEM_USER_GET:
      return {
        ...state,
        knacksteemUserObject: action.knacksteemUserObject
      };
    case REMOTE_USER_FOLLOW_GET:
      return {
        ...state,
        remoteUserFollowObject: action.remoteUserFollowObject
      };
    case USER_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default user;
