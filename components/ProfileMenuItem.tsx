import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Spacing } from '@/constants/theme';

interface ProfileMenuItemProps {
  icon: IconSymbolName;
  label: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  iconColor?: string;
  danger?: boolean;
}

export function ProfileMenuItem({
  icon,
  label,
  subtitle,
  onPress,
  showChevron = true,
  iconColor,
  danger = false,
}: ProfileMenuItemProps) {
  const textColor = danger ? '#EF4444' : AbalColors.textPrimary;
  const finalIconColor = danger ? '#EF4444' : iconColor || AbalColors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${finalIconColor}15` }]}>
        <IconSymbol name={icon} size={20} color={finalIconColor} />
      </View>

      <View style={styles.content}>
        <ThemedText style={[styles.label, { color: textColor }]}>{label}</ThemedText>
        {subtitle && (
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        )}
      </View>

      {showChevron && (
        <IconSymbol name="chevron.right" size={18} color={AbalColors.textMuted} />
      )}
    </Pressable>
  );
}

interface ProfileMenuSectionProps {
  title?: string;
  children: React.ReactNode;
}

export function ProfileMenuSection({ title, children }: ProfileMenuSectionProps) {
  return (
    <View style={styles.section}>
      {title && <ThemedText style={styles.sectionTitle}>{title}</ThemedText>}
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
  },
  containerPressed: {
    backgroundColor: AbalColors.divider,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    color: AbalColors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: AbalColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionContent: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.md,
    overflow: 'hidden',
  },
});



