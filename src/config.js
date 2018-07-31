//general configuration for the app
export default {
  SteemConnect: {
    scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment', 'comment_options', 'delete_comment'],
    callbackURL: `${window.location.origin}/callback`
  }
};
