import HtmlWebpackPlugin from 'html-webpack-plugin';
import BrotliPlugin from 'brotli-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import paths from './paths';
import { Configuration } from 'webpack';

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

export default {
  entry: paths.appIndexFile,
  mode: isDevelopment ? 'development' : 'production',
  output: {
    filename: '[name].[contenthash:8].js',
    path: paths.distDir,
    publicPath: '/',
  },
  devtool: isDevelopment && 'eval-cheap-source-map',
  cache: isDevelopment && {
    type: 'memory',
  },
  devServer: {
    port: 80,
    host: '0.0.0.0',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: paths.distDir,
    stats: 'minimal',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.sass', '.js'],
    modules: [paths.appDir, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        include: paths.appDir,
        exclude: /\.test\.tsx?$/,
        options: { configFile: `${paths.configDir}/babel.config.json` },
      },
      {
        test: /\.txt$/i,
        use: {
          loader: 'raw-loader',
          options: {
            esModule: true,
          },
        },
      },
      {
        loader: 'file-loader',
        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.s(a|c)ss$/, /\.html$/, /\.json$/],
        options: {
          name: `$[name].[hash:8].[ext]`,
        },
      },
    ],
  },
  plugins: [
    isProduction &&
      new CompressionPlugin({
        algorithm: 'gzip',
        threshold: 10240,
        minRatio: 0.8,
      }),
    isProduction &&
      new BrotliPlugin({
        threshold: 10240,
        minRatio: 0.8,
      }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          [
            'imagemin-svgo',
            {
              plugins: [
                // SVGO options is here "https://github.com/svg/svgo#what-it-can-do"
                {
                  removeViewBox: false,
                  removeXMLNS: true,
                },
              ],
            },
          ],
        ],
      },
    }),
    new HtmlWebpackPlugin({
      template: paths.appIndexHtml,
    }),
  ].filter(Boolean),
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
} as Configuration;
