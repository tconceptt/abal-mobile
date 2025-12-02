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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

interface ClassInfo {
  id: string;
  name: string;
  time: string;
  duration: string;
  instructor: string;
  icon: IconSymbolName;
  color: string;
  spotsLeft?: number;
}

interface DaySchedule {
  day: string;
  shortDay: string;
  date: string;
  classes: ClassInfo[];
}

// Weekly timetable data
const weeklySchedule: DaySchedule[] = [
  {
    day: 'Monday',
    shortDay: 'Mon',
    date: 'Dec 2',
    classes: [
      { id: 'mon-1', name: 'Aerobics', time: '7:00 AM', duration: '45 min', instructor: 'Maria K.', icon: 'figure.run', color: '#F59E0B', spotsLeft: 8 },
      { id: 'mon-2', name: 'Dance Fitness', time: '9:00 AM', duration: '50 min', instructor: 'Jasmine T.', icon: 'music.note', color: '#EC4899', spotsLeft: 5 },
      { id: 'mon-3', name: 'Group Strength', time: '11:00 AM', duration: '55 min', instructor: 'Marcus J.', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 12 },
      { id: 'mon-4', name: 'Spin Class', time: '2:00 PM', duration: '45 min', instructor: 'Alex R.', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 3 },
      { id: 'mon-5', name: 'Yoga Flow', time: '4:30 PM', duration: '60 min', instructor: 'Sarah L.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 15 },
      { id: 'mon-6', name: 'HIIT Training', time: '6:00 PM', duration: '40 min', instructor: 'Chris P.', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 2 },
    ],
  },
  {
    day: 'Tuesday',
    shortDay: 'Tue',
    date: 'Dec 3',
    classes: [
      { id: 'tue-1', name: 'Morning Yoga', time: '6:30 AM', duration: '60 min', instructor: 'Sarah L.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 10 },
      { id: 'tue-2', name: 'Zumba', time: '9:00 AM', duration: '50 min', instructor: 'Diana M.', icon: 'music.note', color: '#F472B6', spotsLeft: 8 },
      { id: 'tue-3', name: 'Core Blast', time: '12:00 PM', duration: '30 min', instructor: 'Marcus J.', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 15 },
      { id: 'tue-4', name: 'Dance Fitness', time: '5:00 PM', duration: '50 min', instructor: 'Jasmine T.', icon: 'music.note', color: '#EC4899', spotsLeft: 6 },
      { id: 'tue-5', name: 'Group Strength', time: '7:00 PM', duration: '55 min', instructor: 'Chris P.', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 4 },
    ],
  },
  {
    day: 'Wednesday',
    shortDay: 'Wed',
    date: 'Dec 4',
    classes: [
      { id: 'wed-1', name: 'Aerobics', time: '7:00 AM', duration: '45 min', instructor: 'Maria K.', icon: 'figure.run', color: '#F59E0B', spotsLeft: 12 },
      { id: 'wed-2', name: 'Pilates', time: '10:00 AM', duration: '50 min', instructor: 'Sarah L.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 8 },
      { id: 'wed-3', name: 'Spin Class', time: '12:30 PM', duration: '45 min', instructor: 'Alex R.', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 5 },
      { id: 'wed-4', name: 'HIIT Training', time: '5:30 PM', duration: '40 min', instructor: 'Chris P.', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 3 },
      { id: 'wed-5', name: 'Zumba', time: '7:30 PM', duration: '50 min', instructor: 'Diana M.', icon: 'music.note', color: '#F472B6', spotsLeft: 10 },
    ],
  },
  {
    day: 'Thursday',
    shortDay: 'Thu',
    date: 'Dec 5',
    classes: [
      { id: 'thu-1', name: 'Morning Yoga', time: '6:30 AM', duration: '60 min', instructor: 'Sarah L.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 14 },
      { id: 'thu-2', name: 'Dance Fitness', time: '9:00 AM', duration: '50 min', instructor: 'Jasmine T.', icon: 'music.note', color: '#EC4899', spotsLeft: 7 },
      { id: 'thu-3', name: 'Group Strength', time: '11:00 AM', duration: '55 min', instructor: 'Marcus J.', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 9 },
      { id: 'thu-4', name: 'Aerobics', time: '4:00 PM', duration: '45 min', instructor: 'Maria K.', icon: 'figure.run', color: '#F59E0B', spotsLeft: 11 },
      { id: 'thu-5', name: 'Spin Class', time: '6:30 PM', duration: '45 min', instructor: 'Alex R.', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 2 },
    ],
  },
  {
    day: 'Friday',
    shortDay: 'Fri',
    date: 'Dec 6',
    classes: [
      { id: 'fri-1', name: 'Aerobics', time: '7:00 AM', duration: '45 min', instructor: 'Maria K.', icon: 'figure.run', color: '#F59E0B', spotsLeft: 10 },
      { id: 'fri-2', name: 'Core Blast', time: '10:00 AM', duration: '30 min', instructor: 'Marcus J.', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 12 },
      { id: 'fri-3', name: 'Zumba', time: '12:00 PM', duration: '50 min', instructor: 'Diana M.', icon: 'music.note', color: '#F472B6', spotsLeft: 8 },
      { id: 'fri-4', name: 'Dance Fitness', time: '5:00 PM', duration: '50 min', instructor: 'Jasmine T.', icon: 'music.note', color: '#EC4899', spotsLeft: 4 },
      { id: 'fri-5', name: 'HIIT Training', time: '7:00 PM', duration: '40 min', instructor: 'Chris P.', icon: 'bolt.fill', color: '#EF4444', spotsLeft: 6 },
    ],
  },
  {
    day: 'Saturday',
    shortDay: 'Sat',
    date: 'Dec 7',
    classes: [
      { id: 'sat-1', name: 'Morning Yoga', time: '8:00 AM', duration: '75 min', instructor: 'Sarah L.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 15 },
      { id: 'sat-2', name: 'Spin Class', time: '10:00 AM', duration: '60 min', instructor: 'Alex R.', icon: 'figure.indoor.cycle', color: '#10B981', spotsLeft: 5 },
      { id: 'sat-3', name: 'Group Strength', time: '12:00 PM', duration: '55 min', instructor: 'Marcus J.', icon: 'dumbbell.fill', color: '#6366F1', spotsLeft: 10 },
      { id: 'sat-4', name: 'Zumba Party', time: '3:00 PM', duration: '90 min', instructor: 'Diana M.', icon: 'music.note', color: '#F472B6', spotsLeft: 20 },
    ],
  },
  {
    day: 'Sunday',
    shortDay: 'Sun',
    date: 'Dec 8',
    classes: [
      { id: 'sun-1', name: 'Sunrise Yoga', time: '7:00 AM', duration: '60 min', instructor: 'Sarah L.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 12 },
      { id: 'sun-2', name: 'Pilates', time: '9:30 AM', duration: '50 min', instructor: 'Maria K.', icon: 'figure.walk', color: '#8B5CF6', spotsLeft: 8 },
      { id: 'sun-3', name: 'Dance Fitness', time: '11:00 AM', duration: '50 min', instructor: 'Jasmine T.', icon: 'music.note', color: '#EC4899', spotsLeft: 10 },
    ],
  },
];

function ClassTimeSlot({ classInfo }: { classInfo: ClassInfo }) {
  return (
    <View style={styles.timeSlot}>
      {/* Time column */}
      <View style={styles.timeColumn}>
        <ThemedText style={styles.timeText}>{classInfo.time}</ThemedText>
        <ThemedText style={styles.durationText}>{classInfo.duration}</ThemedText>
      </View>

      {/* Class details */}
      <View style={[styles.classCard, { borderLeftColor: classInfo.color }]}>
        <View style={styles.classCardHeader}>
          <View style={[styles.classIconSmall, { backgroundColor: `${classInfo.color}15` }]}>
            <IconSymbol name={classInfo.icon} size={16} color={classInfo.color} />
          </View>
          <View style={styles.classCardTitleContainer}>
            <ThemedText style={styles.classCardTitle}>{classInfo.name}</ThemedText>
            <ThemedText style={styles.instructorText}>with {classInfo.instructor}</ThemedText>
          </View>
          {classInfo.spotsLeft !== undefined && (
            <View style={styles.spotsTag}>
              <ThemedText
                style={[
                  styles.spotsTagText,
                  classInfo.spotsLeft <= 3 && styles.spotsTagLow,
                ]}
              >
                {classInfo.spotsLeft} left
              </ThemedText>
            </View>
          )}
        </View>
      </View>
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
        {schedule.date.split(' ')[1]}
      </ThemedText>
    </Pressable>
  );
}

export function ClassScheduleCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const todaySchedule = weeklySchedule[0]; // Monday as today for demo
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
              {nextClass.time} · {nextClass.duration}
            </ThemedText>
          </View>
          <View style={styles.classCountBadge}>
            <ThemedText style={styles.classCountText}>{todaySchedule.classes.length}</ThemedText>
            <ThemedText style={styles.classCountLabel}>today</ThemedText>
          </View>
        </View>
      </Pressable>

      {/* Full Schedule Modal - Timetable View */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <View style={styles.modalTitleRow}>
                <ThemedText style={styles.modalTitle}>Class Timetable</ThemedText>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                  hitSlop={12}
                >
                  <IconSymbol name="xmark" size={22} color={AbalColors.textSecondary} />
                </Pressable>
              </View>
              <ThemedText style={styles.modalSubtitle}>
                Weekly class schedule
              </ThemedText>
            </View>

            {/* Day Tabs */}
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

            {/* Selected Day Header */}
            <View style={styles.selectedDayHeader}>
              <ThemedText style={styles.selectedDayTitle}>{selectedDay.day}</ThemedText>
              <ThemedText style={styles.selectedDayClassCount}>
                {selectedDay.classes.length} classes
              </ThemedText>
            </View>

            {/* Timetable */}
            <ScrollView
              style={styles.timetableScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.timetableContent,
                { paddingBottom: insets.bottom + Spacing.md },
              ]}
            >
              {selectedDay.classes.map((classInfo) => (
                <ClassTimeSlot key={classInfo.id} classInfo={classInfo} />
              ))}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AbalColors.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    height: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.divider,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: AbalColors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: AbalColors.textSecondary,
  },
  // Day Tabs
  dayTabsContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
  dayTab: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: AbalColors.background,
    minWidth: 56,
  },
  dayTabActive: {
    backgroundColor: AbalColors.primary,
  },
  dayTabShort: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: AbalColors.textSecondary,
  },
  dayTabTextActive: {
    color: AbalColors.textPrimary,
  },
  dayTabDate: {
    fontSize: 11,
    lineHeight: 14,
    color: AbalColors.textMuted,
    marginTop: 2,
  },
  dayTabDateActive: {
    color: AbalColors.textPrimary,
  },
  // Selected Day Header
  selectedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.divider,
  },
  selectedDayTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  selectedDayClassCount: {
    fontSize: 14,
    lineHeight: 20,
    color: AbalColors.textSecondary,
  },
  // Timetable
  timetableScrollView: {
    flex: 1,
  },
  timetableContent: {
    padding: Spacing.md,
  },
  timeSlot: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timeColumn: {
    width: 70,
    paddingRight: Spacing.sm,
  },
  timeText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  durationText: {
    fontSize: 12,
    lineHeight: 16,
    color: AbalColors.textMuted,
  },
  classCard: {
    flex: 1,
    backgroundColor: AbalColors.background,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    padding: Spacing.sm + 2,
  },
  classCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classIconSmall: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  classCardTitleContainer: {
    flex: 1,
  },
  classCardTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  instructorText: {
    fontSize: 12,
    lineHeight: 16,
    color: AbalColors.textSecondary,
  },
  spotsTag: {
    backgroundColor: AbalColors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  spotsTagText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: AbalColors.textSecondary,
  },
  spotsTagLow: {
    color: AbalColors.error,
  },
});
