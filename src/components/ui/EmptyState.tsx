/**
 * EmptyState Component
 *
 * Shown when a list has no items (empty orders, no search results, etc.)
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '📭', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="outline" size="sm" />
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

  description: {
    fontSize: FontSize.base,
    color: Colors.text.dark.secondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.6,
  },
});
