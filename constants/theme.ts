/**
 * ABAL App Theme
 * Colors, fonts, and design tokens for the ABAL fitness/membership app.
 */

import { Platform } from 'react-native';

// ABAL Brand Colors
export const AbalColors = {
  // Primary green (lime) - used for membership card, accents
  primary: '#B8E936',
  primaryDark: '#9BC72A',
  
  // Dark colors for text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  
  // Backgrounds
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // UI elements
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
  tabIconDefault: '#9CA3AF',
  tabIconSelected: '#1A1A1A',
};

// Shadow presets for cards
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
};

// Legacy Colors for themed components compatibility
const tintColorLight = AbalColors.textPrimary;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: AbalColors.textPrimary,
    background: AbalColors.background,
    tint: tintColorLight,
    icon: AbalColors.textSecondary,
    tabIconDefault: AbalColors.tabIconDefault,
    tabIconSelected: AbalColors.tabIconSelected,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius scale
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
