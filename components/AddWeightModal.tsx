import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TextInput, View, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { AbalColors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface AddWeightModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (weight: number, date: string) => void;
}

export function AddWeightModal({ visible, onClose, onSave }: AddWeightModalProps) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setDate(new Date());
      setWeight('');
      setShowDatePicker(false);
    }
  }, [visible]);

  const handleSave = () => {
    const numWeight = parseFloat(weight);
    if (!isNaN(numWeight) && numWeight > 0) {
      const dateString = date.toISOString().split('T')[0];
      onSave(numWeight, dateString);
      setWeight('');
      onClose();
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDatePickerDone = () => {
    setShowDatePicker(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalView}>
          <ThemedText style={styles.modalTitle}>Add Weight Entry</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Weight</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                onChangeText={setWeight}
                value={weight}
                keyboardType="numeric"
                placeholder="0.0"
                placeholderTextColor={AbalColors.textMuted}
                autoFocus={!showDatePicker}
              />
              <ThemedText style={styles.unit}>lbs</ThemedText>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Date</ThemedText>
            <Pressable 
              style={[styles.dateButton, showDatePicker && styles.dateButtonActive]}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <IconSymbol name="calendar" size={20} color={AbalColors.primary} />
              <ThemedText style={styles.dateText}>{formatDate(date)}</ThemedText>
              <IconSymbol 
                name={showDatePicker ? "chevron.up" : "chevron.down"} 
                size={16} 
                color={AbalColors.textSecondary} 
              />
            </Pressable>
          </View>

          {showDatePicker && (
            <View style={styles.pickerWrapper}>
              <View style={styles.pickerHeader}>
                <ThemedText style={styles.pickerTitle}>Select Date</ThemedText>
                <Pressable 
                  style={styles.doneButton}
                  onPress={handleDatePickerDone}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <ThemedText style={styles.doneText}>Done</ThemedText>
                </Pressable>
              </View>
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  themeVariant="light"
                  style={styles.datePicker}
                />
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <ThemedText style={styles.textCancel}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <ThemedText style={styles.textSave}>Add Entry</ThemedText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.card,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: AbalColors.primary,
    paddingBottom: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: AbalColors.textPrimary,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
    color: AbalColors.textSecondary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AbalColors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  dateButtonActive: {
    borderWidth: 1,
    borderColor: AbalColors.primary,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: AbalColors.textPrimary,
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: AbalColors.background,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AbalColors.border,
  },
  pickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AbalColors.textSecondary,
  },
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  datePicker: {
    width: '100%',
    height: 150,
  },
  doneButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: AbalColors.primary,
    borderRadius: BorderRadius.sm,
  },
  doneText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  button: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: AbalColors.background,
  },
  buttonSave: {
    backgroundColor: AbalColors.primary,
  },
  textCancel: {
    color: AbalColors.textSecondary,
    fontWeight: '600',
  },
  textSave: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
