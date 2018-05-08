// 配置参考
// https://zhuanlan.zhihu.com/p/20782320?utm_source=tuicool&utm_medium=referral
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV;

// 路径设置
const paths = {
  context: __dirname,
  modules: path.resolve(__dirname, 'node_modules'),
  output: path.resolve(__dirname, './build'),
};

// 排除 node_modules 目录里的模块
let nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
      return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
      nodeModules[mod] = 'commonjs ' + mod;
  });

let configuration = {
  mode: 'development',
  entry: './index.js',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ],
  context: __dirname,
  target: 'node',
  node: {
      __filename: false,
      __dirname: false
  },
  externals: nodeModules,
  devtool: 'source-map',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
    // publicPath: process.env.NODE_ENV === 'production'
    //   ? config.build.assetsPublicPath
    //   : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
// 生成环境配置
if (process.env.NODE_ENV === 'production') {
  configuration.mode = 'production'
};

module.exports = configuration
