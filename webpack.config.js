const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const marked = require('marked')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// App directory
const appDirectory = fs.realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);
const pkg = require('./package.json')

const renderer = new marked.Renderer()
process.env.NODE_ENV = 'development';

module.exports = {
  target: 'web',
  entry: resolveAppPath('src'),
  devServer: {
    contentBase: resolveAppPath('public'),
    compress: true,
    hot: true,
    port: 3000,
    publicPath: '/',
  },
  performance: {
    hints: false,
  },
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    mainFields: ['esnext', 'browser', 'module', 'main'],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [/src/, /argos-(.*)\/esnext/, /@argos\/(.*)\/esnext/],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        include: [/src/, /argos-(.*)\/esnext/, /@argos\/(.*)\/esnext/],
        use: [
          {
            loader: ExtractCssChunksPlugin.loader,
          },
          {
            loader: 'string-replace-loader',
            options: {
              search: '../../../../node_modules/@jsluna/fonts/fonts',
              replace: '../node_modules/@jsluna/fonts/fonts',
              flags: 'g',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              pedantic: true,
              renderer,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [/src/, /argos-(.*)\/esnext/, /@argos\/(.*)\/esnext/],
        loader: 'svg-inline-loader',
        options: {
          removeSVGTagAttrs: false,
        },
      },
    ],
  },
  stats: { children: false },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolveAppPath('public/index.html'),
    }),
    new ProgressBarPlugin(),
    new DuplicatePackageCheckerPlugin({
      emitError: false,
      exclude(instance) {
        return instance.name === 'prop-types' || instance.name.startsWith('@sainsburys-tech/')
      },
    }),
    new webpack.BannerPlugin({
      banner: `[filebase] - Version: ${pkg.version} - ${new Date().toString()}\n`,
      entryOnly: true,
    }),
    new webpack.LoaderOptionsPlugin({
      options: { context: __dirname },
    }),
    new ExtractCssChunksPlugin({
      filename: 'bundle.css',
      chunkFilename: '[id].css',
    }),
  ],
}
