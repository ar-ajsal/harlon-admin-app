/**
 * Header Component
 *
 * Consistent screen header with title, optional subtitle,
 * and optional left/right action slots.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon: string;
    onPress: () => void;
    accessibilityLabel?: string;
  };
  rightAction?: {
    icon: string;
    onPress: () => void;
    accessibilityLabel?: string;
  };
}

export function Header({ title, subtitle, leftAction, rightAction }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing[3] }]}>
      <View style={styles.row}>
        {leftAction ? (
          <Pressable
            onPress={leftAction.onPress}
            style={styles.actionButton}
            accessibilityLabel={leftAction.accessibilityLabel ?? 'Back'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.actionIcon}>{leftAction.icon}</Text>
          </Pressable>
        ) : (
          <View style={styles.actionPlaceholder} />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            style={styles.actionButton}
            accessibilityLabel={rightAction.accessibilityLabel ?? 'Action'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.actionIcon}>{rightAction.icon}</Text>
          </Pressable>
        ) : (
          <View style={styles.actionPlaceholder} />
        )}
      </View>

      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.bg,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[3],
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing[0.5],
  },

  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
    letterSpacing: -0.2,
  },

  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionPlaceholder: {
    width: 36,
  },

  actionIcon: {
    fontSize: 16,
  },

  separator: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginTop: Spacing[3],
  },
});
