import React, { useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeedItem } from '@/components/FeedItem';
import { ThemedText } from '@/components/themed-text';
import { FeedPost, mockFeedPosts } from '@/constants/mock-data';
import { AbalColors, BorderRadius, Spacing } from '@/constants/theme';

type FilterType = 'all' | 'workouts' | 'milestones' | 'checkins';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'workouts', label: 'Workouts' },
  { key: 'milestones', label: 'Milestones' },
  { key: 'checkins', label: 'Check-ins' },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'workouts') return post.type === 'workout' || post.type === 'class';
    if (activeFilter === 'milestones') return post.type === 'milestone' || post.type === 'achievement';
    if (activeFilter === 'checkins') return post.type === 'checkin';
    return true;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            hasLiked: !post.hasLiked,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Community Feed</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          See what other members are up to
        </ThemedText>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {FILTERS.map((filter) => (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[
                styles.filterButton,
                activeFilter === filter.key && styles.filterButtonActive,
              ]}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  activeFilter === filter.key && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Feed */}
      <ScrollView
        style={styles.feedContainer}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={AbalColors.primary}
          />
        }
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <FeedItem key={post.id} post={post} onLike={handleLike} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No posts in this category yet
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginTop: 4,
  },
  filterContainer: {
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  filterScrollContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: AbalColors.divider,
  },
  filterButtonActive: {
    backgroundColor: AbalColors.textPrimary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    paddingTop: Spacing.md,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: AbalColors.textMuted,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});


