import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Barbell,
  IconProps,
  Lightning,
  PersonSimpleRun,
  PersonSimpleTaiChi,
  Target,
} from 'phosphor-react-native';
import React, { ComponentType, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockUser } from '@/constants/mock-data';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useWorkouts, Workout, WorkoutSource } from '@/hooks/useWorkouts';

type FilterTab = 'all' | 'cardio' | 'strength';

// Workout type icons and colors
const workoutTypeConfig: Record<string, { Icon: ComponentType<IconProps>; color: string; bgColor: string }> = {
  cardio: { Icon: PersonSimpleRun, color: '#EF4444', bgColor: '#FEE2E2' },
  strength: { Icon: Barbell, color: '#8B5CF6', bgColor: '#EDE9FE' },
  flexibility: { Icon: PersonSimpleTaiChi, color: '#10B981', bgColor: '#D1FAE5' },
  mixed: { Icon: Lightning, color: '#F59E0B', bgColor: '#FEF3C7' },
  other: { Icon: Target, color: '#6366F1', bgColor: '#E0E7FF' },
};

function WorkoutItemCard({ workout }: { workout: Workout }) {
  const config = workoutTypeConfig[workout.type] || workoutTypeConfig.other;
  const { Icon } = config;
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const workoutDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    return workoutDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: workoutDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Pressable 
      style={({ pressed }) => [styles.workoutCard, pressed && styles.cardPressed]}
      onPress={() => console.log('View workout:', workout.id)}
    >
      <View style={styles.workoutCardContent}>
        {/* Icon */}
        <View style={[styles.workoutIcon, { backgroundColor: config.bgColor }]}>
          <Icon size={24} color={config.color} weight="fill" />
        </View>

        {/* Info */}
        <View style={styles.workoutInfo}>
          <View style={styles.workoutHeader}>
            <ThemedText style={styles.workoutName}>{workout.name}</ThemedText>
            <SourceBadge source={workout.source} />
          </View>
          <ThemedText style={styles.workoutDate}>{formatDate(workout.date)}</ThemedText>
          
          {/* Stats */}
          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <IconSymbol name="clock" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.statText}>{formatDuration(workout.duration)}</ThemedText>
              <ThemedText style={styles.statLabel}>Duration</ThemedText>
            </View>
            <View style={styles.statItem}>
              <IconSymbol name="flame" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.statText}>{workout.calories}</ThemedText>
              <ThemedText style={styles.statLabel}>Calories</ThemedText>
            </View>
          </View>
        </View>

        {/* Chevron */}
        <IconSymbol name="chevron.right" size={20} color={AbalColors.textMuted} />
      </View>
    </Pressable>
  );
}

function SourceBadge({ source }: { source: WorkoutSource }) {
  const isHealthKit = source === 'healthkit';
  
  return (
    <View style={[styles.sourceBadge, isHealthKit ? styles.healthKitBadge : styles.appBadge]}>
      {isHealthKit ? (
        <IconSymbol name="heart.fill" size={10} color="#FF2D55" />
      ) : (
        <Image 
          source={require('@/assets/images/abal-logo.png')} 
          style={styles.badgeLogo}
          contentFit="contain"
        />
      )}
      <ThemedText style={[styles.badgeText, isHealthKit && styles.healthKitBadgeText]}>
        {isHealthKit ? 'Health Kit' : 'App Logged'}
      </ThemedText>
    </View>
  );
}

function FilterTabs({ 
  activeFilter, 
  onFilterChange 
}: { 
  activeFilter: FilterTab; 
  onFilterChange: (filter: FilterTab) => void;
}) {
  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'cardio', label: 'Cardio' },
    { key: 'strength', label: 'Strength' },
  ];

  return (
    <View style={styles.filterTabs}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.filterTab, activeFilter === tab.key && styles.filterTabActive]}
          onPress={() => onFilterChange(tab.key)}
        >
          <ThemedText
            style={[
              styles.filterTabText,
              activeFilter === tab.key && styles.filterTabTextActive,
            ]}
          >
            {tab.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

function EmptyState({ filter }: { filter: FilterTab }) {
  const messages: Record<FilterTab, string> = {
    all: "No workouts yet. Start your first workout!",
    cardio: "No cardio workouts found.",
    strength: "No strength workouts found.",
  };

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <IconSymbol name="figure.run" size={48} color={AbalColors.textMuted} />
      </View>
      <ThemedText style={styles.emptyText}>{messages[filter]}</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Workouts from the Health app will also appear here
      </ThemedText>
    </View>
  );
}

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const { workouts, isLoading, refreshWorkouts, getFilteredWorkouts } = useWorkouts();

  const filteredWorkouts = getFilteredWorkouts(activeFilter);

  const handleStartWorkout = () => {
    router.push('/start-workout');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('@/assets/images/abal-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.notificationButton} hitSlop={8}>
            <IconSymbol name="bell" size={24} color={AbalColors.textPrimary} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable onPress={handleProfilePress} hitSlop={4}>
            <Image
              source={{ uri: mockUser.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          </Pressable>
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Workouts</ThemedText>
      </View>

      {/* Start Workout Button */}
      <Pressable 
        style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
        onPress={handleStartWorkout}
      >
        <IconSymbol name="figure.run" size={24} color={AbalColors.textPrimary} />
        <ThemedText style={styles.startButtonText}>START NEW WORKOUT</ThemedText>
      </Pressable>

      {/* Recent Workouts Section */}
      <View style={styles.recentSection}>
        <ThemedText style={styles.sectionTitle}>Recent Workouts</ThemedText>
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </View>

      {/* Workouts List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AbalColors.primary} />
          <ThemedText style={styles.loadingText}>Loading workouts...</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WorkoutItemCard workout={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState filter={activeFilter} />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshWorkouts}
              tintColor={AbalColors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbalColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: AbalColors.cardBackground,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logo: {
    width: 100,
    height: 32,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: AbalColors.cardBackground,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AbalColors.divider,
  },
  titleContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: AbalColors.cardBackground,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AbalColors.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    letterSpacing: 0.5,
  },
  recentSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  filterTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginRight: Spacing.md,
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: AbalColors.textPrimary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  filterTabTextActive: {
    color: AbalColors.textPrimary,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    flex: 1,
  },
  workoutDate: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: AbalColors.textSecondary,
    marginLeft: 2,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  appBadge: {
    backgroundColor: `${AbalColors.primary}30`,
  },
  healthKitBadge: {
    backgroundColor: '#FF2D5515',
  },
  badgeLogo: {
    width: 12,
    height: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  healthKitBadgeText: {
    color: '#FF2D55',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AbalColors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});

