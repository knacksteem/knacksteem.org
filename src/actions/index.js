import * as UserActions from './user';
import * as ArticlesActions from './articles';
import * as types from './types';

export const ActionCreators = {
  ...UserActions,
  ...ArticlesActions
};
