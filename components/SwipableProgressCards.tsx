import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useHealthData } from '@/hooks/useHealthData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - Spacing.md * 2;

export interface ProgressMetricData {
  id: string;
  title: string;
  value: number;
  unit: string;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: IconSymbolName;
  color: string;
  chartData: number[];
  subtitle?: string;
  isLoading?: boolean;
  error?: string | null;
}

// Static metrics that don't come from health data
const staticProgressMetrics: ProgressMetricData[] = [
  {
    id: 'weight',
    title: 'Weight',
    value: 72.5,
    unit: 'kg',
    target: 70,
    trend: 'down',
    trendValue: '-0.5 kg this week',
    icon: 'scalemass.fill',
    color: '#6366F1',
    chartData: [75, 74.5, 74, 73.5, 73, 72.8, 72.5],
    subtitle: 'Last updated today',
  },
  {
    id: 'water',
    title: 'Water Intake',
    value: 6,
    unit: 'glasses',
    target: 8,
    trend: 'stable',
    trendValue: 'On track',
    icon: 'drop.fill',
    color: '#3B82F6',
    chartData: [5, 7, 6, 8, 7, 6, 6],
    subtitle: 'Goal: 8 glasses',
  },
  {
    id: 'sleep',
    title: 'Sleep Duration',
    value: 7.2,
    unit: 'hours',
    target: 8,
    trend: 'up',
    trendValue: '+0.5 hr avg',
    icon: 'bed.double.fill',
    color: '#8B5CF6',
    chartData: [6.5, 7, 6.8, 7.5, 7.2, 7, 7.2],
    subtitle: 'Last night',
  },
];

