import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementBadge } from '@/components/AchievementBadge';
import { StatCard } from '@/components/StatCard';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import {
  mockAchievements,
  mockProgressMetrics,
  mockStatsSummary,
  mockWorkoutHistory,
} from '@/constants/mock-data';

type TabType = 'overview' | 'achievements' | 'history';

const TABS: { key: TabType; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'history', label: 'History' },
];

// Simple line chart component
function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const normalizedData = data.map((value) => (value / max) * 100);

  return (
    <View style={chartStyles.container}>
      {normalizedData.map((height, index) => (
        <View
          key={index}
          style={[
            chartStyles.bar,
            {
              height: `${Math.max(height, 15)}%`,
              backgroundColor: color,
              opacity: 0.4 + (index / normalizedData.length) * 0.6,
            },
          ]}
        />
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 4,
    paddingHorizontal: Spacing.xs,
  },
  bar: {
    flex: 1,
    borderRadius: 3,
    minHeight: 8,
  },
});

function getWorkoutTypeColor(type: string): string {
  switch (type) {
    case 'strength':
      return '#6366F1';
    case 'cardio':
      return '#EF4444';
    case 'flexibility':
      return '#10B981';
    case 'mixed':
      return '#F59E0B';
    default:
      return AbalColors.textSecondary;
  }
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="dumbbell.fill"
          iconColor="#6366F1"
          label="Total Workouts"
          value={mockStatsSummary.totalWorkouts}
        />
        <StatCard
          icon="flame.fill"
          iconColor="#EF4444"
          label="Current Streak"
          value={mockStatsSummary.currentStreak}
          subtitle="days"
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="clock.fill"
          iconColor="#F59E0B"
          label="Hours Trained"
          value={mockStatsSummary.totalHours}
        />
        <StatCard
          icon="star.fill"
          iconColor="#10B981"
          label="This Month"
          value={mockStatsSummary.thisMonthWorkouts}
          subtitle="workouts"
        />
      </View>

      {/* Progress Charts */}
      <ThemedText style={styles.sectionTitle}>Your Progress</ThemedText>
      <View style={styles.chartsContainer}>
        {mockProgressMetrics.slice(0, 2).map((metric) => (
          <View key={metric.id} style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <ThemedText style={styles.chartTitle}>{metric.title}</ThemedText>
              <View style={styles.chartValue}>
                <ThemedText style={styles.chartValueText}>{metric.value}</ThemedText>
                <ThemedText style={styles.chartUnit}>{metric.unit}</ThemedText>
              </View>
            </View>
            <MiniLineChart data={metric.data} color={metric.color} />
          </View>
        ))}
      </View>

      {/* Recent Achievements Preview */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recent Achievements</ThemedText>
        <Pressable onPress={() => setActiveTab('achievements')} hitSlop={8}>
          <ThemedText style={styles.viewAllLink}>View All</ThemedText>
        </Pressable>
      </View>
      {mockAchievements
        .filter((a) => !a.locked)
        .slice(0, 2)
        .map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
    </>
  );

  const renderAchievements = () => (
    <>
      <ThemedText style={styles.sectionTitle}>Unlocked</ThemedText>
      {mockAchievements
        .filter((a) => !a.locked)
        .map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}

      <ThemedText style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>In Progress</ThemedText>
      {mockAchievements
        .filter((a) => a.locked)
        .map((achievement) => (
          <AchievementBadge key={achievement.id} achievement={achievement} />
        ))}
    </>
  );

  const renderHistory = () => (
    <>
      <ThemedText style={styles.sectionTitle}>Recent Workouts</ThemedText>
      {mockWorkoutHistory.map((workout) => (
        <View key={workout.id} style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={[
              styles.workoutTypeIndicator,
              { backgroundColor: getWorkoutTypeColor(workout.type) }
            ]} />
            <View style={styles.workoutInfo}>
              <ThemedText style={styles.workoutName}>{workout.name}</ThemedText>
              <ThemedText style={styles.workoutDate}>{workout.date}</ThemedText>
            </View>
          </View>
          <View style={styles.workoutStats}>
            <View style={styles.workoutStat}>
              <IconSymbol name="clock.fill" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.workoutStatText}>{workout.duration}</ThemedText>
            </View>
            <View style={styles.workoutStat}>
              <IconSymbol name="flame.fill" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.workoutStatText}>{workout.calories} cal</ThemedText>
            </View>
            <View style={styles.workoutStat}>
              <IconSymbol name="dumbbell.fill" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.workoutStatText}>{workout.exercises} exercises</ThemedText>
            </View>
          </View>
        </View>
      ))}
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Progress</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Track your fitness journey</ThemedText>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
          >
            <ThemedText style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'history' && renderHistory()}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbalColors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: AbalColors.textPrimary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  tabTextActive: {
    color: AbalColors.textPrimary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  chartsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chartCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.card,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  chartValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  chartValueText: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  chartUnit: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginLeft: 4,
  },
  workoutCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  workoutTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  workoutDate: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AbalColors.divider,
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutStatText: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
