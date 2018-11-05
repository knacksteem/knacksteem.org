import sc2 from 'sc2-sdk';
import Config from '../config';

/**
 * steem connect singleton
 */
const api = sc2.Initialize({
  baseURL: 'https://steemconnect.com',
  app: 'knacksteem.app',
  callbackURL: Config.SteemConnect.callbackURL,
  scope: Config.SteemConnect.scope
});
export default api;
