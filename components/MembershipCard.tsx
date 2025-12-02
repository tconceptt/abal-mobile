import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { dummyFunctions, Membership, mockMembership } from '@/constants/mock-data';

// Premium color palette based on Abal logo (#117d5c)
const COLORS = {
  // Rich gradient from deep emerald to vibrant teal
  gradientStart: '#0a5c42',
  gradientMid: '#117d5c',
  gradientEnd: '#1a9d73',
  // Warm gold accent for premium feel
  accent: '#E8B931',
  accentLight: '#F4D35E',
  // Clean whites
  white: '#FFFFFF',
  whiteTranslucent: 'rgba(255, 255, 255, 0.15)',
};

// Motivational phrases
const MOTIVATIONAL_PHRASES = [
  "Let's crush your goals today! 💪",
  "Every rep counts. Keep going!",
  "Your future self will thank you.",
  "Small steps lead to big results.",
  "Consistency beats perfection.",
  "You're stronger than you think!",
  "Make today count.",
  "Progress, not perfection.",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getMotivationalPhrase(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length];
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}

interface MembershipCardProps {
  membership?: Membership;
  userName?: string;
  onRenewPress?: () => void;
}

export function MembershipCard({
  membership = mockMembership,
  userName = 'there',
  onRenewPress = dummyFunctions.onRenewSubscription,
}: MembershipCardProps) {
  const isActive = membership.status === 'active';
  const greeting = getGreeting();
  const firstName = getFirstName(userName);
  const motivationalPhrase = getMotivationalPhrase();

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Decorative circles for visual interest */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {/* Content */}
        <View style={styles.content}>
          {/* Greeting Header */}
          <View style={styles.greetingSection}>
            <ThemedText style={styles.greeting}>
              {greeting}, {firstName}
            </ThemedText>
            <ThemedText style={styles.motivational}>
              {motivationalPhrase}
            </ThemedText>
          </View>

          {/* Membership Info Row */}
          <View style={styles.membershipRow}>
            <View style={styles.membershipInfo}>
              <ThemedText style={styles.membershipTitle}>
                {isActive ? 'Active Subscription' : 'Membership'}
              </ThemedText>
              <ThemedText style={styles.membershipExpiry}>
                Valid until {membership.expiresAt}
              </ThemedText>
            </View>

            {/* Compact CTA Button */}
            <Pressable
              onPress={onRenewPress}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.accentLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <ThemedText style={styles.buttonText}>Renew</ThemedText>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    // Premium shadow
    shadowColor: '#0a5c42',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    overflow: 'hidden',
  },
  // Decorative background elements
  decorativeCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.whiteTranslucent,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    zIndex: 1,
  },
  // Greeting section
  greetingSection: {
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  motivational: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  // Membership row
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 4,
    marginBottom: Spacing.sm,
  },
  membershipInfo: {
    flex: 1,
  },
  membershipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  membershipExpiry: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginLeft: Spacing.sm,
  },
  buttonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 13,
    fontWeight: '700',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 18,
  },
});



