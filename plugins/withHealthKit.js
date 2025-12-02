const { withEntitlementsPlist, withInfoPlist } = require('@expo/config-plugins');

/**
 * Expo config plugin to add HealthKit support for iOS
 */
const withHealthKit = (config) => {
  // Add HealthKit entitlements
  config = withEntitlementsPlist(config, (mod) => {
    mod.modResults['com.apple.developer.healthkit'] = true;
    mod.modResults['com.apple.developer.healthkit.access'] = [];
    return mod;
  });

  // Add Info.plist usage descriptions
  config = withInfoPlist(config, (mod) => {
    mod.modResults.NSHealthShareUsageDescription =
      'ABAL needs access to your health data to track your fitness progress, including steps, calories burned, and other metrics.';
    mod.modResults.NSHealthUpdateUsageDescription =
      'ABAL needs permission to save your workout data to the Health app.';
    
    // Add HealthKit to UIRequiredDeviceCapabilities (optional - only if you want to require HealthKit)
    // mod.modResults.UIRequiredDeviceCapabilities = [
    //   ...(mod.modResults.UIRequiredDeviceCapabilities || []),
    //   'healthkit'
    // ];
    
    return mod;
  });

  return config;
};

module.exports = withHealthKit;

