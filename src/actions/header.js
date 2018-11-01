import {HEADER_VISIBILITY_SET} from './types';

export const toggleHeader = payload => {
  return {
    type: HEADER_VISIBILITY_SET,
    payload
  };
};