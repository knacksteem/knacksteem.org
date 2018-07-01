//general configuration for the app
export default {
  SteemConnect: {
    scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment'],
    callbackURL: (process.env.NODE_ENV === 'development') ? 'http://localhost:3000/callback' : 'https://knacksteem.org/callback'
  }
};
