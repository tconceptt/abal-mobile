import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityItem } from '@/components/ActivityItem';
import { Header } from '@/components/Header';
import { MembershipCard } from '@/components/MembershipCard';
import { ProgressCard } from '@/components/ProgressCard';
import { ThemedText } from '@/components/themed-text';
import { AbalColors, Spacing } from '@/constants/theme';
import {
  dummyFunctions,
  mockActivities,
  mockMembership,
  mockProgressMetrics,
  mockUser,
} from '@/constants/mock-data';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const handleRenewSubscription = () => {
    router.push('/subscription/packages');
  };

  const handleViewAllProgress = () => {
    router.push('/(tabs)/progress');
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
          onRenewPress={handleRenewSubscription}
        />

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
            <Pressable onPress={dummyFunctions.onViewAllActivities} hitSlop={8}>
              <ThemedText style={styles.viewAllLink}>View All</ThemedText>
            </Pressable>
          </View>

          {/* Activity Items */}
          {mockActivities.slice(0, 2).map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </View>

        {/* My Progress Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>My Progress</ThemedText>
            <Pressable onPress={handleViewAllProgress} hitSlop={8}>
              <ThemedText style={styles.viewAllLink}>View All</ThemedText>
            </Pressable>
          </View>

          {/* Horizontal scroll of progress cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.progressScrollContent}
          >
            {mockProgressMetrics.map((metric) => (
              <ProgressCard key={metric.id} metric={metric} />
            ))}
          </ScrollView>
        </View>

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
  progressScrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
