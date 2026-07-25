/**
 * Loader Component
 *
 * Variants:
 *  - fullscreen: centered overlay, used while checking auth or loading critical data
 *  - inline: smaller spinner for in-component loading states
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface LoaderProps {
  variant?: 'fullscreen' | 'inline';
  message?: string;
}

export function Loader({ variant = 'inline', message }: LoaderProps) {
  if (variant === 'fullscreen') {
    return (
      <View style={styles.fullscreen}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <ActivityIndicator size="small" color={Colors.brand.primary} />
      {message ? <Text style={styles.inlineMessage}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[4],
  },

  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
    gap: Spacing[3],
  },

  message: {
    fontSize: FontSize.base,
    color: Colors.text.dark.secondary,
    textAlign: 'center',
  },

  inlineMessage: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.muted,
    textAlign: 'center',
  },
});
