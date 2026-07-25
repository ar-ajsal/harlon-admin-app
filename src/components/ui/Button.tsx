/**
 * Button Component
 *
 * Variants: primary, ghost, danger, outline
 * States: default, loading (with spinner), disabled
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles[`${variant}_pressed`],
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.white : Colors.brand.primary}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`label_${size}`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  } as ViewStyle,

  fullWidth: {
    alignSelf: 'stretch',
  } as ViewStyle,

  // ─── Variants ──────────────────────────────────────────────────────────
  primary: {
    backgroundColor: Colors.brand.primary,
  } as ViewStyle,
  primary_pressed: {
    backgroundColor: Colors.brand.primaryDark,
  } as ViewStyle,

  ghost: {
    backgroundColor: Colors.dark.elevated,
  } as ViewStyle,
  ghost_pressed: {
    backgroundColor: Colors.dark.border,
  } as ViewStyle,

  danger: {
    backgroundColor: Colors.danger.default,
  } as ViewStyle,
  danger_pressed: {
    backgroundColor: Colors.danger.light,
  } as ViewStyle,

  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.dark.borderStrong,
  } as ViewStyle,
  outline_pressed: {
    backgroundColor: Colors.dark.elevated,
  } as ViewStyle,

  disabled: {
    opacity: 0.45,
  } as ViewStyle,

  // ─── Sizes ─────────────────────────────────────────────────────────────
  size_sm: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    minHeight: 36,
  } as ViewStyle,
  size_md: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    minHeight: 48,
  } as ViewStyle,
  size_lg: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[8],
    minHeight: 56,
  } as ViewStyle,

  // ─── Label ──────────────────────────────────────────────────────────────
  label: {
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.2,
  } as TextStyle,
  label_primary: { color: Colors.white } as TextStyle,
  label_ghost: { color: Colors.text.dark.primary } as TextStyle,
  label_danger: { color: Colors.white } as TextStyle,
  label_outline: { color: Colors.text.dark.secondary } as TextStyle,
  label_sm: { fontSize: FontSize.sm } as TextStyle,
  label_md: { fontSize: FontSize.base } as TextStyle,
  label_lg: { fontSize: FontSize.md } as TextStyle,
});
