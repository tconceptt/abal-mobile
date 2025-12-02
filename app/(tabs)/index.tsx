import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClassScheduleCard } from '@/components/ClassScheduleCard';
import { Header } from '@/components/Header';
import { MembershipCard } from '@/components/MembershipCard';
import { SwipableProgressCards } from '@/components/SwipableProgressCards';
import { ThemedText } from '@/components/themed-text';
import { WorkoutCard } from '@/components/WorkoutCard';
import { AbalColors, Spacing } from '@/constants/theme';
import { mockMembership, mockUser } from '@/constants/mock-data';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handleRenewSubscription = () => {
    router.push('/subscription/packages');
  };

  const handleViewAllProgress = () => {
    router.push('/(tabs)/progress');
  };

  const handleStartWorkout = () => {
    console.log('Workout started!');
    // TODO: Implement workout tracking
  };

  const handleStopWorkout = () => {
    console.log('Workout ended!');
    // TODO: Save workout data
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Header user={mockUser} hasNotification />

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Membership Card */}
        <MembershipCard
          membership={mockMembership}
          userName={mockUser.name}
          onRenewPress={handleRenewSubscription}
        />

        {/* Workout Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Today's Workout</ThemedText>
          </View>
          <WorkoutCard
            onStartWorkout={handleStartWorkout}
            onStopWorkout={handleStopWorkout}
          />
        </View>

        {/* Class Schedule Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Classes</ThemedText>
          </View>
          <ClassScheduleCard />
        </View>

        {/* My Progress Section - Swipable Cards */}
        <SwipableProgressCards onViewAll={handleViewAllProgress} />

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  section: {
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
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
