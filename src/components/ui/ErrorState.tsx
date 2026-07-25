/**
 * ErrorState Component
 *
 * Shown when a network/server error prevents data from loading.
 * Always provides a retry action so users aren't stuck.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\'t load this data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button label="Try Again" onPress={onRetry} variant="outline" size="sm" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    gap: Spacing[3],
  },

  icon: {
    fontSize: 48,
    marginBottom: Spacing[2],
  },

  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
    textAlign: 'center',
  },

  message: {
    fontSize: FontSize.base,
    color: Colors.text.dark.secondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
});
