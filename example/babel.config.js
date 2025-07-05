const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

// eslint-disable-next-line no-undef
const root = path.resolve(__dirname, '..');

module.exports = function (api) {
  api.cache(true);

  return getConfig(
    {
      presets: [['babel-preset-expo']],
    },
    { root, pkg }
  );
};
