import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { Activity, dummyFunctions } from '@/constants/mock-data';

interface ActivityItemProps {
  activity: Activity;
  onPress?: (activityId: string) => void;
}

export function ActivityItem({
  activity,
  onPress = dummyFunctions.onActivityPress,
}: ActivityItemProps) {
  const getIconColor = () => {
    switch (activity.type) {
      case 'gym_checkin':
        return AbalColors.primary;
      case 'workout':
        return '#6366F1'; // Indigo
      case 'class':
        return '#F59E0B'; // Amber
      case 'milestone':
        return '#EF4444'; // Red
      default:
        return AbalColors.textSecondary;
    }
  };

  return (
    <Pressable
      onPress={() => onPress(activity.id)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}15` }]}>
        <IconSymbol
          name={activity.icon as IconSymbolName}
          size={20}
          color={getIconColor()}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={styles.title}>{activity.title}</ThemedText>
        <ThemedText style={styles.timestamp}>{activity.timestamp}</ThemedText>
      </View>

      {/* Chevron */}
      <IconSymbol
        name="chevron.right"
        size={18}
        color={AbalColors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  containerPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
});

