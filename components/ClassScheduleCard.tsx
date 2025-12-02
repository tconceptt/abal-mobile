import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ClassInfo {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  instructor: string;
  location: string;
  icon: IconSymbolName;
  color: string;
  spotsLeft: number;
}

interface DaySchedule {
  day: string;
  shortDay: string;
  date: number;
  month: string;
  classes: ClassInfo[];
}

// Weekly timetable data
const weeklySchedule: DaySchedule[] = [
  {
    day: 'Monday',
    shortDay: 'Mon',
    date: 2,
    month: 'Dec',
    classes: [
      { id: 'mon-1', name: 'Yoga Flow', startTime: '07:00 AM', endTime: '07:45 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 8 },
      { id: 'mon-2', name: 'HIIT', startTime: '09:30 AM', endTime: '10:30 AM', instructor: 'Mike Brown', location: 'Main Gym', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 5 },
      { id: 'mon-3', name: 'Spin Class', startTime: '12:00 PM', endTime: '01:00 PM', instructor: 'Emily Davis', location: 'Studio B', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 3 },
      { id: 'mon-4', name: 'Zumba', startTime: '06:30 PM', endTime: '07:30 PM', instructor: 'Chris Green', location: 'Studio A', icon: 'music.note', color: '#F472B6', spotsLeft: 0 },
    ],
  },
  {
    day: 'Tuesday',
    shortDay: 'Tue',
    date: 3,
    month: 'Dec',
    classes: [
      { id: 'tue-1', name: 'Morning Yoga', startTime: '06:30 AM', endTime: '07:30 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 10 },
      { id: 'tue-2', name: 'Dance Fitness', startTime: '09:00 AM', endTime: '10:00 AM', instructor: 'Jasmine Taylor', location: 'Studio B', icon: 'music.note', color: '#EC4899', spotsLeft: 8 },
      { id: 'tue-3', name: 'Group Strength', startTime: '12:00 PM', endTime: '01:00 PM', instructor: 'Marcus Jones', location: 'Main Gym', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 15 },
      { id: 'tue-4', name: 'Aerobics', startTime: '05:00 PM', endTime: '06:00 PM', instructor: 'Maria Kim', location: 'Studio A', icon: 'figure.run', color: '#F59E0B', spotsLeft: 6 },
      { id: 'tue-5', name: 'HIIT', startTime: '07:00 PM', endTime: '08:00 PM', instructor: 'Chris Green', location: 'Main Gym', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 4 },
    ],
  },
  {
    day: 'Wednesday',
    shortDay: 'Wed',
    date: 4,
    month: 'Dec',
    classes: [
      { id: 'wed-1', name: 'Pilates', startTime: '07:00 AM', endTime: '08:00 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 12 },
      { id: 'wed-2', name: 'Spin Class', startTime: '10:00 AM', endTime: '11:00 AM', instructor: 'Alex Rivera', location: 'Studio B', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 5 },
      { id: 'wed-3', name: 'Zumba', startTime: '12:30 PM', endTime: '01:30 PM', instructor: 'Diana Martinez', location: 'Studio A', icon: 'music.note', color: '#F472B6', spotsLeft: 10 },
      { id: 'wed-4', name: 'Group Strength', startTime: '05:30 PM', endTime: '06:30 PM', instructor: 'Marcus Jones', location: 'Main Gym', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 0 },
    ],
  },
  {
    day: 'Thursday',
    shortDay: 'Thu',
    date: 5,
    month: 'Dec',
    classes: [
      { id: 'thu-1', name: 'Yoga Flow', startTime: '06:30 AM', endTime: '07:30 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 14 },
      { id: 'thu-2', name: 'HIIT', startTime: '09:00 AM', endTime: '10:00 AM', instructor: 'Mike Brown', location: 'Main Gym', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 7 },
      { id: 'thu-3', name: 'Dance Fitness', startTime: '11:00 AM', endTime: '12:00 PM', instructor: 'Jasmine Taylor', location: 'Studio B', icon: 'music.note', color: '#EC4899', spotsLeft: 9 },
      { id: 'thu-4', name: 'Spin Class', startTime: '06:30 PM', endTime: '07:30 PM', instructor: 'Alex Rivera', location: 'Studio B', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 2 },
    ],
  },
  {
    day: 'Friday',
    shortDay: 'Fri',
    date: 6,
    month: 'Dec',
    classes: [
      { id: 'fri-1', name: 'Aerobics', startTime: '07:00 AM', endTime: '08:00 AM', instructor: 'Maria Kim', location: 'Studio A', icon: 'figure.run', color: '#F59E0B', spotsLeft: 10 },
      { id: 'fri-2', name: 'Pilates', startTime: '10:00 AM', endTime: '11:00 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 12 },
      { id: 'fri-3', name: 'Zumba', startTime: '12:00 PM', endTime: '01:00 PM', instructor: 'Diana Martinez', location: 'Studio B', icon: 'music.note', color: '#F472B6', spotsLeft: 8 },
      { id: 'fri-4', name: 'HIIT', startTime: '05:00 PM', endTime: '06:00 PM', instructor: 'Chris Green', location: 'Main Gym', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 6 },
      { id: 'fri-5', name: 'Group Strength', startTime: '07:00 PM', endTime: '08:00 PM', instructor: 'Marcus Jones', location: 'Main Gym', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 0 },
    ],
  },
  {
    day: 'Saturday',
    shortDay: 'Sat',
    date: 7,
    month: 'Dec',
    classes: [
      { id: 'sat-1', name: 'Sunrise Yoga', startTime: '08:00 AM', endTime: '09:15 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 15 },
      { id: 'sat-2', name: 'Spin Class', startTime: '10:00 AM', endTime: '11:00 AM', instructor: 'Alex Rivera', location: 'Studio B', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 5 },
      { id: 'sat-3', name: 'Dance Fitness', startTime: '12:00 PM', endTime: '01:00 PM', instructor: 'Jasmine Taylor', location: 'Studio B', icon: 'music.note', color: '#EC4899', spotsLeft: 10 },
      { id: 'sat-4', name: 'Zumba Party', startTime: '03:00 PM', endTime: '04:30 PM', instructor: 'Diana Martinez', location: 'Studio A', icon: 'music.note', color: '#F472B6', spotsLeft: 20 },
    ],
  },
  {
    day: 'Sunday',
    shortDay: 'Sun',
    date: 8,
    month: 'Dec',
    classes: [
      { id: 'sun-1', name: 'Gentle Yoga', startTime: '09:00 AM', endTime: '10:00 AM', instructor: 'Sarah Johnson', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 12 },
      { id: 'sun-2', name: 'Pilates', startTime: '11:00 AM', endTime: '12:00 PM', instructor: 'Maria Kim', location: 'Studio A', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 8 },
      { id: 'sun-3', name: 'Aerobics', startTime: '02:00 PM', endTime: '03:00 PM', instructor: 'Emily Davis', location: 'Main Gym', icon: 'figure.run', color: '#F59E0B', spotsLeft: 10 },
    ],
  },
];

function ClassCard({ classInfo }: { classInfo: ClassInfo }) {
  const isFull = classInfo.spotsLeft === 0;

  return (
    <View style={styles.classCard}>
      {/* Left icon */}
      <View style={[styles.classIconContainer, { backgroundColor: `${classInfo.color}12` }]}>
        <IconSymbol name={classInfo.icon} size={24} color={classInfo.color} />
      </View>

      {/* Class details */}
      <View style={styles.classDetails}>
        <ThemedText style={styles.className}>{classInfo.name}</ThemedText>
        <ThemedText style={styles.classLocation}>{classInfo.location}</ThemedText>
        <ThemedText style={styles.classInstructor}>{classInfo.instructor}</ThemedText>
        <ThemedText style={styles.classTime}>
          {classInfo.startTime} - {classInfo.endTime}
        </ThemedText>
      </View>

      {/* Book button or Full indicator */}
      {isFull ? (
        <View style={styles.fullBadge}>
          <ThemedText style={styles.fullBadgeText}>Full</ThemedText>
        </View>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            pressed && styles.bookButtonPressed,
          ]}
        >
          <ThemedText style={styles.bookButtonText}>Book</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

function DayTab({
  schedule,
  isActive,
  onPress,
}: {
  schedule: DaySchedule;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.dayTab, isActive && styles.dayTabActive]}
    >
      <ThemedText style={[styles.dayTabShort, isActive && styles.dayTabTextActive]}>
        {schedule.shortDay}
      </ThemedText>
      <ThemedText style={[styles.dayTabDate, isActive && styles.dayTabDateActive]}>
        {schedule.month} {schedule.date}
      </ThemedText>
    </Pressable>
  );
}

export function ClassScheduleCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const todaySchedule = weeklySchedule[0];
  const nextClass = todaySchedule.classes[0];
  const selectedDay = weeklySchedule[selectedDayIndex];

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <View style={styles.calendarIcon}>
              <IconSymbol name="calendar" size={20} color={AbalColors.primary} />
            </View>
            <ThemedText style={styles.title}>Class Schedule</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={18} color={AbalColors.textMuted} />
        </View>

        {/* Next class preview */}
        <View style={styles.nextClassPreview}>
          <View style={[styles.previewIcon, { backgroundColor: `${nextClass.color}15` }]}>
            <IconSymbol name={nextClass.icon} size={18} color={nextClass.color} />
          </View>
          <View style={styles.previewContent}>
            <ThemedText style={styles.upNextLabel}>UP NEXT</ThemedText>
            <ThemedText style={styles.previewClassName}>{nextClass.name}</ThemedText>
            <ThemedText style={styles.previewTime}>
              {nextClass.startTime} · {nextClass.location}
            </ThemedText>
          </View>
          <View style={styles.classCountBadge}>
            <ThemedText style={styles.classCountText}>{todaySchedule.classes.length}</ThemedText>
            <ThemedText style={styles.classCountLabel}>today</ThemedText>
          </View>
        </View>
      </Pressable>

      {/* Full Schedule Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => setModalVisible(false)}
          />
          <View style={[styles.modalContent, { paddingTop: insets.top }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <ThemedText style={styles.modalTitle}>Class Schedule</ThemedText>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                  hitSlop={12}
                >
                  <IconSymbol name="xmark" size={24} color={AbalColors.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Day Tabs */}
            <View style={styles.dayTabsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayTabsContainer}
              >
                {weeklySchedule.map((schedule, index) => (
                  <DayTab
                    key={schedule.day}
                    schedule={schedule}
                    isActive={selectedDayIndex === index}
                    onPress={() => setSelectedDayIndex(index)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Classes List */}
            <ScrollView
              style={styles.classesScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.classesContent,
                { paddingBottom: insets.bottom + Spacing.lg },
              ]}
            >
              {selectedDay.classes.length === 0 ? (
                <View style={styles.emptyState}>
                  <IconSymbol name="calendar" size={48} color={AbalColors.textMuted} />
                  <ThemedText style={styles.emptyStateText}>
                    No classes scheduled for this day
                  </ThemedText>
                </View>
              ) : (
                selectedDay.classes.map((classInfo) => (
                  <ClassCard key={classInfo.id} classInfo={classInfo} />
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    ...Shadows.card,
  },
  containerPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: `${AbalColors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  nextClassPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AbalColors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  previewContent: {
    flex: 1,
  },
  upNextLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    color: AbalColors.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  previewClassName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  previewTime: {
    fontSize: 13,
    lineHeight: 18,
    color: AbalColors.textSecondary,
  },
  classCountBadge: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  classCountText: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  classCountLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: AbalColors.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: AbalColors.background,
    marginTop: 60,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  modalHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: AbalColors.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AbalColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Day Tabs
  dayTabsWrapper: {
    backgroundColor: AbalColors.cardBackground,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.divider,
  },
  dayTabsContainer: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  dayTab: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: AbalColors.background,
    minWidth: 64,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayTabActive: {
    backgroundColor: `${AbalColors.primary}15`,
    borderColor: AbalColors.primary,
  },
  dayTabShort: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: AbalColors.textSecondary,
  },
  dayTabTextActive: {
    color: AbalColors.textPrimary,
  },
  dayTabDate: {
    fontSize: 12,
    lineHeight: 16,
    color: AbalColors.textMuted,
    marginTop: 2,
  },
  dayTabDateActive: {
    color: AbalColors.textSecondary,
  },
  // Classes list
  classesScrollView: {
    flex: 1,
  },
  classesContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  classIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    marginBottom: 2,
  },
  classLocation: {
    fontSize: 14,
    lineHeight: 20,
    color: AbalColors.textSecondary,
  },
  classInstructor: {
    fontSize: 13,
    lineHeight: 18,
    color: AbalColors.textMuted,
    marginBottom: 4,
  },
  classTime: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  bookButton: {
    backgroundColor: AbalColors.primary,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.sm,
  },
  bookButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  bookButtonText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  fullBadge: {
    backgroundColor: AbalColors.textMuted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.sm,
  },
  fullBadgeText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: AbalColors.cardBackground,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyStateText: {
    fontSize: 16,
    lineHeight: 22,
    color: AbalColors.textMuted,
    textAlign: 'center',
  },
});
