const path = require('path');
const webpack = require('webpack');
const ClosurePlugin = require('closure-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const config = require('./config.js');

module.exports = (env, argv) => {
  const mode = argv.mode || 'production';

  return {
    entry: path.join(__dirname, 'src/ui/PageExperience.js'),
    output: {
      filename: 'pixi.[name].[hash].js',
      chunkFilename: 'pixi.[name].[chunkhash].bundle.js',
      sourceMapFilename: 'pixi.[name].map',
      publicPath: '/static/page-experience/',
    },
    optimization: {
      minimizer: [new ClosurePlugin({mode: 'AGGRESSIVE_BUNDLE'}, {})],
      concatenateModules: false,
    },
    devtool: mode == 'development' ? 'cheap-module-source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/ui/page-experience.hbs'),
        filename: './pixi.html',
        inject: false,
      }),
      new webpack.DefinePlugin({
        IS_DEVELOPMENT: mode == 'development',
        API_ENDPOINT_LINTER: JSON.stringify(config[mode].API_ENDPOINT_LINTER),
        API_ENDPOINT_SAFE_BROWSING: JSON.stringify(
          config[mode].API_ENDPOINT_SAFE_BROWSING
        ),
        API_ENDPOINT_PAGE_SPEED_INSIGHTS: JSON.stringify(
          config[mode].API_ENDPOINT_PAGE_SPEED_INSIGHTS
        ),
        API_ENDPOINT_MOBILE_FRIENDLINESS: JSON.stringify(
          config[mode].API_ENDPOINT_MOBILE_FRIENDLINESS
        ),
        AMP_DEV_PIXI_APIS_KEY: JSON.stringify(
          process.env.AMP_DEV_PIXI_APIS || ''
        ),
      }),
      new FileManagerPlugin({
        onEnd: {
          copy: [
            {
              source: './dist/pixi.html',
              destination:
                '../frontend/templates/views/partials/pixi/webpack.j2',
            },
            {
              source: './dist/*.js',
              destination: '../dist/static/page-experience/',
            },
            {
              source: './dist/*.map',
              destination: '../dist/static/page-experience/',
            },
          ],
        },
      }),
      new CleanWebpackPlugin({
        dry: false,
        dangerouslyAllowCleanPatternsOutsideProject: true,
        cleanAfterEveryBuildPatterns: [
          path.join(process.cwd(), '../dist/static/page-experience'),
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
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
