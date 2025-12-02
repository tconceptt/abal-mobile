import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { dummyFunctions } from '@/constants/mock-data';
import { AbalColors, BorderRadius, Spacing } from '@/constants/theme';

type PaymentState = 'loading' | 'ready' | 'copied';

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const { packageName, total, currency } = useLocalSearchParams<{
    packageId: string;
    packageName: string;
    total: string;
    currency: string;
  }>();

  const [state, setState] = useState<PaymentState>('loading');
  const [paymentCode, setPaymentCode] = useState<string>('');

  useEffect(() => {
    // Simulate loading and generating payment code
    const timer = setTimeout(() => {
      const code = dummyFunctions.generatePaymentCode();
      setPaymentCode(code);
      setState('ready');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(paymentCode);
    setState('copied');
    setTimeout(() => setState('ready'), 2000);
  };

  const handleDone = () => {
    // Navigate back to the profile tab
    router.dismissAll();
    router.replace('/(tabs)/profile');
  };

  const formatPaymentCode = (code: string) => {
    // Format as XXX-XXX-XXX
    return code.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <ThemedText style={styles.headerTitle}>Payment</ThemedText>
        <Pressable onPress={handleDone} style={styles.closeButton} hitSlop={8}>
          <IconSymbol name="xmark" size={20} color={AbalColors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {state === 'loading' ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AbalColors.primary} />
            <ThemedText style={styles.loadingText}>
              Generating payment code...
            </ThemedText>
          </View>
        ) : (
          <>
            {/* Success Icon */}
            <View style={styles.successIcon}>
              <IconSymbol name="checkmark.circle.fill" size={64} color={AbalColors.primary} />
            </View>

            <ThemedText style={styles.title}>Payment Code Ready</ThemedText>
            <ThemedText style={styles.subtitle}>
              Use this code to complete your payment on Telebirr
            </ThemedText>

            {/* Payment Code Display */}
            <View style={styles.codeContainer}>
              <ThemedText style={styles.codeLabel}>Your Payment Code</ThemedText>
              <ThemedText style={styles.code}>{formatPaymentCode(paymentCode)}</ThemedText>
              
              <Pressable
                onPress={handleCopyCode}
                style={({ pressed }) => [
                  styles.copyButton,
                  pressed && styles.copyButtonPressed,
                  state === 'copied' && styles.copyButtonCopied,
                ]}
              >
                <IconSymbol
                  name={state === 'copied' ? 'checkmark' : 'doc.on.clipboard'}
                  size={18}
                  color={state === 'copied' ? '#10B981' : AbalColors.textPrimary}
                />
                <ThemedText style={[
                  styles.copyButtonText,
                  state === 'copied' && styles.copyButtonTextCopied,
                ]}>
                  {state === 'copied' ? 'Copied!' : 'Copy Code'}
                </ThemedText>
              </Pressable>
            </View>

            {/* Payment Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Package</ThemedText>
                <ThemedText style={styles.summaryValue}>{packageName}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Amount</ThemedText>
                <ThemedText style={styles.summaryValueBold}>
                  {Number(total).toLocaleString()} {currency}
                </ThemedText>
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <ThemedText style={styles.instructionsTitle}>How to Pay</ThemedText>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>1</ThemedText>
                </View>
                <ThemedText style={styles.stepText}>Open the Telebirr app on your phone</ThemedText>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>2</ThemedText>
                </View>
                <ThemedText style={styles.stepText}>Select "Pay Bill" and enter the code above</ThemedText>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>3</ThemedText>
                </View>
                <ThemedText style={styles.stepText}>Confirm the payment amount and complete</ThemedText>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Done Button */}
      {state !== 'loading' && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
          <Pressable
            onPress={handleDone}
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.doneButtonPressed,
            ]}
          >
            <ThemedText style={styles.doneButtonText}>Done</ThemedText>
          </Pressable>
        </View>
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
    paddingVertical: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: AbalColors.textSecondary,
    marginTop: Spacing.md,
  },
  successIcon: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  codeContainer: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: AbalColors.primary,
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontSize: 12,
    color: AbalColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  code: {
    fontSize: 36,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: AbalColors.divider,
  },
  copyButtonPressed: {
    opacity: 0.8,
  },
  copyButtonCopied: {
    backgroundColor: '#10B98120',
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  copyButtonTextCopied: {
    color: '#10B981',
  },
  summaryCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: AbalColors.textPrimary,
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  instructions: {
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: AbalColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: AbalColors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: AbalColors.border,
  },
  doneButton: {
    backgroundColor: AbalColors.textPrimary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonPressed: {
    opacity: 0.9,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

