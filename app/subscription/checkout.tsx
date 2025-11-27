import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { dummyFunctions, mockPackages } from '@/constants/mock-data';

const RENEWAL_OPTIONS = [
  { id: 'immediate', label: 'Start Immediately', description: 'Your new plan starts today' },
  { id: 'end', label: 'After Current Ends', description: 'Starts when your current plan expires' },
];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [renewalOption, setRenewalOption] = useState('immediate');
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  const selectedPackage = mockPackages.find(p => p.id === packageId) || mockPackages[0];
  
  const subtotal = selectedPackage.price;
  const discountAmount = Math.round(subtotal * (discountApplied / 100));
  const total = subtotal - discountAmount;

  const handleBack = () => {
    router.back();
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return;
    
    setIsApplyingCode(true);
    // Simulate API call
    setTimeout(() => {
      const discount = dummyFunctions.onApplyDiscount(discountCode);
      setDiscountApplied(discount);
      setIsApplyingCode(false);
    }, 500);
  };

  const handleConfirmPayment = () => {
    router.push({
      pathname: '/subscription/payment',
      params: {
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        total: total.toString(),
        currency: selectedPackage.currency,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <IconSymbol name="chevron.left" size={24} color={AbalColors.textPrimary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Checkout</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Plan Summary */}
        <View style={styles.summaryCard}>
          <ThemedText style={styles.sectionTitle}>Selected Plan</ThemedText>
          <View style={styles.planRow}>
            <View>
              <ThemedText style={styles.planName}>{selectedPackage.name}</ThemedText>
              <ThemedText style={styles.planDuration}>{selectedPackage.duration}</ThemedText>
            </View>
            <ThemedText style={styles.planPrice}>
              {selectedPackage.price.toLocaleString()} {selectedPackage.currency}
            </ThemedText>
          </View>
        </View>

        {/* Discount Code */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Discount Code</ThemedText>
          <View style={styles.discountRow}>
            <TextInput
              style={styles.discountInput}
              placeholder="Enter code"
              placeholderTextColor={AbalColors.textMuted}
              value={discountCode}
              onChangeText={setDiscountCode}
              autoCapitalize="characters"
              editable={discountApplied === 0}
            />
            <Pressable
              onPress={handleApplyDiscount}
              disabled={isApplyingCode || discountApplied > 0}
              style={[
                styles.applyButton,
                (isApplyingCode || discountApplied > 0) && styles.applyButtonDisabled,
              ]}
            >
              <ThemedText style={styles.applyButtonText}>
                {discountApplied > 0 ? 'Applied' : 'Apply'}
              </ThemedText>
            </Pressable>
          </View>
          {discountApplied > 0 && (
            <View style={styles.discountSuccess}>
              <IconSymbol name="checkmark.circle.fill" size={16} color="#10B981" />
              <ThemedText style={styles.discountSuccessText}>
                {discountApplied}% discount applied!
              </ThemedText>
            </View>
          )}
          <ThemedText style={styles.discountHint}>
            Try "ABAL20" for 20% off
          </ThemedText>
        </View>

        {/* Renewal Date */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Renewal Start</ThemedText>
          {RENEWAL_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setRenewalOption(option.id)}
              style={styles.renewalOption}
            >
              <View style={[styles.radio, renewalOption === option.id && styles.radioSelected]}>
                {renewalOption === option.id && <View style={styles.radioInner} />}
              </View>
              <View style={styles.renewalContent}>
                <ThemedText style={styles.renewalLabel}>{option.label}</ThemedText>
                <ThemedText style={styles.renewalDescription}>{option.description}</ThemedText>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {subtotal.toLocaleString()} {selectedPackage.currency}
            </ThemedText>
          </View>
          {discountApplied > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Discount ({discountApplied}%)</ThemedText>
              <ThemedText style={styles.discountValue}>
                -{discountAmount.toLocaleString()} {selectedPackage.currency}
              </ThemedText>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>
              {total.toLocaleString()} {selectedPackage.currency}
            </ThemedText>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          onPress={handleConfirmPayment}
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
          ]}
        >
          <ThemedText style={styles.confirmButtonText}>Confirm & Pay</ThemedText>
        </Pressable>
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
  card: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  summaryCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: AbalColors.primary,
    ...Shadows.card,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  planDuration: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  discountRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  discountInput: {
    flex: 1,
    backgroundColor: AbalColors.background,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: AbalColors.textPrimary,
  },
  applyButton: {
    backgroundColor: AbalColors.textPrimary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: AbalColors.textMuted,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  discountSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  discountSuccessText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  discountHint: {
    fontSize: 12,
    color: AbalColors.textMuted,
    marginTop: Spacing.xs,
  },
  renewalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: AbalColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  radioSelected: {
    borderColor: AbalColors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AbalColors.primary,
  },
  renewalContent: {
    flex: 1,
  },
  renewalLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: AbalColors.textPrimary,
  },
  renewalDescription: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 15,
    color: AbalColors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    color: AbalColors.textPrimary,
  },
  discountValue: {
    fontSize: 15,
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: AbalColors.divider,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AbalColors.cardBackground,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AbalColors.border,
  },
  confirmButton: {
    backgroundColor: AbalColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonPressed: {
    opacity: 0.9,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
});

