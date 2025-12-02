import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { mockMembership, mockPaymentHistory } from '@/constants/mock-data';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleRenew = () => {
    router.push('/subscription/packages');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <IconSymbol name="chevron.left" size={24} color={AbalColors.textPrimary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>My Subscription</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Current Plan Card */}
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <ThemedText style={styles.planLabel}>Current Plan</ThemedText>
              <ThemedText style={styles.planName}>{mockMembership.type}</ThemedText>
            </View>
            <View style={[
              styles.statusBadge,
              mockMembership.status === 'active' ? styles.statusActive : styles.statusExpired
            ]}>
              <ThemedText style={[
                styles.statusText,
                mockMembership.status === 'active' ? styles.statusTextActive : styles.statusTextExpired
              ]}>
                {mockMembership.status.charAt(0).toUpperCase() + mockMembership.status.slice(1)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.planDetails}>
            <View style={styles.detailRow}>
              <IconSymbol name="calendar" size={18} color={AbalColors.textSecondary} />
              <ThemedText style={styles.detailText}>
                Expires on {mockMembership.expiresAt}
              </ThemedText>
            </View>
          </View>

          {/* Renew Button */}
          <Pressable
            onPress={handleRenew}
            style={({ pressed }) => [
              styles.renewButton,
              pressed && styles.renewButtonPressed,
            ]}
          >
            <ThemedText style={styles.renewButtonText}>Renew Subscription</ThemedText>
            <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Recent Payments */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recent Payments</ThemedText>

          {mockPaymentHistory.slice(0, 3).map((payment) => (
            <View key={payment.id} style={styles.paymentItem}>
              <View style={styles.paymentInfo}>
                <ThemedText style={styles.paymentPackage}>{payment.package}</ThemedText>
                <ThemedText style={styles.paymentDate}>{payment.date}</ThemedText>
              </View>
              <View style={styles.paymentAmount}>
                <ThemedText style={styles.paymentValue}>
                  {payment.amount.toLocaleString()} {payment.currency}
                </ThemedText>
                <View style={[
                  styles.paymentStatus,
                  payment.status === 'completed' && styles.paymentCompleted,
                ]}>
                  <ThemedText style={styles.paymentStatusText}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}

          <Pressable
            onPress={() => router.push('/subscription/history')}
            style={styles.viewAllButton}
          >
            <ThemedText style={styles.viewAllText}>View All Payments</ThemedText>
            <IconSymbol name="chevron.right" size={16} color={AbalColors.textSecondary} />
          </Pressable>
        </View>
      </View>
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
    paddingVertical: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  planCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  planLabel: {
    fontSize: 12,
    color: AbalColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  statusActive: {
    backgroundColor: '#10B98120',
  },
  statusExpired: {
    backgroundColor: '#EF444420',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#10B981',
  },
  statusTextExpired: {
    color: '#EF4444',
  },
  planDetails: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: 15,
    color: AbalColors.textSecondary,
  },
  renewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: AbalColors.textPrimary,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
  },
  renewButtonPressed: {
    opacity: 0.9,
  },
  renewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.md,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.divider,
  },
  paymentInfo: {},
  paymentPackage: {
    fontSize: 15,
    fontWeight: '500',
    color: AbalColors.textPrimary,
  },
  paymentDate: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  paymentStatus: {
    marginTop: 2,
  },
  paymentCompleted: {},
  paymentStatusText: {
    fontSize: 12,
    color: '#10B981',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
});


