const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const exclusionList = [
  /node_modules\/.*\/node_modules\/.*/,
  /\.git\/.*/,
  /android\/.*/,
  /ios\/.*/,
  /\.expo\/.*/,
];

config.resolver.blockList = exclusionList;
config.watchFolders = [__dirname];
config.maxWorkers = 2;
config.transformer.minifierConfig = { compress: {}, mangle: false };
config.watcher = { healthCheck: { enabled: false } };

module.exports = config;
