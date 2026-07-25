/**
 * Input Component
 *
 * Features:
 *  - Label + placeholder
 *  - Error message display
 *  - Secure text entry with show/hide toggle
 *  - Focus state border highlight
 *  - Keyboard type and return key config
 *  - Fully accessible
 */

import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { BorderRadius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, containerStyle, isPassword = false, ...textInputProps },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}
      >
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={Colors.text.dark.muted}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          {...textInputProps}
        />

        {isPassword && (
          <Pressable
            onPress={() => setIsSecure((prev) => !prev)}
            style={styles.eyeButton}
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.eyeIcon}>{isSecure ? '👁' : '🙈'}</Text>
          </Pressable>
        )}
      </View>

      {hint && !hasError ? <Text style={styles.hint}>{hint}</Text> : null}
      {hasError ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing[2],
  },

  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.dark.secondary,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.elevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: Spacing[4],
    minHeight: 52,
  },

  inputWrapperFocused: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.dark.surface,
  },

  inputWrapperError: {
    borderColor: Colors.danger.default,
  },

  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.text.dark.primary,
    paddingVertical: Spacing[3],
  },

  eyeButton: {
    paddingLeft: Spacing[3],
    justifyContent: 'center',
    alignItems: 'center',
  },

  eyeIcon: {
    fontSize: FontSize.md,
  },

  hint: {
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
  },

  error: {
    fontSize: FontSize.xs,
    color: Colors.danger.default,
    fontWeight: FontWeight.medium,
  },
});
