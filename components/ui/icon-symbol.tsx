// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation icons
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.left': 'arrow-back',
  
  // Tab bar icons for ABAL
  'creditcard.fill': 'credit-card',
  'chart.bar.fill': 'bar-chart',
  'person.fill': 'person',
  'bubble.left.and.bubble.right.fill': 'forum',
  
  // Activity icons
  'checkmark.circle.fill': 'check-circle',
  'dumbbell.fill': 'fitness-center',
  'figure.walk': 'directions-walk',
  'heart.fill': 'favorite',
  'flame.fill': 'local-fire-department',
  'trophy.fill': 'emoji-events',
  'star.fill': 'star',
  'calendar': 'event',
  
  // Workout icons
  'play.fill': 'play-arrow',
  'stop.fill': 'stop',
  'pause.fill': 'pause',
  'timer': 'timer',
  'bolt.fill': 'bolt',
  'figure.run': 'directions-run',
  'figure.dance': 'sports-gymnastics',
  'figure.strengthtraining.traditional': 'fitness-center',
  'music.note': 'music-note',
  'waveform.path.ecg': 'monitor-heart',
  'figure.indoor.cycle': 'pedal-bike',
  
  // UI icons
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'gearshape.fill': 'settings',
  'arrow.right': 'arrow-forward',
  'plus': 'add',
  'xmark': 'close',
  'doc.text.fill': 'description',
  'lock.fill': 'lock',
  'questionmark.circle.fill': 'help',
  'rectangle.portrait.and.arrow.right': 'logout',
  'pencil': 'edit',
  'doc.on.clipboard': 'content-copy',
  'checkmark': 'check',
  'clock.fill': 'schedule',
  'person.2.fill': 'people',
  'photo.fill': 'photo',
  'hand.thumbsup.fill': 'thumb-up',
  'bubble.right.fill': 'chat-bubble',
  
  // Progress icons
  'scalemass.fill': 'monitor-weight',
  'shoe.fill': 'directions-walk',
  'drop.fill': 'water-drop',
  'bed.double.fill': 'bed',
  'arrow.up.right': 'trending-up',
  'arrow.down.right': 'trending-down',
  'equal': 'trending-flat',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

export type { IconSymbolName };
