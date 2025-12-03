import React, { useMemo, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { WeightEntry } from '@/context/UserContext';

const CHART_COLOR = '#4ADE80'; // Fresh green color matching mockup
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TimeFilter = '7days' | '30days' | '90days' | 'year' | 'all';

interface TimeFilterOption {
  key: TimeFilter;
  label: string;
  shortLabel: string;
}

const TIME_FILTERS: TimeFilterOption[] = [
  { key: '7days', label: 'Last 7 Days', shortLabel: '7 Days' },
  { key: '30days', label: 'Last 30 Days', shortLabel: '30 Days' },
  { key: '90days', label: 'Last 90 Days', shortLabel: '90 Days' },
  { key: 'year', label: 'Last Year', shortLabel: '1 Year' },
  { key: 'all', label: 'All Time', shortLabel: 'All' },
];

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface WeightProgressCardProps {
  weightHistory: WeightEntry[];
  onAddEntry: () => void;
  onViewAll?: () => void;
}

interface ChartDataPoint {
  value: number;
  label: string;
  dataPointText?: string;
}

// Helper to normalize date to YYYY-MM-DD string
function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse date string to Date object
function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Get last 7 days data with day initials
function getLast7DaysData(entries: WeightEntry[]): ChartDataPoint[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const result: ChartDataPoint[] = [];
  
  // Create a map of entries by date for quick lookup
  const entryMap = new Map<string, WeightEntry>();
  entries.forEach(entry => {
    // If multiple entries on same day, keep the latest one
    const existing = entryMap.get(entry.date);
    if (!existing) {
      entryMap.set(entry.date, entry);
    }
  });
  
  // Iterate through last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = toDateString(date);
    const dayOfWeek = date.getDay();
    
    const dayEntry = entryMap.get(dateStr);
    
    if (dayEntry) {
      const isLast = i === 0 || !hasLaterEntry(entries, dateStr, now);
      result.push({
        value: dayEntry.weight,
        label: DAY_INITIALS[dayOfWeek],
        dataPointText: isLast ? `${dayEntry.weight.toFixed(0)}` : undefined,
      });
    }
  }
  
  // Mark the actual last entry with dataPointText
  if (result.length > 0) {
    // Clear all dataPointText first
    result.forEach(r => r.dataPointText = undefined);
    // Set on last item
    result[result.length - 1].dataPointText = `${result[result.length - 1].value.toFixed(0)}`;
  }
  
  return result;
}

// Check if there's a later entry after this date
function hasLaterEntry(entries: WeightEntry[], dateStr: string, maxDate: Date): boolean {
  const currentDate = parseDate(dateStr);
  return entries.some(e => {
    const entryDate = parseDate(e.date);
    return entryDate > currentDate && entryDate <= maxDate;
  });
}

