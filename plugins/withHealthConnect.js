const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo config plugin to add Health Connect support for Android
 * 
 * This plugin adds the necessary permissions and intent filters for Health Connect
 */
const withHealthConnect = (config) => {
  return withAndroidManifest(config, async (mod) => {
    const manifest = mod.modResults.manifest;
    
    // Ensure uses-permission array exists
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }
    
    // Health Connect permissions to add
    const healthPermissions = [
      'android.permission.health.READ_STEPS',
      'android.permission.health.READ_TOTAL_CALORIES_BURNED',
      'android.permission.health.READ_ACTIVE_CALORIES_BURNED',
      'android.permission.health.READ_DISTANCE',
      'android.permission.health.READ_HEART_RATE',
      'android.permission.health.READ_EXERCISE',
    ];
    
    // Add permissions if they don't exist
    healthPermissions.forEach((permission) => {
      const exists = manifest['uses-permission'].some(
        (p) => p.$?.['android:name'] === permission
      );
      if (!exists) {
        manifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
      }
    });
    
    // Add queries for Health Connect app
    if (!manifest.queries) {
      manifest.queries = [];
    }
    
    // Check if Health Connect package query exists
    const healthConnectQueryExists = manifest.queries.some(
      (query) => query.package?.some?.(
        (pkg) => pkg.$?.['android:name'] === 'com.google.android.apps.healthdata'
      )
    );
    
    if (!healthConnectQueryExists) {
      manifest.queries.push({
        package: [
          {
            $: { 'android:name': 'com.google.android.apps.healthdata' },
          },
        ],
      });
    }
    
    // Add intent filter to MainActivity for Health Connect permissions
    const mainApplication = manifest.application?.[0];
    if (mainApplication?.activity) {
      const mainActivity = mainApplication.activity.find(
        (activity) => activity.$?.['android:name'] === '.MainActivity'
      );
      
      if (mainActivity) {
        if (!mainActivity['intent-filter']) {
          mainActivity['intent-filter'] = [];
        }
        
        // Add Health Connect permissions rationale intent filter
        const hasHealthIntentFilter = mainActivity['intent-filter'].some(
          (filter) => filter.action?.some(
            (action) => action.$?.['android:name'] === 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE'
          )
        );
        
        if (!hasHealthIntentFilter) {
          mainActivity['intent-filter'].push({
            action: [
              {
                $: { 'android:name': 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE' },
              },
            ],
          });
        }
      }
    }
    
    return mod;
  });
};

module.exports = withHealthConnect;
