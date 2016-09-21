const config = {
  entry: './src/main.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },
    ],
  },
};

module.exports = config;
