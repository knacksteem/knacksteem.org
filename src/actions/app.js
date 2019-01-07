import {SIDEBAR_VISIBILITY_SET} from './types';

export const toggleSidebar = payload => {
  return {
    type: SIDEBAR_VISIBILITY_SET,
    payload
  };
};