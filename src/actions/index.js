import * as UserActions from './user';
import * as ArticlesActions from './articles';

export const ActionCreators = {
  ...UserActions,
  ...ArticlesActions
};
