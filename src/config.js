//general configuration for the app
export default {
  SteemConnect: {
    scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment', 'delete_comment'],
    callbackURL: `${window.location.origin}/callback`
  },
  GeneralError: 'error occured, please contact an admin or try again later'
};
