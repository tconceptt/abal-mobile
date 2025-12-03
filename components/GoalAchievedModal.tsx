import { AbalColors, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface GoalAchievedModalProps {
  visible: boolean;
  onClose: () => void;
  goalWeight: number;
}

const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

function ConfettiPiece({ delay, startX }: { delay: number; startX: number }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 300,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: (Math.random() - 0.5) * 100,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: Math.random() * 720 - 360,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ]);
    animation.start();
  }, []);

  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const size = 8 + Math.random() * 8;

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: startX,
          width: size,
          height: size * 1.5,
          backgroundColor: color,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            })},
          ],
          opacity,
        },
      ]}
    />
  );
}

export function GoalAchievedModal({ visible, onClose, goalWeight }: GoalAchievedModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 500,
    startX: Math.random() * 300,
  }));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        {/* Confetti */}
        <View style={styles.confettiContainer} pointerEvents="none">
          {confettiPieces.map((piece) => (
            <ConfettiPiece key={piece.id} delay={piece.delay} startX={piece.startX} />
          ))}
        </View>

        <Animated.View 
          style={[
            styles.modalView,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            }
          ]}
        >
          {/* Trophy Icon */}
          <View style={styles.trophyContainer}>
            <View style={styles.trophyGlow} />
            <IconSymbol name="trophy.fill" size={64} color="#FFD700" />
          </View>

          <ThemedText style={styles.congratsText}>Congratulations!</ThemedText>
          <ThemedText style={styles.achievedText}>You've reached your goal!</ThemedText>
          
          <View style={styles.goalBox}>
            <ThemedText style={styles.goalLabel}>Goal Weight Achieved</ThemedText>
            <ThemedText style={styles.goalValue}>{goalWeight} lbs</ThemedText>
          </View>

          <ThemedText style={styles.messageText}>
            Your dedication and hard work have paid off. This is a massive achievement — you should be incredibly proud of yourself!
          </ThemedText>

          <Pressable style={styles.celebrateButton} onPress={onClose}>
            <ThemedText style={styles.celebrateButtonText}>Keep Going!</ThemedText>
          </Pressable>
        </Animated.View>
      </View>
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  modalView: {
    width: '85%',
    backgroundColor: AbalColors.cardBackground,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.card,
  },
  trophyContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  trophyGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    opacity: 0.2,
    top: -18,
    left: -18,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '800',
    color: AbalColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  achievedText: {
    fontSize: 16,
    color: AbalColors.textSecondary,
    marginBottom: Spacing.lg,
  },
  goalBox: {
    backgroundColor: AbalColors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  goalLabel: {
    fontSize: 12,
    color: AbalColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  goalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: AbalColors.textPrimary,
  },
  messageText: {
    fontSize: 14,
    color: AbalColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  celebrateButton: {
    backgroundColor: '#FFD700',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl * 2,
    borderRadius: BorderRadius.full,
  },
  celebrateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});



