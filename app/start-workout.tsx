import { router } from 'expo-router';
import {
  Barbell,
  Bicycle,
  IconProps,
  Lightning,
  PencilSimple,
  PersonSimpleRun,
  PersonSimpleTaiChi,
  Timer,
} from 'phosphor-react-native';
import React, { ComponentType, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';

// Workout type definitions with cohesive color palette
type WorkoutType = {
  id: string;
  name: string;
  Icon: ComponentType<IconProps>;
  gradient: [string, string];
  iconColor: string;
};

const workoutTypes: WorkoutType[] = [
  {
    id: 'running',
    name: 'Running',
    Icon: PersonSimpleRun,
    gradient: ['#FF6B35', '#FF8C5A'],
    iconColor: '#FFFFFF',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    Icon: Bicycle,
    gradient: ['#7C3AED', '#9F67FF'],
    iconColor: '#FFFFFF',
  },
  {
    id: 'strength',
    name: 'Strength',
    Icon: Barbell,
    gradient: ['#374151', '#4B5563'],
    iconColor: '#FFFFFF',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    Icon: PersonSimpleTaiChi,
    gradient: ['#EC4899', '#F472B6'],
    iconColor: '#FFFFFF',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    Icon: Timer,
    gradient: ['#EF4444', '#F87171'],
    iconColor: '#FFFFFF',
  },
  {
    id: 'custom',
    name: 'Custom',
    Icon: PencilSimple,
    gradient: ['#6B7280', '#9CA3AF'],
    iconColor: '#FFFFFF',
  },
];

type GoalType = 'open' | 'distance' | 'time' | 'calories';
type LocationType = 'outdoors' | 'indoors' | 'gym';

const goalOptions: { id: GoalType; label: string }[] = [
  { id: 'open', label: 'Open Goal' },
  { id: 'distance', label: 'Distance Goal' },
  { id: 'time', label: 'Time Goal' },
  { id: 'calories', label: 'Calorie Goal' },
];

const locationOptions: { id: LocationType; label: string }[] = [
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'indoors', label: 'Indoors' },
  { id: 'gym', label: 'Gym' },
];

function WorkoutTypeCard({
  workout,
  isSelected,
  onSelect,
}: {
  workout: WorkoutType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { Icon } = workout;
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.workoutTypeCard,
        isSelected && styles.workoutTypeCardSelected,
        pressed && styles.cardPressed,
      ]}
      onPress={onSelect}
    >
      <View
        style={[
          styles.workoutIconContainer,
          { backgroundColor: workout.gradient[0] },
        ]}
      >
        <Icon size={28} color={workout.iconColor} weight="fill" />
      </View>
      <ThemedText
        style={[
          styles.workoutTypeName,
          isSelected && styles.workoutTypeNameSelected,
        ]}
      >
        {workout.name}
      </ThemedText>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

function SettingRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && styles.settingRowPressed,
      ]}
      onPress={onPress}
    >
      <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      <View style={styles.settingRight}>
        <ThemedText style={styles.settingValue}>{value}</ThemedText>
        <View style={styles.editButton}>
          <IconSymbol name="pencil" size={14} color={AbalColors.textPrimary} />
        </View>
      </View>
    </Pressable>
  );
}

function OptionSheet({
  title,
  options,
  selectedId,
  onSelect,
  onClose,
}: {
  title: string;
  options: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Pressable style={styles.sheetOverlay} onPress={onClose}>
      <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
        <View style={styles.sheetHandle} />
        <ThemedText style={styles.sheetTitle}>{title}</ThemedText>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.sheetOption,
              selectedId === option.id && styles.sheetOptionSelected,
            ]}
            onPress={() => {
              onSelect(option.id);
              onClose();
            }}
          >
            <ThemedText
              style={[
                styles.sheetOptionText,
                selectedId === option.id && styles.sheetOptionTextSelected,
              ]}
            >
              {option.label}
            </ThemedText>
            {selectedId === option.id && (
              <IconSymbol name="checkmark" size={20} color={AbalColors.primary} />
            )}
          </Pressable>
        ))}
      </Pressable>
    </Pressable>
  );
}

