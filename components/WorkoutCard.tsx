import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface WorkoutCardProps {
  onStartWorkout?: () => void;
  onStopWorkout?: () => void;
}

export function WorkoutCard({ onStartWorkout, onStopWorkout }: WorkoutCardProps) {
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for active workout
  useEffect(() => {
    if (isWorkingOut) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isWorkingOut, pulseAnim]);

  // Timer for active workout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkingOut) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkingOut]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsWorkingOut(true);
    setElapsedSeconds(0);
    onStartWorkout?.();
  };

  const handleStopWorkout = () => {
    setIsWorkingOut(false);
    setElapsedSeconds(0);
    onStopWorkout?.();
  };

  if (isWorkingOut) {
    return (
      <Animated.View style={[styles.activeContainer, { transform: [{ scale: pulseAnim }] }]}>
        {/* Active workout header */}
        <View style={styles.activeHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <ThemedText style={styles.liveText}>LIVE WORKOUT</ThemedText>
          </View>
        </View>

        {/* Timer display */}
        <View style={styles.timerSection}>
          <IconSymbol name="timer" size={32} color={AbalColors.cardBackground} />
          <ThemedText style={styles.timerText}>{formatTime(elapsedSeconds)}</ThemedText>
        </View>

        {/* Workout stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <IconSymbol name="flame.fill" size={18} color={AbalColors.cardBackground} />
            <ThemedText style={styles.statValue}>
              {Math.floor(elapsedSeconds * 0.15)} cal
            </ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <IconSymbol name="heart.fill" size={18} color={AbalColors.cardBackground} />
            <ThemedText style={styles.statValue}>
              {120 + Math.floor(Math.random() * 30)} bpm
            </ThemedText>
          </View>
        </View>

        {/* Stop button */}
        <Pressable
          onPress={handleStopWorkout}
          style={({ pressed }) => [styles.stopButton, pressed && styles.buttonPressed]}
        >
          <IconSymbol name="stop.fill" size={20} color={AbalColors.error} />
          <ThemedText style={styles.stopButtonText}>End Workout</ThemedText>
        </Pressable>
      </Animated.View>
    );
  }

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
        onPress={handleStartWorkout}
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
  // Active workout styles
  activeContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    ...Shadows.cardLarge,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 1,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.md,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '300',
    color: AbalColors.cardBackground,
    fontVariant: ['tabular-nums'],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.cardBackground,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

