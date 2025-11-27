import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PackageCard } from '@/components/PackageCard';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Spacing } from '@/constants/theme';
import { mockPackages } from '@/constants/mock-data';

export default function PackagesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPackage, setSelectedPackage] = useState<string>(
    mockPackages.find(p => p.popular)?.id || mockPackages[0].id
  );

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    router.push({
      pathname: '/subscription/checkout',
      params: { packageId: selectedPackage },
    });
  };

  const selected = mockPackages.find(p => p.id === selectedPackage);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <IconSymbol name="chevron.left" size={24} color={AbalColors.textPrimary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Choose a Plan</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Packages */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.subtitle}>
          Select the membership plan that works best for you
        </ThemedText>

        {mockPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            package_={pkg}
            selected={selectedPackage === pkg.id}
            onSelect={setSelectedPackage}
          />
        ))}

        {/* Bottom spacing for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer with Continue Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <View style={styles.selectedInfo}>
          <ThemedText style={styles.selectedLabel}>Selected:</ThemedText>
          <ThemedText style={styles.selectedName}>
            {selected?.name} - {selected?.price.toLocaleString()} {selected?.currency}
          </ThemedText>
        </View>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
        >
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          <IconSymbol name="arrow.right" size={18} color="#FFFFFF" />
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
    paddingTop: Spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: AbalColors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
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
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  selectedLabel: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
  selectedName: {
    fontSize: 13,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: AbalColors.textPrimary,
    borderRadius: BorderRadius.md,
    paddingVertical: 16,
  },
  continueButtonPressed: {
    opacity: 0.9,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

