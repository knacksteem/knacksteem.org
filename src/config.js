//general configuration for the app
export default {
  SteemConnect: {
    scope: ['login', 'custom_json', 'claim_reward_balance', 'vote', 'comment', 'comment_options', 'delete_comment'],
    callbackURL: `${window.location.origin}/callback`
  },
  apiURL: (process.env.NODE_ENV === 'development') ? `${window.location.protocol}//${window.location.hostname}:3030/v1` : `${window.location.protocol}//api.${window.location.hostname}/v1`,
  officialAccount: (process.env.NODE_ENV === 'development') ? 'knacksteemtest' : 'knacksteem.org',
  digitalOceanSpaces: 'https://knacsteem.sfo2.digitaloceanspaces.com/'
};
