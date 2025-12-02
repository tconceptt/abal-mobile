import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementBadge } from '@/components/AchievementBadge';
import { AddWeightModal } from '@/components/AddWeightModal';
import { GoalAchievedModal } from '@/components/GoalAchievedModal';
import { GoalSettingModal } from '@/components/GoalSettingModal';
import { StatCard } from '@/components/StatCard';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeightChart } from '@/components/WeightChart';
import {
  mockAchievements,
  mockStatsSummary,
  mockWorkoutHistory,
} from '@/constants/mock-data';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useUser, WeightEntry } from '@/context/UserContext';

type TabType = 'overview' | 'achievements' | 'history';
type TimeRange = 'week' | 'month' | 'year';

const TABS: { key: TabType; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'history', label: 'History' },
];

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

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

// Helper functions for data aggregation
function getWeekNumber(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();
  return Math.ceil((dayOfMonth + firstDayWeekday) / 7);
}

function aggregateByWeek(entries: WeightEntry[]): { value: number; label: string }[] {
  // Get entries from the last 30 days and group by week
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentEntries = entries.filter(e => new Date(e.date) >= thirtyDaysAgo);

  // Group by week number
  const weekGroups: { [key: string]: number[] } = {};

  recentEntries.forEach(entry => {
    const date = new Date(entry.date);
    const weekNum = getWeekNumber(date);
    const key = `Week ${weekNum}`;

    if (!weekGroups[key]) {
      weekGroups[key] = [];
    }
    weekGroups[key].push(entry.weight);
  });

  // Calculate averages and sort by week number
  return Object.entries(weekGroups)
    .sort((a, b) => {
      const weekA = parseInt(a[0].replace('Week ', ''));
      const weekB = parseInt(b[0].replace('Week ', ''));
      return weekA - weekB;
    })
    .map(([label, weights]) => ({
      label,
      value: weights.reduce((a, b) => a + b, 0) / weights.length,
    }));
}

function aggregateByMonth(entries: WeightEntry[]): { value: number; label: string }[] {
  // Get entries from the last year and group by month
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  const recentEntries = entries.filter(e => new Date(e.date) >= oneYearAgo);

  // Group by month
  const monthGroups: { [key: string]: { weights: number[]; date: Date } } = {};

  recentEntries.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short' });

    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = { weights: [], date };
    }
    monthGroups[monthKey].weights.push(entry.weight);
  });

  // Calculate averages and sort by date
  return Object.entries(monthGroups)
    .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
    .map(([_, data]) => ({
      label: data.date.toLocaleDateString('en-US', { month: 'short' }),
      value: data.weights.reduce((a, b) => a + b, 0) / data.weights.length,
    }));
}

