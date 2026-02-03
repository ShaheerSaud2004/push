const { withEntitlementsPlist } = require('@expo/config-plugins');

module.exports = function withGameCenter(config) {
  return withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.developer.game-center'] = true;
    return config;
  });
};
