const rewired = require('react-app-rewired')

function rewireSass(config) {
  const cssLoader = rewired.getLoader(
    config.module.rules,
    rule => rule.test && String(rule.test) === String(/\.css$/)
  )

  const sassLoader = {
    test: /\.scss$/,
    use: [...(cssLoader.loader || cssLoader.use), 'sass-loader']
  }

  const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf
  oneOf.unshift(sassLoader)

  return config
}

module.exports = {
  webpack: function(config, env) {
    config = rewireSass(config, env)
    config = rewired.injectBabelPlugin('transform-class-properties', config);
    return config
  },
  jest: function(config) {
    config.moduleFileExtensions = config.moduleFileExtensions.filter(x => x !== 'mjs')
    return config
  }
}
