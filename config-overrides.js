const path = require('path');

module.exports = function override(config, env) {
  const loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
  const index = loaders.length - 2;
  loaders.splice(index, 0, {
    test: /\.(frag|vert|fragment|vertex|shader|glsl)$/,
    use:[{
      loader: path.resolve(__dirname,'./src/loaders/shader-loader/index.js'),
      options:{
        publicPath:'./src/shaderchunk',
      }
    }]
  })

  return config;
}