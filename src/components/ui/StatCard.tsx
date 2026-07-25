/**
 * StatCard Component
 *
 * Used on the Dashboard to display key metrics.
 * Shows: emoji icon, label, value, and optional trend.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from './Card';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: TrendDirection;
  trendValue?: string;
  onPress?: () => void;
}

export function StatCard({ icon, label, value, trend, trendValue, onPress }: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? Colors.success.default
      : trend === 'down'
        ? Colors.danger.default
        : Colors.text.dark.muted;

  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.iconRow}>
        <Text style={styles.icon}>{icon}</Text>
        {trend && trendValue ? (
          <View style={[styles.trendBadge, { backgroundColor: `${trendColor}22` }]}>
            <Text style={[styles.trendText, { color: trendColor }]}>
              {trendArrow} {trendValue}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing[2],
    minWidth: 150,
    flex: 1,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },

  icon: {
    fontSize: 24,
  },

  value: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
    letterSpacing: -0.5,
  },

  label: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.secondary,
    fontWeight: FontWeight.medium,
  },

  trendBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: 6,
  },

  trendText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
});
