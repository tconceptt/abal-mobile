import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { dummyFunctions, Membership, mockMembership } from '@/constants/mock-data';

interface MembershipCardProps {
  membership?: Membership;
  onRenewPress?: () => void;
}

export function MembershipCard({
  membership = mockMembership,
  onRenewPress = dummyFunctions.onRenewSubscription,
}: MembershipCardProps) {
  const isActive = membership.status === 'active';

  return (
    <View style={styles.container}>
      {/* Status badge */}
      <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
        <ThemedText style={styles.badgeText}>
          {isActive ? 'Active' : membership.status === 'expired' ? 'Expired' : 'Pending'}
        </ThemedText>
      </View>

      {/* Title */}
      <ThemedText style={styles.title}>
        {isActive ? 'Active Membership' : 'Membership'}
      </ThemedText>

      {/* Expiry date */}
      <ThemedText style={styles.subtitle}>
        Expires on {membership.expiresAt}
      </ThemedText>

      {/* CTA Button */}
      <Pressable
        onPress={onRenewPress}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <ThemedText style={styles.buttonText}>Renew Subscription</ThemedText>
      </Pressable>

      {/* Pagination dots (decorative) */}
      <View style={styles.pagination}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    ...Shadows.cardLarge,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  badgeInactive: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(26, 26, 26, 0.7)',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: AbalColors.textPrimary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(26, 26, 26, 0.2)',
  },
  dotActive: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
  },
});

