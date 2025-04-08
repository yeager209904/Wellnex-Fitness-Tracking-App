const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .cjs files
config.resolver.assetExts.push("cjs");
// config.resolver.assetExts.push('env');
// Add proxy to bypass CORS issues
config.server = {
  ...config.server,
  proxy: {
    '/v1': {
      target: 'https://your-appwrite-instance/v1', // Replace with Appwrite URL
      changeOrigin: true,
      secure: false,
    },
  },
};

// Include NativeWind configuration
module.exports = withNativeWind(config, { input: './app/global.css' });
