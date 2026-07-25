/**
 * Card Component
 *
 * Elevated surface container used for grouping related content.
 * Accepts optional onPress for tappable cards (order rows, etc.)
 */

import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: boolean;
}

export function Card({ children, onPress, style, padding = true }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          padding && styles.padding,
          pressed && styles.pressed,
          style,
        ]}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, padding && styles.padding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  } as ViewStyle,

  padding: {
    padding: Spacing[4],
  } as ViewStyle,

  pressed: {
    opacity: 0.75,
    backgroundColor: Colors.dark.elevated,
  } as ViewStyle,
});
