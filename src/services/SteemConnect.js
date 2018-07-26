import sc2 from 'sc2-sdk';
import Config from '../config';

const api = sc2.Initialize({
  app: 'knacksteem.app',
  callbackURL: Config.SteemConnect.callbackURL,
  scope: Config.SteemConnect.scope
});

export default api;
