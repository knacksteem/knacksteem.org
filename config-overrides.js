const rewired = require('react-app-rewired');

module.exports = {
  webpack: function(config, env) {
    config = rewired.injectBabelPlugin('transform-class-properties', config);
    return config;
  },
  jest: function(config) {
    config.moduleFileExtensions = config.moduleFileExtensions.filter(x => x !== 'mjs');
    return config;
  }
};
