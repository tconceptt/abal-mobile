# ABAL

A modern fitness and gym membership app built with Expo and React Native. Track your workouts, monitor health data, manage subscriptions, and achieve your fitness goals.

![Expo](https://img.shields.io/badge/Expo-54-blue?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)

## Features

- **Dashboard** — View membership status, today's workout, upcoming classes, and progress at a glance
- **Workout Tracking** — Start, stop, and log workout sessions
- **Progress Monitoring** — Track weight history with interactive charts, set goals, and celebrate achievements
- **Health Data Integration** — Sync steps and calories from Apple HealthKit (iOS)
- **Social Feed** — Community activity feed
- **Subscription Management** — View packages, manage payments, and renew memberships

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Expo](https://expo.dev) SDK 54 |
| UI | React Native 0.81.5, React 19 |
| Language | TypeScript |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing) |
| State | React Context, AsyncStorage |
| Charts | [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) |
| Icons | [Phosphor Icons](https://phosphoricons.com/), SF Symbols |
| Animations | React Native Reanimated, Gesture Handler |

## Project Structure

```
abal/
├── app/                      # Expo Router screens (file-based routing)
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── index.tsx         # Home screen
│   │   ├── workouts.tsx      # Workouts screen
│   │   ├── feed.tsx          # Social feed
│   │   ├── progress.tsx      # Progress tracking
│   │   └── profile.tsx       # User profile
│   ├── subscription/         # Subscription flow screens
│   └── _layout.tsx           # Root layout
├── components/               # Reusable UI components
├── constants/                # Theme, colors, mock data
├── context/                  # React Context providers
├── hooks/                    # Custom hooks (useHealthData, useWorkouts)
├── plugins/                  # Expo config plugins
│   ├── withHealthKit.js      # iOS HealthKit plugin
│   └── withHealthConnect.js  # Android Health Connect plugin
└── assets/                   # Images, icons, fonts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS: Xcode 15+ (for iOS development)
- Android: Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd abal

# Install dependencies
npm install
```

### Running the App

```bash
# Start the Expo development server
npm start

# Run on iOS simulator (requires Xcode)
npm run ios

# Run on Android emulator (requires Android Studio)
npm run android
```

> **Note:** This app uses native modules (HealthKit) and requires a development build. Expo Go will not work with health data features.

### Development Build

For full functionality including health data:

```bash
# Generate native projects
npm run prebuild

# Build and run on iOS
npm run ios

# Build and run on Android
npm run android
```

## Health Data Integration

ABAL integrates with native health platforms to sync fitness data. Currently, **iOS HealthKit** is fully implemented.

### iOS — Apple HealthKit

The app reads:
- **Step count** (daily totals)
- **Active energy burned** (calories)

#### Setup

1. **Expo Configuration** — HealthKit is already configured in `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSHealthShareUsageDescription": "ABAL needs access to your health data...",
        "NSHealthUpdateUsageDescription": "ABAL needs permission to save your workout data..."
      },
      "entitlements": {
        "com.apple.developer.healthkit": true,
        "com.apple.developer.healthkit.access": []
      }
    },
    "plugins": [
      ["@kingstinct/react-native-healthkit", {
        "NSHealthShareUsageDescription": "...",
        "NSHealthUpdateUsageDescription": "..."
      }]
    ]
  }
}
```

2. **Prebuild** — After modifying health permissions, regenerate native projects:

```bash
npm run prebuild:clean
```

3. **Run on Device** — HealthKit requires a physical device or iOS Simulator:

```bash
npm run ios
```

4. **Grant Permissions** — When prompted, allow the app to access Health data.

#### Usage

The `useHealthData` hook provides a cross-platform API:

```tsx
import { useHealthData } from '@/hooks/useHealthData';

function MyComponent() {
  const { 
    data,           // { steps, calories } with today & weekly data
    isLoading,
    isAuthorized,
    isAvailable,
    error,
    refreshData,
    requestPermission 
  } = useHealthData();

  return (
    <View>
      <Text>Steps today: {data.steps.today}</Text>
      <Text>Calories: {data.calories.today}</Text>
    </View>
  );
}
```

### Android — Health Connect

The app includes Android Health Connect configuration in `plugins/withHealthConnect.js` and the `useHealthData` hook has Android support implemented. However, **Android integration is not yet fully tested**.

Required permissions (configured in `app.json`):
- `android.permission.health.READ_STEPS`
- `android.permission.health.READ_TOTAL_CALORIES_BURNED`
- `android.permission.health.READ_ACTIVE_CALORIES_BURNED`
- `android.permission.health.READ_DISTANCE`
- `android.permission.health.READ_HEART_RATE`

To enable Health Connect:
1. Install [Health Connect](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata) on your device
2. Run `npm run prebuild:clean`
3. Build with `npm run android`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run start:dev` | Start with dev client |
| `npm run ios` | Build and run on iOS |
| `npm run android` | Build and run on Android |
| `npm run web` | Start for web |
| `npm run prebuild` | Generate native projects |
| `npm run prebuild:clean` | Clean and regenerate native projects |
| `npm run lint` | Run ESLint |

## Configuration Files

| File | Purpose |
|------|---------|
| `app.json` | Expo configuration, app metadata, plugins |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.js` | ESLint rules |
| `plugins/withHealthKit.js` | Custom Expo plugin for iOS HealthKit |
| `plugins/withHealthConnect.js` | Custom Expo plugin for Android Health Connect |

## Environment

This project uses Expo's New Architecture:
- React Compiler enabled
- Typed routes enabled
- Nitro modules for native bridging

## Troubleshooting

### HealthKit not working

1. Ensure you're running on a physical iOS device or simulator (not Expo Go)
2. Verify HealthKit is enabled in your Apple Developer account
3. Check that the app has been granted health permissions in Settings > Health > Data Access

### Prebuild issues

```bash
# Clean and regenerate
npm run prebuild:clean

# If still having issues, clear caches
rm -rf node_modules ios android
npm install
npm run prebuild
```

### Pod install failures (iOS)

```bash
cd ios
pod install --repo-update
cd ..
```

## License

Private project — All rights reserved.
