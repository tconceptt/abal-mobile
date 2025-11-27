import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, Spacing } from '@/constants/theme';
import { dummyFunctions, mockUser, User } from '@/constants/mock-data';

interface HeaderProps {
  user?: User;
  hasNotification?: boolean;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({
  user = mockUser,
  hasNotification = true,
  onNotificationPress = dummyFunctions.onNotificationPress,
  onProfilePress = dummyFunctions.onProfilePress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Abal Logo */}
      <Image
        source={require('@/assets/images/abal-logo.png')}
        style={styles.logo}
        contentFit="contain"
      />

      {/* Right side actions */}
      <View style={styles.actions}>
        {/* Notification bell */}
        <Pressable
          onPress={onNotificationPress}
          style={styles.notificationButton}
          hitSlop={8}
        >
          <IconSymbol name="bell" size={24} color={AbalColors.textPrimary} />
          {hasNotification && <View style={styles.notificationDot} />}
        </Pressable>

        {/* Profile avatar */}
        <Pressable onPress={onProfilePress} hitSlop={4}>
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            transition={200}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: AbalColors.cardBackground,
  },
  logo: {
    width: 100,
    height: 32,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: AbalColors.cardBackground,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AbalColors.divider,
  },
});
