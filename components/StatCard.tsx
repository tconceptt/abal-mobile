import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface StatCardProps {
  icon: IconSymbolName;
  iconColor: string;
  label: string;
  value: string | number;
  subtitle?: string;
}

export function StatCard({ icon, iconColor, label, value, subtitle }: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <IconSymbol name={icon} size={22} color={iconColor} />
      </View>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.card,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  label: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    color: AbalColors.textMuted,
    marginTop: 2,
  },
});

