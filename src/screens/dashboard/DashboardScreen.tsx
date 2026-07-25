/**
 * DashboardScreen
 *
 * Displays key business metrics and a quick view of recent orders.
 * Pulls real data from the stats endpoint with placeholder fallback.
 *
 * Fixes applied:
 *  - isRefreshing now reflects actual refetch state
 *  - Greeting is time-aware (morning/afternoon/evening)
 *  - formatCurrency and formatDate imported from shared utils (no duplication)
 */

import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';
import { useDashboardStats, useOrdersList } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types/order.types';
import { formatCurrency, formatShortDate, getGreeting } from '@/utils/formatters';

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderRow({ order, onPress }: { order: Order; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={styles.orderRow}>
      <View style={styles.orderRowTop}>
        <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
        <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
      </View>
      <View style={styles.orderRowBottom}>
        <Text style={styles.orderDate}>{formatShortDate(order.createdAt)}</Text>
        <Badge status={order.status} />
      </View>
    </Card>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrdersList({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchStats(), refetchOrders()]);
    setIsRefreshing(false);
  };

  if (statsLoading && !stats) {
    return <Loader variant="fullscreen" message="Loading dashboard..." />;
  }

  if (statsError && !stats) {
    return <ErrorState onRetry={refetchStats} />;
  }

  const recentOrders = ordersData?.items ?? [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.storeName}>Harlon Admin</Text>
        </View>
        <Card onPress={logout} style={styles.logoutButton} padding={false}>
          <Text style={styles.logoutIcon}>⎋</Text>
        </Card>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand.primary}
          />
        }
      >
        {/* Today's Stats */}
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="📦" label="Orders"  value={stats?.todayOrders ?? 0} />
          <StatCard icon="💰" label="Revenue" value={formatCurrency(stats?.todayRevenue ?? 0)} />
        </View>

        {/* Order Status Breakdown */}
        <Text style={styles.sectionTitle}>Order Status</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="⏳" label="Pending"   value={stats?.pendingOrders ?? 0} />
          <StatCard icon="✅" label="Delivered"  value={stats?.deliveredOrders ?? 0} />
          <StatCard icon="🚚" label="Shipped"   value={stats?.shippedOrders ?? 0} />
          <StatCard icon="❌" label="Cancelled"  value={stats?.cancelledOrders ?? 0} />
        </View>

        {/* Recent Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Text style={styles.seeAll} onPress={() => router.push('/(app)/orders')}>
            See all →
          </Text>
        </View>

        {ordersLoading ? (
          <Loader variant="inline" />
        ) : recentOrders.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No orders yet.</Text>
          </Card>
        ) : (
          <View style={styles.ordersList}>
            {recentOrders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                onPress={() => router.push(`/(app)/orders/${order._id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  greeting: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.muted,
  },
  storeName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
    letterSpacing: -0.5,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 20,
    color: Colors.text.dark.secondary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[12],
    gap: Spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: Spacing[3],
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.brand.primary,
    fontWeight: FontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  ordersList: {
    gap: Spacing[3],
  },
  orderRow: {
    gap: Spacing[2],
  },
  orderRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
  },
  orderTotal: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
  },
  orderDate: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.muted,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.text.dark.muted,
    fontSize: FontSize.sm,
  },
});