function getWeekData(entries: WeightEntry[]): { value: number; label: string }[] {
  // Get entries from the last 7 days
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return entries
    .filter(e => new Date(e.date) >= sevenDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      value: entry.weight,
      label: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const { weightHistory, goalWeight, startWeight, latestWeight, addWeightEntry, setGoalWeight } = useUser();

  // Track if goal was achieved to show celebration
  const previousLatestWeight = useRef<number | null>(null);

  useEffect(() => {
    if (goalWeight && latestWeight && previousLatestWeight.current !== null) {
      const wasGoalAchieved = checkGoalAchieved(latestWeight, goalWeight, startWeight);
      const wasNotAchievedBefore = !checkGoalAchieved(previousLatestWeight.current, goalWeight, startWeight);

      if (wasGoalAchieved && wasNotAchievedBefore) {
        setCelebrationVisible(true);
      }
    }
    previousLatestWeight.current = latestWeight;
  }, [latestWeight, goalWeight, startWeight]);

  const checkGoalAchieved = (current: number | null, goal: number | null, start: number | null) => {
    if (!current || !goal || !start) return false;
    const isLosing = start > goal;
    if (isLosing) {
      return current <= goal;
    } else {
      return current >= goal;
    }
  };

  const isGoalAchieved = checkGoalAchieved(latestWeight, goalWeight, startWeight);

  // Prepare Chart Data based on time range
  const chartData = useMemo(() => {
    if (weightHistory.length === 0) return [];

    // Sort by date ascending first
    const sortedHistory = [...weightHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    switch (timeRange) {
      case 'week':
        return getWeekData(sortedHistory);
      case 'month':
        return aggregateByWeek(sortedHistory);
      case 'year':
        return aggregateByMonth(sortedHistory);
      default:
        return sortedHistory.map(entry => ({
          value: entry.weight,
          label: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }));
    }
  }, [weightHistory, timeRange]);

  // Calculate Progress
  const calculateProgress = () => {
    if (!startWeight || !latestWeight || !goalWeight) return 0;
    const totalChange = Math.abs(startWeight - goalWeight);
    const currentChange = Math.abs(startWeight - latestWeight);

    // Check if moving in right direction
    const isLosing = startWeight > goalWeight;
    const isActuallyLosing = latestWeight < startWeight;

    if (isLosing !== isActuallyLosing) return 0; // Moving in wrong direction

    return Math.min(Math.max((currentChange / totalChange) * 100, 0), 100);
  };

  const progressPercentage = calculateProgress();
  const remaining = goalWeight && latestWeight ? Math.abs(latestWeight - goalWeight).toFixed(1) : 0;

  const renderOverview = () => (
    <>
      {/* Weight Progress Section */}
      <View style={styles.weightSection}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Weight Progress</ThemedText>
          <Pressable
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <ThemedText style={styles.addButtonText}>Add Entry</ThemedText>
          </Pressable>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {TIME_RANGES.map((range) => (
            <Pressable
              key={range.key}
              style={[
                styles.timeRangeButton,
                timeRange === range.key && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range.key)}
            >
              <ThemedText
                style={[
                  styles.timeRangeText,
                  timeRange === range.key && styles.timeRangeTextActive,
                ]}
              >
                {range.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {chartData.length > 1 ? (
          <View style={styles.chartContainer}>
            <WeightChart data={chartData} color={AbalColors.primary} height={180} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              {weightHistory.length === 0
                ? 'No weight data yet. Add your first entry!'
                : 'Not enough data for this time range. Add more entries!'}
            </ThemedText>
          </View>
        )}

        {/* View Details Button */}
        {weightHistory.length > 0 && (
          <Pressable
            style={styles.viewDetailsButton}
            onPress={() => router.push('/progress-history')}
          >
            <ThemedText style={styles.viewDetailsText}>View All Entries</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={AbalColors.primary} />
          </Pressable>
        )}

        {/* Goal Tracker */}
        {goalWeight && latestWeight && startWeight ? (
          <View style={[styles.goalCard, isGoalAchieved && styles.goalCardAchieved]}>
            {isGoalAchieved && (
              <View style={styles.achievedBanner}>
                <IconSymbol name="trophy.fill" size={16} color="#FFD700" />
                <ThemedText style={styles.achievedText}>Goal Achieved!</ThemedText>
              </View>
            )}
            <View style={styles.goalHeader}>
              <View>
                <ThemedText style={styles.goalLabel}>Goal Progress</ThemedText>
                <ThemedText style={styles.goalValue}>{Math.min(progressPercentage, 100).toFixed(0)}%</ThemedText>
              </View>
              <View style={styles.goalTarget}>
                <ThemedText style={styles.targetLabel}>Target</ThemedText>
                <ThemedText style={styles.targetValue}>{goalWeight} lbs</ThemedText>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <View style={[
                styles.progressBarFill,
                { width: `${Math.min(progressPercentage, 100)}%` },
                isGoalAchieved && styles.progressBarAchieved
              ]} />
            </View>

            <View style={styles.goalFooter}>
              <ThemedText style={styles.goalFooterText}>
                {isGoalAchieved ? 'You made it!' : `${remaining} lbs to go`}
              </ThemedText>
              <ThemedText style={styles.goalFooterText}>
                Start: {startWeight} lbs
              </ThemedText>
            </View>
          </View>
        ) : (
          !goalWeight && (
            <View style={styles.noGoalCard}>
              <IconSymbol name="target" size={32} color={AbalColors.textMuted} />
              <ThemedText style={styles.noGoalTitle}>No Goal Set</ThemedText>
              <ThemedText style={styles.noGoalText}>Set a target weight to track your progress</ThemedText>
              <Pressable
                style={styles.setGoalButton}
                onPress={() => setGoalModalVisible(true)}
              >
                <ThemedText style={styles.setGoalButtonText}>Set Goal Weight</ThemedText>
              </Pressable>
            </View>
          )
        )}
      </View>

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

      <AddWeightModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={addWeightEntry}
      />

      <GoalSettingModal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        currentGoal={goalWeight}
        onSave={setGoalWeight}
      />

      <GoalAchievedModal
        visible={celebrationVisible}
        onClose={() => setCelebrationVisible(false)}
        goalWeight={goalWeight || 0}
      />
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
    lineHeight: 34,
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
  weightSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  addButton: {
    backgroundColor: AbalColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: AbalColors.background,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.md,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  timeRangeButtonActive: {
    backgroundColor: AbalColors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  timeRangeTextActive: {
    color: AbalColors.textPrimary,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    paddingRight: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.card,
    alignItems: 'center',
    overflow: 'hidden',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.primary,
  },
  emptyState: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  emptyStateText: {
    color: AbalColors.textSecondary,
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.card,
  },
  goalCardAchieved: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  achievedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.divider,
  },
  achievedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  noGoalCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
  },
  noGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  noGoalText: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  setGoalButton: {
    backgroundColor: AbalColors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  setGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  goalLabel: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  goalTarget: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    fontSize: 12,
    color: AbalColors.textSecondary,
    marginBottom: 2,
  },
  targetValue: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: AbalColors.background,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AbalColors.primary,
    borderRadius: 4,
  },
  progressBarAchieved: {
    backgroundColor: '#FFD700',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalFooterText: {
    fontSize: 12,
    color: AbalColors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
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
