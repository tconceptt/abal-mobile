import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { Achievement } from '@/constants/mock-data';

interface AchievementBadgeProps {
  achievement: Achievement;
  onPress?: () => void;
}

function getIconColor(icon: Achievement['icon']): string {
  switch (icon) {
    case 'trophy.fill':
      return '#F59E0B';
    case 'star.fill':
      return '#6366F1';
    case 'flame.fill':
      return '#EF4444';
    case 'heart.fill':
      return '#EC4899';
    case 'dumbbell.fill':
      return '#10B981';
    default:
      return AbalColors.textSecondary;
  }
}

export function AchievementBadge({ achievement, onPress }: AchievementBadgeProps) {
  const iconColor = getIconColor(achievement.icon);
  const progressPercent = achievement.progress && achievement.target
    ? Math.round((achievement.progress / achievement.target) * 100)
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        achievement.locked && styles.containerLocked,
        pressed && styles.containerPressed,
      ]}
    >
      {/* Icon */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: achievement.locked ? AbalColors.divider : `${iconColor}15` }
      ]}>
        <IconSymbol
          name={achievement.icon as IconSymbolName}
          size={24}
          color={achievement.locked ? AbalColors.textMuted : iconColor}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={[
          styles.title,
          achievement.locked && styles.titleLocked,
        ]}>
          {achievement.title}
        </ThemedText>
        <ThemedText style={styles.description}>{achievement.description}</ThemedText>
        
        {/* Progress bar for locked achievements */}
        {achievement.locked && progressPercent !== null && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>
              {achievement.progress}/{achievement.target}
            </ThemedText>
          </View>
        )}

        {/* Unlocked date */}
        {!achievement.locked && achievement.unlockedAt && (
          <ThemedText style={styles.unlockedDate}>
            Unlocked {achievement.unlockedAt}
          </ThemedText>
        )}
      </View>

      {/* Locked indicator or check */}
      {achievement.locked ? (
        <IconSymbol name="lock.fill" size={16} color={AbalColors.textMuted} />
      ) : (
        <IconSymbol name="checkmark.circle.fill" size={20} color="#10B981" />
      )}
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
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  containerLocked: {
    opacity: 0.8,
  },
  containerPressed: {
    opacity: 0.9,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  titleLocked: {
    color: AbalColors.textSecondary,
  },
  description: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: AbalColors.divider,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AbalColors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: AbalColors.textMuted,
    fontWeight: '500',
  },
  unlockedDate: {
    fontSize: 11,
    color: '#10B981',
    marginTop: Spacing.xs,
  },
});



