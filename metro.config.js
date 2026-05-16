const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [__dirname];
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/.*/,
  /\.git\/.*/,
];
config.watcher = {
  healthCheck: { enabled: false },
};

module.exports = config;
