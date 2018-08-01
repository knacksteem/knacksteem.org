//general configuration for the app
export default {
  SteemConnect: {
    scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment', 'delete_comment'],
    callbackURL: `${window.location.origin}/callback`
  },
  apiURL: (process.env.NODE_ENV === 'development') ? `${window.location.protocol}//${window.location.hostname}:3030/v1` : `${window.location.protocol}//api.${window.location.hostname}/v1`
};
