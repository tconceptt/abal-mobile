import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { SubscriptionPackage } from '@/constants/mock-data';

interface PackageCardProps {
  package_: SubscriptionPackage;
  selected: boolean;
  onSelect: (packageId: string) => void;
}

export function PackageCard({ package_, selected, onSelect }: PackageCardProps) {
  return (
    <Pressable
      onPress={() => onSelect(package_.id)}
      style={[
        styles.container,
        selected && styles.containerSelected,
        package_.popular && styles.containerPopular,
      ]}
    >
      {/* Popular badge */}
      {package_.popular && (
        <View style={styles.popularBadge}>
          <ThemedText style={styles.popularText}>Most Popular</ThemedText>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.name}>{package_.name}</ThemedText>
          <ThemedText style={styles.description}>{package_.description}</ThemedText>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
      </View>

      {/* Price */}
      <View style={styles.priceContainer}>
        <ThemedText style={styles.price}>{package_.price.toLocaleString()}</ThemedText>
        <ThemedText style={styles.currency}> {package_.currency}</ThemedText>
        <ThemedText style={styles.duration}>/{package_.duration}</ThemedText>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {package_.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <IconSymbol name="checkmark" size={16} color={AbalColors.primary} />
            <ThemedText style={styles.featureText}>{feature}</ThemedText>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: AbalColors.border,
    ...Shadows.card,
  },
  containerSelected: {
    borderColor: AbalColors.primary,
  },
  containerPopular: {
    borderColor: AbalColors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: Spacing.md,
    backgroundColor: AbalColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    fontSize: 11,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AbalColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: AbalColors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AbalColors.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  duration: {
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  features: {
    gap: Spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    flex: 1,
  },
});



