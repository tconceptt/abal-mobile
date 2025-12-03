import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './themed-text';

interface GoalSettingModalProps {
  visible: boolean;
  onClose: () => void;
  currentGoal: number | null;
  onSave: (weight: number) => void;
}

export function GoalSettingModal({ visible, onClose, currentGoal, onSave }: GoalSettingModalProps) {
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (visible && currentGoal) {
      setWeight(currentGoal.toString());
    } else if (visible) {
      setWeight('');
    }
  }, [visible, currentGoal]);

  const handleSave = () => {
    const numWeight = parseFloat(weight);
    if (!isNaN(numWeight) && numWeight > 0) {
      onSave(numWeight);
      onClose();
    }
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
          <ThemedText style={styles.modalTitle}>Set Goal Weight</ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            What is your target weight?
          </ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setWeight}
              value={weight}
              keyboardType="numeric"
              placeholder="0.0"
              placeholderTextColor={AbalColors.textMuted}
              autoFocus
            />
            <ThemedText style={styles.unit}>lbs</ThemedText>
          </View>

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
              <ThemedText style={styles.textSave}>Save Goal</ThemedText>
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
    width: '80%',
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderBottomWidth: 2,
    borderBottomColor: AbalColors.primary,
    paddingBottom: Spacing.xs,
  },
  input: {
    fontSize: 32,
    fontWeight: '700',
    color: AbalColors.textPrimary,
    textAlign: 'center',
    minWidth: 80,
  },
  unit: {
    fontSize: 20,
    fontWeight: '500',
    color: AbalColors.textSecondary,
    marginLeft: Spacing.xs,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.md,
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



