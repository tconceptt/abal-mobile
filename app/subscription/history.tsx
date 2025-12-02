import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { mockPaymentHistory } from '@/constants/mock-data';

export default function PaymentHistoryScreen() {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return AbalColors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <IconSymbol name="chevron.left" size={24} color={AbalColors.textPrimary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Payment History</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockPaymentHistory.length > 0 ? (
          mockPaymentHistory.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View>
                  <ThemedText style={styles.paymentPackage}>{payment.package}</ThemedText>
                  <ThemedText style={styles.paymentDate}>{payment.date}</ThemedText>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(payment.status)}20` }
                ]}>
                  <ThemedText style={[
                    styles.statusText,
                    { color: getStatusColor(payment.status) }
                  ]}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.paymentDetails}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Amount</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {payment.amount.toLocaleString()} {payment.currency}
                  </ThemedText>
                </View>
                {payment.paymentCode && (
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Payment Code</ThemedText>
                    <ThemedText style={styles.detailCode}>{payment.paymentCode}</ThemedText>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.text.fill" size={48} color={AbalColors.textMuted} />
            <ThemedText style={styles.emptyTitle}>No Payment History</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Your payment transactions will appear here
            </ThemedText>
          </View>
        )}

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
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  paymentCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  paymentPackage: {
    fontSize: 17,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  paymentDate: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentDetails: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AbalColors.divider,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  detailCode: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: AbalColors.textPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});


