const config = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'main.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },
    ],
  },
};

module.exports = config;
