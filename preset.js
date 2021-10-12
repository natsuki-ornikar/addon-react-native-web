const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpackFinal: async (config) => {
    const cwd = process.cwd();

    config.resolve.alias = {
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development',
        ),
        __DEV__: process.env.NODE_ENV !== 'production' || true,
      }),
    );

    // fix for uncompiled react-native dependencies
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      loader: 'babel-loader',
      include: [
        path.resolve(cwd, 'node_modules/react-native-vector-icons'),
        path.resolve(cwd, 'node_modules/react-native-reanimated'),
      ],
      options: {
        presets: [
          '@babel/env',
          '@babel/preset-react',
          'module:metro-react-native-babel-preset',
        ],
        plugins: [
          'react-native-web',
          '@babel/plugin-proposal-class-properties',
          'react-native-reanimated/plugin',
        ],
      },
    });

    config.module.rules.push({
      test: /\.ttf$/,
      loader: 'url-loader',
      include: [
        path.resolve(
          cwd,
          'node_modules/react-native-vector-icons/MaterialCommunityIcons.js',
        ),
        path.resolve(
          cwd,
          'node_modules/react-native-vector-icons/MaterialIcons.js',
        ),
      ],
    });

    config.resolve.extensions = ['.web.js', ...config.resolve.extensions];

    return config;
  },
};
