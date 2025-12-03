import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementBadge } from '@/components/AchievementBadge';
import { AddWeightModal } from '@/components/AddWeightModal';
import { GoalAchievedModal } from '@/components/GoalAchievedModal';
import { GoalSettingModal } from '@/components/GoalSettingModal';
import { StatCard } from '@/components/StatCard';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeightProgressCard } from '@/components/WeightProgressCard';
import {
  mockAchievements,
  mockStatsSummary,
  mockWorkoutHistory,
} from '@/constants/mock-data';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

type TabType = 'overview' | 'achievements' | 'history';

const TABS: { key: TabType; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'history', label: 'History' },
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

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
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
      {/* Weight Progress Card */}
      <WeightProgressCard
        weightHistory={weightHistory}
        onAddEntry={() => setAddModalVisible(true)}
        onViewAll={() => router.push('/progress-history')}
      />

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
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  goalCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
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
    borderRadius: BorderRadius.lg,
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