export default function StartWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [selectedWorkout, setSelectedWorkout] = useState<string>('running');
  const [goalType, setGoalType] = useState<GoalType>('open');
  const [locationType, setLocationType] = useState<LocationType>('outdoors');
  const [showGoalSheet, setShowGoalSheet] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleStart = () => {
    // TODO: Navigate to active workout screen based on workout type
    console.log('Starting workout:', {
      type: selectedWorkout,
      goal: goalType,
      location: locationType,
    });
  };

  const selectedGoalLabel = goalOptions.find((g) => g.id === goalType)?.label || 'Open Goal';
  const selectedLocationLabel = locationOptions.find((l) => l.id === locationType)?.label || 'Outdoors';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={12}
        >
          <IconSymbol name="arrow.left" size={24} color={AbalColors.textPrimary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Start Workout</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Workout Type Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Choose Workout Type</ThemedText>
          <View style={styles.workoutGrid}>
            {workoutTypes.map((workout) => (
              <WorkoutTypeCard
                key={workout.id}
                workout={workout}
                isSelected={selectedWorkout === workout.id}
                onSelect={() => setSelectedWorkout(workout.id)}
              />
            ))}
          </View>
        </View>

        {/* Workout Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Workout Settings</ThemedText>
          <View style={styles.settingsCard}>
            <SettingRow
              label="Goal"
              value={selectedGoalLabel}
              onPress={() => setShowGoalSheet(true)}
            />
            <View style={styles.settingDivider} />
            <SettingRow
              label="Location"
              value={selectedLocationLabel}
              onPress={() => setShowLocationSheet(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStart}
        >
          <IconSymbol name="play.fill" size={20} color={AbalColors.textPrimary} />
          <ThemedText style={styles.startButtonText}>START</ThemedText>
        </Pressable>
      </View>

      {/* Goal Selection Sheet */}
      {showGoalSheet && (
        <OptionSheet
          title="Select Goal Type"
          options={goalOptions}
          selectedId={goalType}
          onSelect={(id) => setGoalType(id as GoalType)}
          onClose={() => setShowGoalSheet(false)}
        />
      )}

      {/* Location Selection Sheet */}
      {showLocationSheet && (
        <OptionSheet
          title="Select Location"
          options={locationOptions}
          selectedId={locationType}
          onSelect={(id) => setLocationType(id as LocationType)}
          onClose={() => setShowLocationSheet(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AbalColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.md,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  workoutTypeCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.card,
  },
  workoutTypeCardSelected: {
    borderColor: AbalColors.primary,
    backgroundColor: '#FAFFF0',
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  workoutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  workoutTypeName: {
    fontSize: 13,
    fontWeight: '600',
    color: AbalColors.textPrimary,
    textAlign: 'center',
  },
  workoutTypeNameSelected: {
    color: AbalColors.textPrimary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AbalColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsCard: {
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  settingRowPressed: {
    backgroundColor: AbalColors.divider,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: AbalColors.textPrimary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    fontSize: 15,
    color: AbalColors.textSecondary,
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AbalColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingDivider: {
    height: 1,
    backgroundColor: AbalColors.divider,
    marginLeft: Spacing.md,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: AbalColors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: AbalColors.border,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AbalColors.primary,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadows.cardLarge,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    letterSpacing: 1,
  },
  // Option Sheet Styles
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: AbalColors.cardBackground,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: AbalColors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  sheetOptionSelected: {
    backgroundColor: `${AbalColors.primary}20`,
  },
  sheetOptionText: {
    fontSize: 16,
    color: AbalColors.textPrimary,
  },
  sheetOptionTextSelected: {
    fontWeight: '600',
  },
});

