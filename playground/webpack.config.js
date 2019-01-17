const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';
  return {
    entry: './src/app.js',
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].bundle.js',
      sourceMapFilename: '[name].map',
      publicPath: '',
    },
    optimization: {
      minimizer: [
        new ClosurePlugin({mode: 'STANDARD'}, {}),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: {
        cacheGroups: {
          critical: {
            name: 'critical',
            test: /\.critical\.s?css$/,
            chunks: 'all',
            enforce: true,
          },
          main: {
            name: 'main',
            test: /^(?!.*\.critical).*\.s?css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new CopyWebpackPlugin([
        {from: 'static/'},
      ]),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: devMode ? '[id].css' : '[name].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.hbs',
        filename: './index.html',
        inlineSource: 'critical\..+$',
      }),
      new HtmlWebpackPlugin({
        template: './src/index.hbs',
        filename: './embed.html',
        inlineSource: 'critical\..+$',
        embed: true,
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: ['main'],
      }),
      new CleanWebpackPlugin(['dist']),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [{
            loader: 'babel-loader',
          }],
        },
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
        },
        {
          test: /\.(png|jpg|svg)$/,
          loader: 'url-loader',
        },
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', options: {sourceMap: true}},
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [path.join(__dirname, '../frontend/scss')],
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {minimize: false},
            },
          ],
        },
      ],
    },
  };
};
