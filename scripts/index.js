/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ROOT = path.resolve(__dirname, '../');
const ENV = process.env.NODE_ENV;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const createCssLoaders = () => {
  return [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
    },
  ];
};

module.exports = {
  mode: ENV || 'production',
  devtool: ENV === 'development' ? 'source-map' : undefined,
  context: ROOT,
  entry: `${ROOT}/src/index.tsx`,
  output: {
    path: `${ROOT}/dist`,
    filename: '[name].[contenthash:8].js',
  },
  resolve: {
    extensions: ['.tsx', 'ts', '.js', '.json'],
    alias: {
      react: 'anujs/dist/ReactIE',
      'react-dom': 'anujs/dist/ReactIE',
      'prop-types': 'anujs/lib/ReactPropTypes',
      'create-react-class': 'anujs/lib/createClass',
      '@reach/router': `${ROOT}/patchs/Router`,
      redux: `${ROOT}/patchs/redux`,
      '@rematch/core': 'anujs/dist/Rematch',
      antd: `${ROOT}/patchs/antd`,
      '@': `${ROOT}/src`,
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  loose: true,
                  modules: 'commonjs',
                },
              ],
              '@babel/react',
              '@babel/typescript',
            ],
            plugins: [
              [
                '@babel/plugin-proposal-class-properties',
                {
                  loose: true,
                },
              ],
              ['@babel/plugin-syntax-dynamic-import'],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: createCssLoaders(),
      },
      {
        test: /\.less$/,
        use: [
          ...createCssLoaders(),
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  '@primary-color': '#3154EF',
                },
                javascriptEnabled: true,
                modules: true,
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          ie8: true,
        },
      }),
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: ROOT,
      manifest: `${ROOT}/src/base.manifest.json`,
    }),
    new HtmlWebpackPlugin({
      template: `${ROOT}/src/index.html`,
    }),
    new CopyWebpackPlugin(
      [
        {
          context: ROOT,
          from: 'public',
          to: 'static',
        },
      ],
      {}
    ),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
    // didn't work on IE8
    contentBase: `${ROOT}/dist`,
  },
};