// Helper to calculate trend from weekly data
function calculateTrend(data: number[]): { trend: 'up' | 'down' | 'stable'; trendValue: string } {
  if (data.length < 2) {
    return { trend: 'stable', trendValue: 'No data' };
  }

  const lastWeekAvg = data.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const thisWeekAvg = data.slice(4).reduce((a, b) => a + b, 0) / 3;

  if (lastWeekAvg === 0) {
    return { trend: 'stable', trendValue: 'Getting started' };
  }

  const percentChange = ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100;

  if (percentChange > 5) {
    return { trend: 'up', trendValue: `+${Math.round(percentChange)}% this week` };
  } else if (percentChange < -5) {
    return { trend: 'down', trendValue: `${Math.round(percentChange)}% this week` };
  } else {
    return { trend: 'stable', trendValue: 'Consistent' };
  }
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <View style={styles.chartContainer}>
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100;
        const isLast = index === data.length - 1;
        return (
          <View
            key={index}
            style={[
              styles.chartBar,
              {
                height: `${Math.max(height, 15)}%`,
                backgroundColor: isLast ? color : `${color}40`,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function ProgressCard({ metric, onPress }: { metric: ProgressMetricData; onPress?: () => void }) {
  const getTrendIcon = (): IconSymbolName => {
    switch (metric.trend) {
      case 'up':
        return 'arrow.up.right';
      case 'down':
        return 'arrow.down.right';
      default:
        return 'equal';
    }
  };

  const getTrendColor = () => {
    if (metric.id === 'weight') {
      // For weight, down is good
      return metric.trend === 'down' ? AbalColors.success : AbalColors.error;
    }
    return metric.trend === 'up'
      ? AbalColors.success
      : metric.trend === 'down'
        ? AbalColors.error
        : AbalColors.textSecondary;
  };

  // Show loading state for health data metrics
  if (metric.isLoading) {
    return (
      <View style={[styles.card, styles.cardLoading]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
            <IconSymbol name={metric.icon} size={24} color={metric.color} />
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.cardTitle}>{metric.title}</ThemedText>
            <ThemedText style={styles.cardSubtitle}>Loading from Health...</ThemedText>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={metric.color} />
          <ThemedText style={styles.loadingText}>Syncing health data</ThemedText>
        </View>
      </View>
    );
  }

  // Show error state
  if (metric.error) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
            <IconSymbol name={metric.icon} size={24} color={metric.color} />
          </View>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.cardTitle}>{metric.title}</ThemedText>
            <ThemedText style={[styles.cardSubtitle, { color: AbalColors.error }]}>
              Tap to connect
            </ThemedText>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" size={32} color={AbalColors.warning} />
          <ThemedText style={styles.errorText}>{metric.error}</ThemedText>
          <View style={styles.connectButton}>
            <ThemedText style={styles.connectButtonText}>Grant Permission</ThemedText>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${metric.color}15` }]}>
          <IconSymbol name={metric.icon} size={24} color={metric.color} />
        </View>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.cardTitle}>{metric.title}</ThemedText>
          {metric.subtitle && (
            <ThemedText style={styles.cardSubtitle}>{metric.subtitle}</ThemedText>
          )}
        </View>
        {/* Health badge for synced data */}
        {(metric.id === 'steps' || metric.id === 'calories') && !metric.error && (
          <View style={styles.healthBadge}>
            <IconSymbol name="heart.fill" size={12} color="#FF2D55" />
          </View>
        )}
      </View>

      {/* Value Section */}
      <View style={styles.valueSection}>
        <View style={styles.mainValue}>
          <ThemedText style={[styles.value, { color: metric.color }]}>
            {metric.value.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.unit}>{metric.unit}</ThemedText>
        </View>
        {metric.target && (
          <View style={styles.targetContainer}>
            <View
              style={[styles.progressBar, { backgroundColor: `${metric.color}20` }]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    backgroundColor: metric.color,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.targetText}>
              {Math.round((metric.value / metric.target) * 100)}% of {metric.target.toLocaleString()}{' '}
              {metric.unit}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Chart */}
      <MiniChart data={metric.chartData} color={metric.color} />

      {/* Trend indicator */}
      <View style={styles.trendContainer}>
        <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}15` }]}>
          <IconSymbol name={getTrendIcon()} size={14} color={getTrendColor()} />
          <ThemedText style={[styles.trendText, { color: getTrendColor() }]}>
            {metric.trendValue}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

interface SwipableProgressCardsProps {
  onViewAll?: () => void;
}

export function SwipableProgressCards({ onViewAll }: SwipableProgressCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Get health data from the hook
  const { data: healthData, isLoading, error, isAuthorized, requestPermission } = useHealthData();

  // Build the progress metrics array with real health data
  const progressMetrics = useMemo((): ProgressMetricData[] => {
    const stepsTrend = calculateTrend(healthData.steps.weeklyData);
    const caloriesTrend = calculateTrend(healthData.calories.weeklyData);

    const stepsMetric: ProgressMetricData = {
      id: 'steps',
      title: 'Daily Steps',
      value: healthData.steps.today,
      unit: 'steps',
      target: 10000,
      trend: stepsTrend.trend,
      trendValue: stepsTrend.trendValue,
      icon: 'figure.walk',
      color: '#10B981',
      chartData: healthData.steps.weeklyData,
      subtitle: healthData.steps.lastUpdated 
        ? `Updated ${formatTimeAgo(healthData.steps.lastUpdated)}`
        : 'Synced from Health',
      isLoading: isLoading,
      error: !isAuthorized && !isLoading ? error : null,
    };

    const caloriesMetric: ProgressMetricData = {
      id: 'calories',
      title: 'Calories Burned',
      value: healthData.calories.today,
      unit: 'kcal',
      target: 2500,
      trend: caloriesTrend.trend,
      trendValue: caloriesTrend.trendValue,
      icon: 'flame.fill',
      color: '#F59E0B',
      chartData: healthData.calories.weeklyData,
      subtitle: healthData.calories.lastUpdated 
        ? `Updated ${formatTimeAgo(healthData.calories.lastUpdated)}`
        : 'Active burn today',
      isLoading: isLoading,
      error: !isAuthorized && !isLoading ? error : null,
    };

    // Order: Steps, Calories, Weight, Water, Sleep
    return [stepsMetric, caloriesMetric, ...staticProgressMetrics];
  }, [healthData, isLoading, error, isAuthorized]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  };

  const handleCardPress = (metric: ProgressMetricData) => {
    // If the card has an error (permission issue), request permission
    if (metric.error && (metric.id === 'steps' || metric.id === 'calories')) {
      requestPermission();
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>My Progress</ThemedText>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <ThemedText style={styles.viewAllLink}>View All</ThemedText>
        </Pressable>
      </View>

      {/* Swipable Cards */}
      <FlatList
        ref={flatListRef}
        data={progressMetrics}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.cardsContainer}
        renderItem={({ item }) => (
          <ProgressCard 
            metric={item} 
            onPress={() => handleCardPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {progressMetrics.map((_, index) => (
          <Pressable key={index} onPress={() => scrollToIndex(index)} hitSlop={8}>
            <Animated.View
              style={[
                styles.paginationDot,
                activeIndex === index && styles.paginationDotActive,
              ]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  viewAllLink: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  cardsContainer: {
    paddingHorizontal: Spacing.md,
  },
  card: {
    width: CARD_WIDTH - Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    ...Shadows.card,
  },
  cardLoading: {
    minHeight: 280,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  healthBadge: {
    backgroundColor: '#FF2D5510',
    borderRadius: BorderRadius.full,
    padding: 6,
  },
  valueSection: {
    marginBottom: Spacing.md,
  },
  mainValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    marginRight: 6,
  },
  unit: {
    fontSize: 16,
    lineHeight: 22,
    color: AbalColors.textSecondary,
    fontWeight: '500',
  },
  targetContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  targetText: {
    fontSize: 12,
    lineHeight: 16,
    color: AbalColors.textSecondary,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    gap: 4,
    marginBottom: Spacing.md,
  },
  chartBar: {
    flex: 1,
    borderRadius: 3,
    minHeight: 8,
  },
  trendContainer: {
    flexDirection: 'row',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  trendText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AbalColors.border,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: AbalColors.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  connectButton: {
    backgroundColor: AbalColors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
