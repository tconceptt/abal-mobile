import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { dummyFunctions, FeedPost } from '@/constants/mock-data';

interface FeedItemProps {
  post: FeedPost;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

function getTypeLabel(type: FeedPost['type']): string {
  switch (type) {
    case 'workout':
      return 'completed a workout';
    case 'milestone':
      return 'hit a milestone';
    case 'checkin':
      return 'checked in';
    case 'class':
      return 'attended a class';
    case 'achievement':
      return 'earned an achievement';
    default:
      return '';
  }
}

function getTypeColor(type: FeedPost['type']): string {
  switch (type) {
    case 'workout':
      return '#6366F1'; // Indigo
    case 'milestone':
      return '#10B981'; // Green
    case 'checkin':
      return AbalColors.primary;
    case 'class':
      return '#F59E0B'; // Amber
    case 'achievement':
      return '#EF4444'; // Red
    default:
      return AbalColors.textSecondary;
  }
}

export function FeedItem({
  post,
  onLike = dummyFunctions.onFeedPostLike,
  onComment = dummyFunctions.onFeedPostComment,
}: FeedItemProps) {
  const typeColor = getTypeColor(post.type);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: post.user.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.headerText}>
          <View style={styles.nameRow}>
            <ThemedText style={styles.userName}>{post.user.name}</ThemedText>
            <ThemedText style={styles.typeLabel}>{getTypeLabel(post.type)}</ThemedText>
          </View>
          <ThemedText style={styles.timestamp}>{post.timestamp}</ThemedText>
        </View>
      </View>

      {/* Content */}
      <ThemedText style={styles.content}>{post.content}</ThemedText>

      {/* Stats (if available) */}
      {post.stats && (
        <View style={[styles.statsContainer, { borderLeftColor: typeColor }]}>
          {post.stats.duration && (
            <View style={styles.statItem}>
              <IconSymbol name="clock.fill" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.statText}>{post.stats.duration}</ThemedText>
            </View>
          )}
          {post.stats.calories && (
            <View style={styles.statItem}>
              <IconSymbol name="flame.fill" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.statText}>{post.stats.calories} cal</ThemedText>
            </View>
          )}
          {post.stats.exercises && (
            <View style={styles.statItem}>
              <IconSymbol name="dumbbell.fill" size={14} color={AbalColors.textSecondary} />
              <ThemedText style={styles.statText}>{post.stats.exercises} exercises</ThemedText>
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => onLike(post.id)}
          style={styles.actionButton}
          hitSlop={8}
        >
          <IconSymbol
            name="hand.thumbsup.fill"
            size={18}
            color={post.hasLiked ? AbalColors.primary : AbalColors.textMuted}
          />
          <ThemedText style={[styles.actionText, post.hasLiked && styles.actionTextActive]}>
            {post.likes}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => onComment(post.id)}
          style={styles.actionButton}
          hitSlop={8}
        >
          <IconSymbol name="bubble.right.fill" size={18} color={AbalColors.textMuted} />
          <ThemedText style={styles.actionText}>{post.comments}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AbalColors.divider,
  },
  headerText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  typeLabel: {
    fontSize: 14,
    color: AbalColors.textSecondary,
  },
  timestamp: {
    fontSize: 12,
    color: AbalColors.textMuted,
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: AbalColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 3,
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AbalColors.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    color: AbalColors.textMuted,
    fontWeight: '500',
  },
  actionTextActive: {
    color: AbalColors.primary,
  },
});



