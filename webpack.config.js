const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: false,
            },
          },
          {
            loader: 'file-loader',
          },
        ]
      },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      }
    ]
  },
  mode: "development",
};
