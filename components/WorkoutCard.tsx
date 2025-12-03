import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface WorkoutCardProps {
  onStartWorkout?: () => void;
}

export function WorkoutCard({ onStartWorkout }: WorkoutCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol name="dumbbell.fill" size={28} color={AbalColors.primary} />
        </View>
        <View style={styles.textContent}>
          <ThemedText style={styles.title}>Ready to Train?</ThemedText>
          <ThemedText style={styles.subtitle}>Start tracking your workout</ThemedText>
        </View>
      </View>

      <Pressable
        onPress={onStartWorkout}
        style={({ pressed }) => [styles.startButton, pressed && styles.buttonPressed]}
      >
        <IconSymbol name="play.fill" size={18} color={AbalColors.textPrimary} />
        <ThemedText style={styles.startButtonText}>Start Workout</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    ...Shadows.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: `${AbalColors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AbalColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
