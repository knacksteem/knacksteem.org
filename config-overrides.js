const rewired = require('react-app-rewired');

module.exports = {
  webpack: function(config, env) {
    config = rewired.injectBabelPlugin('transform-class-properties', config);
    return config;
  },
  jest: function(config) {
    config.moduleFileExtensions = config.moduleFileExtensions.filter(x => x !== 'mjs');
    return config;
  },
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      let config = configFunction(proxy, allowedHost);
      config.watchOptions = {
        //poll: 3000, // If running the development server in a VM or container environment, uncomment this line to use active polling to see updated files
        ignored: ['./node_modules']
      };
      return config;
    };
  }
};
