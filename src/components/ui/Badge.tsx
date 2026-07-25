/**
 * Badge Component
 *
 * Displays order status with semantic colour coding.
 * Small visual labels used in order list rows and detail screens.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { OrderStatus } from '@/types/order.types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: Colors.warning.default,  bg: Colors.warning.bg },
  confirmed:  { label: 'Confirmed',  color: Colors.info.default,     bg: Colors.info.bg },
  processing: { label: 'Processing', color: '#8B5CF6',               bg: '#1C0A40' },
  shipped:    { label: 'Shipped',    color: '#06B6D4',               bg: '#021B24' },
  delivered:  { label: 'Delivered',  color: Colors.success.default,  bg: Colors.success.bg },
  cancelled:  { label: 'Cancelled',  color: Colors.danger.default,   bg: Colors.danger.bg },
  returned:   { label: 'Returned',   color: '#F97316',               bg: '#1C0900' },
};

interface BadgeProps {
  status: OrderStatus;
}

export function Badge({ status }: BadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
    gap: Spacing[1.5],
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
});
