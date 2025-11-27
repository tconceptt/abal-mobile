import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { dummyFunctions, ProgressMetric } from '@/constants/mock-data';

interface ProgressCardProps {
  metric: ProgressMetric;
  onPress?: (metricId: string) => void;
}

// Simple mini bar chart component using Views
function MiniChart({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;

  // Normalize data to fit within the chart
  const max = Math.max(...data);
  const normalizedData = data.map((value) => (value / max) * 100);

  return (
    <View style={styles.chartContainer}>
      {normalizedData.map((height, index) => (
        <View
          key={index}
          style={[
            styles.chartBar,
            {
              height: `${Math.max(height, 10)}%`,
              backgroundColor: color,
              opacity: 0.3 + (index / normalizedData.length) * 0.7,
            },
          ]}
        />
      ))}
    </View>
  );
}

export function ProgressCard({
  metric,
  onPress = dummyFunctions.onProgressCardPress,
}: ProgressCardProps) {
  return (
    <Pressable
      onPress={() => onPress(metric.id)}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      {/* Title */}
      <ThemedText style={styles.title}>{metric.title}</ThemedText>

      {/* Mini chart */}
      <MiniChart data={metric.data} color={metric.color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    width: 130,
    ...Shadows.card,
  },
  containerPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 4,
  },
  chartBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 4,
  },
});