// Get weekly data for last 30/90 days - last logged weight per week
function getWeeklyData(entries: WeightEntry[], days: number): ChartDataPoint[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  const filteredEntries = entries
    .filter(e => parseDate(e.date) >= cutoff)
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  
  if (filteredEntries.length === 0) return [];
  
  // Group by week
  const weekGroups: { [weekKey: string]: { entries: WeightEntry[]; weekStart: Date } } = {};
  
  filteredEntries.forEach(entry => {
    const date = parseDate(entry.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = toDateString(weekStart);
    
    if (!weekGroups[weekKey]) {
      weekGroups[weekKey] = { entries: [], weekStart };
    }
    weekGroups[weekKey].entries.push(entry);
  });
  
  // Get last entry of each week, sorted by week
  const weeklyData = Object.entries(weekGroups)
    .sort((a, b) => a[1].weekStart.getTime() - b[1].weekStart.getTime())
    .map(([_, data], index, arr) => {
      // Sort entries within week by date and get the last one
      const sortedEntries = data.entries.sort(
        (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
      );
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      const weekStart = data.weekStart;
      
      // Format label as "Mon D" for the start of the week
      const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        value: lastEntry.weight,
        label: label,
        dataPointText: index === arr.length - 1 ? `${lastEntry.weight.toFixed(0)}` : undefined,
      };
    });
  
  return weeklyData;
}

// Get monthly data for year/all time - last logged weight per month
function getMonthlyData(entries: WeightEntry[], filter: TimeFilter): ChartDataPoint[] {
  const now = new Date();
  let cutoff: Date;
  
  if (filter === 'year') {
    cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  } else {
    // All time - use earliest possible date
    cutoff = new Date(2000, 0, 1);
  }
  
  const filteredEntries = entries
    .filter(e => parseDate(e.date) >= cutoff)
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  
  if (filteredEntries.length === 0) return [];
  
  // Group by month
  const monthGroups: { [monthKey: string]: { entries: WeightEntry[]; monthDate: Date } } = {};
  
  filteredEntries.forEach(entry => {
    const date = parseDate(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
    
    if (!monthGroups[monthKey]) {
      monthGroups[monthKey] = { entries: [], monthDate: new Date(date.getFullYear(), date.getMonth(), 1) };
    }
    monthGroups[monthKey].entries.push(entry);
  });
  
  // Get last entry of each month, sorted by month
  const monthlyData = Object.entries(monthGroups)
    .sort((a, b) => a[1].monthDate.getTime() - b[1].monthDate.getTime())
    .map(([_, data], index, arr) => {
      // Sort entries within month by date and get the last one
      const sortedEntries = data.entries.sort(
        (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
      );
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      
      // Format label as month abbreviation
      const label = data.monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      return {
        value: lastEntry.weight,
        label: label,
        dataPointText: index === arr.length - 1 ? `${lastEntry.weight.toFixed(0)}` : undefined,
      };
    });
  
  return monthlyData;
}

export function WeightProgressCard({ 
  weightHistory, 
  onAddEntry,
  onViewAll,
}: WeightProgressCardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30days');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const currentFilterOption = TIME_FILTERS.find(f => f.key === timeFilter)!;

  // Get the actual latest weight from history (sorted by date)
  const actualLatestWeight = useMemo(() => {
    if (weightHistory.length === 0) return null;
    const sorted = [...weightHistory].sort(
      (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
    );
    return sorted[0].weight;
  }, [weightHistory]);

  // Prepare chart data based on time filter
  const { chartData, firstWeight, lastWeight, isEmpty } = useMemo(() => {
    if (weightHistory.length === 0) {
      return { chartData: [], firstWeight: null, lastWeight: null, isEmpty: true };
    }

    const sortedHistory = [...weightHistory].sort(
      (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
    );

    let data: ChartDataPoint[] = [];

    switch (timeFilter) {
      case '7days':
        data = getLast7DaysData(sortedHistory);
        break;
      case '30days':
        data = getWeeklyData(sortedHistory, 30);
        break;
      case '90days':
        data = getWeeklyData(sortedHistory, 90);
        break;
      case 'year':
      case 'all':
        data = getMonthlyData(sortedHistory, timeFilter);
        break;
    }

    if (data.length === 0) {
      return { chartData: [], firstWeight: null, lastWeight: null, isEmpty: true };
    }

    return {
      chartData: data,
      firstWeight: data[0].value,
      lastWeight: data[data.length - 1].value,
      isEmpty: false,
    };
  }, [weightHistory, timeFilter]);

  // Calculate weight change within the selected period
  const weightChange = firstWeight !== null && lastWeight !== null 
    ? lastWeight - firstWeight 
    : null;

  const chartWidth = SCREEN_WIDTH - Spacing.md * 4 - 20;
  
  // Calculate spacing based on number of data points
  const spacing = chartData.length > 1 
    ? Math.max((chartWidth - 60) / (chartData.length - 1), 35)
    : chartWidth / 2;

  const handleSelectFilter = (filter: TimeFilter) => {
    setTimeFilter(filter);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Card Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Weight Progress</ThemedText>
        <Pressable style={styles.addButton} onPress={onAddEntry}>
          <IconSymbol name="plus" size={18} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Time Filter Dropdown */}
      <Pressable 
        style={styles.filterButton}
        onPress={() => setDropdownVisible(true)}
      >
        <ThemedText style={styles.filterButtonText}>{currentFilterOption.label}</ThemedText>
        <IconSymbol name="chevron.down" size={14} color={AbalColors.textSecondary} />
      </Pressable>

      {/* Chart Area */}
      {isEmpty ? (
        <View style={styles.emptyState}>
          <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={AbalColors.textMuted} />
          <ThemedText style={styles.emptyStateText}>
            No weight data for this period.
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>
            Add your first entry to start tracking!
          </ThemedText>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={160}
            color={CHART_COLOR}
            thickness={2.5}
            dataPointsColor={CHART_COLOR}
            dataPointsRadius={5}
            curved
            curvature={0.15}
            startFillColor={`${CHART_COLOR}40`}
            endFillColor={`${CHART_COLOR}05`}
            startOpacity={0.8}
            endOpacity={0.1}
            areaChart
            yAxisColor="transparent"
            xAxisColor={AbalColors.border}
            xAxisThickness={1}
            yAxisTextStyle={styles.yAxisText}
            xAxisLabelTextStyle={styles.xAxisText}
            yAxisSide={0}
            noOfSections={4}
            yAxisLabelWidth={40}
            spacing={spacing}
            initialSpacing={15}
            endSpacing={15}
            isAnimated
            animationDuration={600}
            hideRules={false}
            rulesType="solid"
            rulesColor={`${AbalColors.border}50`}
            rulesThickness={1}
            showValuesAsDataPointsText
            textShiftY={-14}
            textShiftX={0}
            textColor={CHART_COLOR}
            textFontSize={11}
            hideDataPoints={chartData.length > 12}
            focusEnabled
            showDataPointOnFocus
            showStripOnFocus
            stripColor={`${CHART_COLOR}30`}
            stripWidth={2}
            focusedDataPointColor={CHART_COLOR}
            focusedDataPointRadius={7}
            delayBeforeUnFocus={2000}
            formatYLabel={(label) => parseFloat(label).toFixed(0)}
          />
        </View>
      )}

      {/* Summary Footer */}
      {!isEmpty && actualLatestWeight !== null && (
        <View style={styles.summaryFooter}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Current Weight: </ThemedText>
            <ThemedText style={styles.summaryValue}>{actualLatestWeight.toFixed(1)} lbs</ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Change: </ThemedText>
            <ThemedText style={[
              styles.summaryValue,
              weightChange !== null && weightChange < 0 && styles.summaryValueNegative,
              weightChange !== null && weightChange > 0 && styles.summaryValuePositive,
            ]}>
              {weightChange !== null 
                ? `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} lbs`
                : '--'
              }
            </ThemedText>
          </View>
        </View>
      )}

      {/* View All Link */}
      {weightHistory.length > 0 && onViewAll && (
        <Pressable style={styles.viewAllButton} onPress={onViewAll}>
          <ThemedText style={styles.viewAllText}>View All Entries</ThemedText>
          <IconSymbol name="chevron.right" size={14} color={AbalColors.primary} />
        </Pressable>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <ThemedText style={styles.dropdownTitle}>Select Time Range</ThemedText>
            </View>
            {TIME_FILTERS.map((filter) => (
              <Pressable
                key={filter.key}
                style={[
                  styles.dropdownItem,
                  timeFilter === filter.key && styles.dropdownItemActive,
                ]}
                onPress={() => handleSelectFilter(filter.key)}
              >
                <ThemedText style={[
                  styles.dropdownItemText,
                  timeFilter === filter.key && styles.dropdownItemTextActive,
                ]}>
                  {filter.label}
                </ThemedText>
                {timeFilter === filter.key && (
                  <IconSymbol name="checkmark" size={18} color={CHART_COLOR} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  addButton: {
    backgroundColor: CHART_COLOR,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: AbalColors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 6,
    marginBottom: Spacing.md,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: AbalColors.textPrimary,
  },
  chartWrapper: {
    marginHorizontal: -Spacing.sm,
    paddingTop: Spacing.sm,
  },
  yAxisText: {
    color: AbalColors.textSecondary,
    fontSize: 11,
  },
  xAxisText: {
    color: AbalColors.textSecondary,
    fontSize: 11,
    width: 45,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.sm,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginTop: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AbalColors.border,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: AbalColors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  summaryValueNegative: {
    color: CHART_COLOR,
  },
  summaryValuePositive: {
    color: '#EF4444',
  },
  summaryDivider: {
    width: 1,
    height: 16,
    backgroundColor: AbalColors.border,
    marginHorizontal: Spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  dropdownContainer: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 320,
    ...Shadows.card,
    overflow: 'hidden',
  },
  dropdownHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  dropdownTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  dropdownItemActive: {
    backgroundColor: `${CHART_COLOR}10`,
  },
  dropdownItemText: {
    fontSize: 15,
    color: AbalColors.textPrimary,
  },
  dropdownItemTextActive: {
    fontWeight: '600',
    color: CHART_COLOR,
  },
});
