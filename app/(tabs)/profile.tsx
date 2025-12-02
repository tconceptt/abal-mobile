import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoalSettingModal } from '@/components/GoalSettingModal';
import { ProfileMenuItem, ProfileMenuSection } from '@/components/ProfileMenuItem';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockMembership, mockUser } from '@/constants/mock-data';
import { AbalColors, BorderRadius, Spacing } from '@/constants/theme';
import { useUser } from '@/context/UserContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { goalWeight, setGoalWeight } = useUser();
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
  };

  const handleSubscription = () => {
    router.push('/subscription');
  };

  const handlePaymentHistory = () => {
    router.push('/subscription/history');
  };

  const handleNotifications = () => {
    console.log('Notifications settings pressed');
  };

  const handlePrivacy = () => {
    console.log('Privacy settings pressed');
  };

  const handleHelp = () => {
    console.log('Help pressed');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={{ uri: mockUser.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{mockUser.name}</ThemedText>
            <ThemedText style={styles.userEmail}>{mockUser.email}</ThemedText>
            <ThemedText style={styles.memberSince}>
              Member since {mockUser.memberSince}
            </ThemedText>
          </View>
          <Pressable onPress={handleEditProfile} style={styles.editButton} hitSlop={8}>
            <IconSymbol name="pencil" size={18} color={AbalColors.textSecondary} />
          </Pressable>
        </View>

        {/* Membership Status */}
        <View style={styles.membershipCard}>
          <View style={styles.membershipHeader}>
            <View>
              <ThemedText style={styles.membershipLabel}>Current Plan</ThemedText>
              <ThemedText style={styles.membershipType}>{mockMembership.type}</ThemedText>
            </View>
            <View style={[
              styles.statusBadge,
              mockMembership.status === 'active' ? styles.statusActive : styles.statusInactive
            ]}>
              <ThemedText style={styles.statusText}>
                {mockMembership.status.charAt(0).toUpperCase() + mockMembership.status.slice(1)}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.expiryText}>
            Expires on {mockMembership.expiresAt}
          </ThemedText>
        </View>

        {/* Menu Sections */}
        <ProfileMenuSection title="Account">
          <ProfileMenuItem
            icon="creditcard.fill"
            label="My Subscription"
            subtitle="Manage your membership plan"
            onPress={handleSubscription}
            iconColor={AbalColors.primary}
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="target"
            label="Goal Weight"
            subtitle={goalWeight ? `${goalWeight} lbs` : "Set your target"}
            onPress={() => setGoalModalVisible(true)}
            iconColor="#EF4444"
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="doc.text.fill"
            label="Payment History"
            subtitle="View past transactions"
            onPress={handlePaymentHistory}
            iconColor="#6366F1"
          />
        </ProfileMenuSection>

        <ProfileMenuSection title="Preferences">
          <ProfileMenuItem
            icon="bell.fill"
            label="Notifications"
            subtitle="Push notifications & alerts"
            onPress={handleNotifications}
            iconColor="#F59E0B"
          />
          <View style={styles.divider} />
          <ProfileMenuItem
            icon="lock.fill"
            label="Privacy & Security"
            onPress={handlePrivacy}
            iconColor="#10B981"
          />
        </ProfileMenuSection>

        <ProfileMenuSection title="Support">
          <ProfileMenuItem
            icon="questionmark.circle.fill"
            label="Help & Support"
            subtitle="FAQs, contact us"
            onPress={handleHelp}
            iconColor="#8B5CF6"
          />
        </ProfileMenuSection>

        <ProfileMenuSection>
          <ProfileMenuItem
            icon="rectangle.portrait.and.arrow.right"
            label="Log Out"
            onPress={handleLogout}
            showChevron={false}
            danger
          />
        </ProfileMenuSection>

        {/* App version */}
        <ThemedText style={styles.version}>Abal v1.0.0</ThemedText>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <GoalSettingModal
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        currentGoal={goalWeight}
        onSave={setGoalWeight}
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
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AbalColors.cardBackground,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: AbalColors.divider,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  userName: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  memberSince: {
    fontSize: 12,
    color: AbalColors.textMuted,
    marginTop: 4,
  },
  editButton: {
    padding: Spacing.sm,
  },
  membershipCard: {
    backgroundColor: AbalColors.cardBackground,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: AbalColors.primary,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  membershipLabel: {
    fontSize: 12,
    color: AbalColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  membershipType: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusActive: {
    backgroundColor: '#10B98120',
  },
  statusInactive: {
    backgroundColor: '#EF444420',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  expiryText: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: AbalColors.divider,
    marginLeft: 52,
  },
  version: {
    fontSize: 12,
    color: AbalColors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});
