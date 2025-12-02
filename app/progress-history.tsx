import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser, WeightEntry } from '@/context/UserContext';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatWeight(weight: number): string {
  return weight.toFixed(1);
}

interface WeightEntryWithChange extends WeightEntry {
  change: number | null;
}

export default function ProgressHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { weightHistory, deleteWeightEntry } = useUser();

  // Sort by date descending (most recent first) and calculate changes
  const entriesWithChanges: WeightEntryWithChange[] = useMemo(() => {
    const sorted = [...weightHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted.map((entry, index) => {
      // The next entry in sorted array is the previous entry chronologically
      const previousEntry = sorted[index + 1];
      const change = previousEntry ? entry.weight - previousEntry.weight : null;
      return { ...entry, change };
    });
  }, [weightHistory]);

  const handleDelete = (entry: WeightEntry) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete the entry from ${formatDate(entry.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWeightEntry(entry.id),
        },
      ]
    );
  };

  const getChangeColor = (change: number | null) => {
    if (change === null) return AbalColors.textMuted;
    if (change < 0) return '#10B981'; // Green for loss
    if (change > 0) return '#EF4444'; // Red for gain
    return AbalColors.textMuted;
  };

  const getChangeText = (change: number | null) => {
    if (change === null) return '—';
    if (change === 0) return '0.0';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Weight History',
          headerShown: true,
          headerStyle: { backgroundColor: AbalColors.cardBackground },
          headerTintColor: AbalColors.textPrimary,
          headerShadowVisible: false,
        }}
      />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Summary Header */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <ThemedText style={styles.summaryLabel}>Total Entries</ThemedText>
            <ThemedText style={styles.summaryValue}>{weightHistory.length}</ThemedText>
          </View>
          {weightHistory.length >= 2 && (
            <>
              <View style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>First</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formatWeight(entriesWithChanges[entriesWithChanges.length - 1]?.weight || 0)}
                </ThemedText>
              </View>
              <View style={styles.summaryCard}>
                <ThemedText style={styles.summaryLabel}>Latest</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  {formatWeight(entriesWithChanges[0]?.weight || 0)}
                </ThemedText>
              </View>
            </>
          )}
        </View>

        {/* Entries List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {entriesWithChanges.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="scalemass.fill" size={48} color={AbalColors.textMuted} />
              <ThemedText style={styles.emptyTitle}>No Entries Yet</ThemedText>
              <ThemedText style={styles.emptyText}>
                Start tracking your weight to see your history here.
              </ThemedText>
              <Pressable style={styles.goBackButton} onPress={() => router.back()}>
                <ThemedText style={styles.goBackText}>Go Back</ThemedText>
              </Pressable>
            </View>
          ) : (
            entriesWithChanges.map((entry, index) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryMain}>
                  <View style={styles.entryDate}>
                    <ThemedText style={styles.dateText}>{formatDate(entry.date)}</ThemedText>
                    {index === 0 && (
                      <View style={styles.latestBadge}>
                        <ThemedText style={styles.latestText}>Latest</ThemedText>
                      </View>
                    )}
                  </View>
                  <View style={styles.entryWeight}>
                    <ThemedText style={styles.weightValue}>{formatWeight(entry.weight)}</ThemedText>
                    <ThemedText style={styles.weightUnit}>lbs</ThemedText>
                  </View>
                </View>
                <View style={styles.entryFooter}>
                  <View style={styles.changeContainer}>
                    {entry.change !== null && entry.change !== 0 && (
                      <IconSymbol
                        name={entry.change < 0 ? 'arrow.down' : 'arrow.up'}
                        size={12}
                        color={getChangeColor(entry.change)}
                      />
                    )}
                    <ThemedText style={[styles.changeText, { color: getChangeColor(entry.change) }]}>
                      {getChangeText(entry.change)} lbs
                    </ThemedText>
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleDelete(entry)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <IconSymbol name="trash" size={18} color={AbalColors.textMuted} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbalColors.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: AbalColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: AbalColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  goBackButton: {
    backgroundColor: AbalColors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  entryMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  entryDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: AbalColors.textPrimary,
  },
  latestBadge: {
    backgroundColor: AbalColors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  latestText: {
    fontSize: 11,
    fontWeight: '600',
    color: AbalColors.primary,
  },
  entryWeight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightValue: {
    fontSize: 22,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  weightUnit: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginLeft: 4,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AbalColors.divider,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});



