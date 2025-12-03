import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { ThemedText } from '@/components/themed-text';
import { dummyFunctions, ProgressMetric } from '@/constants/mock-data';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface ProgressCardProps {
  metric: ProgressMetric;
  onPress?: (metricId: string) => void;
}

// Mini bar chart component using gifted-charts
function MiniChart({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;

  // Convert data to gifted-charts format
  const barData = data.map((value, index) => ({
    value,
    frontColor: color,
    opacity: 0.3 + (index / data.length) * 0.7,
  }));

  return (
    <View style={styles.chartContainer}>
      <BarChart
        data={barData}
        width={100}
        height={40}
        barWidth={8}
        spacing={4}
        barBorderRadius={2}
        noOfSections={3}
        hideRules
        hideYAxisText
        hideAxesAndRules
        isAnimated
        animationDuration={500}
        disablePress
      />
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
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
