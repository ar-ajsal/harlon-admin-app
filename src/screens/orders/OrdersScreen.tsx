/**
 * OrdersScreen
 *
 * Features:
 *  - Paginated order list
 *  - Filter tabs by status (All, Pending, Shipped, Delivered, Cancelled)
 *  - Pull to refresh
 *  - Loading, empty, and error states
 *  - Tap order → Order Detail
 */

import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useOrdersList } from '@/hooks/useOrders';
import { Order, OrderStatus } from '@/types/order.types';

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

type FilterOption = { label: string; value: OrderStatus | 'all' };

const FILTERS: FilterOption[] = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped',   value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const itemCount = order.items?.length ?? 0;
  const itemSummary =
    itemCount === 1
      ? `${order.items[0].name}`
      : `${order.items[0]?.name ?? 'Item'} + ${itemCount - 1} more`;

  return (
    <Card onPress={onPress} style={styles.orderCard}>
      <View style={styles.orderCardTop}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.orderItems} numberOfLines={1}>
            {itemSummary}
          </Text>
        </View>
        <View style={styles.orderRight}>
          <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
      </View>
      <View style={styles.orderCardBottom}>
        <Text style={styles.orderCustomer} numberOfLines={1}>
          📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}
        </Text>
        <Badge status={order.status} />
      </View>
    </Card>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OrdersScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');

  const { data, isLoading, isError, refetch } = useOrdersList({
    status: activeFilter,
    limit: 30,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const orders = data?.items ?? [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        {data ? (
          <Text style={styles.count}>{data.total} total</Text>
        ) : null}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActiveFilter(item.value)}
              style={[
                styles.filterTab,
                activeFilter === item.value && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === item.value && styles.filterLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* List */}
      {isLoading ? (
        <Loader variant="inline" message="Loading orders..." />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No orders found"
          description="There are no orders matching the selected filter."
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refetch}
              tintColor={Colors.brand.primary}
            />
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => router.push(`/(app)/orders/${item._id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.bg,
  },

  // ─── Header ─────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
    letterSpacing: -0.5,
  },
  count: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.muted,
  },

  // ─── Filters ────────────────────────────────────────────────────────────
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  filterList: {
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
  },
  filterTab: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[1.5],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.elevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  filterTabActive: {
    backgroundColor: Colors.brand.primaryMuted,
    borderColor: Colors.brand.primary,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text.dark.secondary,
  },
  filterLabelActive: {
    color: Colors.brand.primaryLight,
  },

  // ─── List ────────────────────────────────────────────────────────────────
  listContent: {
    padding: Spacing[5],
    paddingBottom: Spacing[16],
  },
  separator: {
    height: Spacing[3],
  },

  // ─── Order Card ──────────────────────────────────────────────────────────
  orderCard: {
    gap: Spacing[3],
  },
  orderCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
    gap: Spacing[1],
    paddingRight: Spacing[4],
  },
  orderNumber: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
  },
  orderItems: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.secondary,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: Spacing[1],
  },
  orderTotal: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
  },
  orderDate: {
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
  },
  orderCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCustomer: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
    paddingRight: Spacing[3],
  },
});
