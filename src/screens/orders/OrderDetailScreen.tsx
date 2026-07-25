/**
 * OrderDetailScreen
 *
 * Full breakdown of a single order:
 *  - Status badge + order number
 *  - Financial summary (subtotal, shipping, discount, total)
 *  - Items list with sizes and quantities
 *  - Customer + shipping address
 *  - Order timeline
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Colors } from '@/constants/colors';
import { FontSize, FontWeight } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { useOrderDetail } from '@/hooks/useOrders';
import { OrderItem, OrderTimeline } from '@/types/order.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

function ItemRow({ item }: { item: OrderItem }) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {[item.size, item.color, `Qty: ${item.quantity}`].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
    </View>
  );
}

function TimelineItem({ event, isLast }: { event: OrderTimeline; isLast: boolean }) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLine}>
        <View style={styles.timelineDot} />
        {!isLast && <View style={styles.timelineConnector} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineStatus}>{event.status.toUpperCase()}</Text>
        <Text style={styles.timelineDate}>{formatDateTime(event.timestamp)}</Text>
        {event.note ? <Text style={styles.timelineNote}>{event.note}</Text> : null}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrderDetail(id);

  if (isLoading) {
    return <Loader variant="fullscreen" message="Loading order..." />;
  }

  if (isError || !order) {
    return <ErrorState onRetry={refetch} message="Couldn't load this order." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backButton} onPress={() => router.back()}>
          ← Back
        </Text>
        <Text style={styles.headerTitle}>Order Detail</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Identity */}
        <Card style={styles.card}>
          <View style={styles.orderIdentity}>
            <View>
              <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
              <Text style={styles.orderDate}>{formatDateTime(order.createdAt)}</Text>
            </View>
            <Badge status={order.status} />
          </View>
        </Card>

        {/* Financial Summary */}
        <SectionTitle title="Payment" />
        <Card style={styles.card}>
          <Row label="Subtotal"   value={formatCurrency(order.subtotal)} />
          <View style={styles.divider} />
          <Row label="Shipping"   value={formatCurrency(order.shippingCharge)} />
          {order.discount > 0 && (
            <Row label="Discount" value={`- ${formatCurrency(order.discount)}`} />
          )}
          <View style={styles.divider} />
          <Row label="Total"      value={formatCurrency(order.total)} bold />
          <View style={styles.divider} />
          <Row label="Payment"    value={order.paymentMethod.toUpperCase()} />
          <Row label="Status"     value={order.paymentStatus.toUpperCase()} />
        </Card>

        {/* Items */}
        <SectionTitle title={`Items (${order.items.length})`} />
        <Card style={styles.card}>
          {order.items.map((item, index) => (
            <React.Fragment key={`${item.productId}-${index}`}>
              <ItemRow item={item} />
              {index < order.items.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Card>

        {/* Shipping Address */}
        <SectionTitle title="Shipping Address" />
        <Card style={styles.card}>
          <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
          <Text style={styles.addressText}>{order.shippingAddress.phone}</Text>
          <Text style={styles.addressText}>{order.shippingAddress.addressLine1}</Text>
          {order.shippingAddress.addressLine2 ? (
            <Text style={styles.addressText}>{order.shippingAddress.addressLine2}</Text>
          ) : null}
          <Text style={styles.addressText}>
            {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
          </Text>
        </Card>

        {/* Timeline */}
        {order.timeline?.length > 0 ? (
          <>
            <SectionTitle title="Order Timeline" />
            <Card style={[styles.card, styles.timelineCard]}>
              {order.timeline.map((event, index) => (
                <TimelineItem
                  key={`${event.status}-${index}`}
                  event={event}
                  isLast={index === order.timeline.length - 1}
                />
              ))}
            </Card>
          </>
        ) : null}

        {/* Notes */}
        {order.notes ? (
          <>
            <SectionTitle title="Notes" />
            <Card style={styles.card}>
              <Text style={styles.notes}>{order.notes}</Text>
            </Card>
          </>
        ) : null}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    fontSize: FontSize.base,
    color: Colors.brand.primary,
    fontWeight: FontWeight.medium,
    width: 64,
  },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
  },

  // ─── Scroll ─────────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[16],
    gap: Spacing[3],
  },

  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: Spacing[3],
  },

  card: {
    gap: Spacing[3],
  },

  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: Spacing[1],
  },

  // ─── Order Identity ──────────────────────────────────────────────────────
  orderIdentity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text.dark.primary,
  },
  orderDate: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.muted,
    marginTop: Spacing[1],
  },

  // ─── Row ─────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.secondary,
  },
  rowValue: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.primary,
    fontWeight: FontWeight.medium,
  },
  rowValueBold: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },

  // ─── Items ───────────────────────────────────────────────────────────────
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing[3],
  },
  itemInfo: {
    flex: 1,
    gap: Spacing[1],
  },
  itemName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text.dark.primary,
  },
  itemMeta: {
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
  },
  itemPrice: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
  },

  // ─── Address ──────────────────────────────────────────────────────────────
  addressName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
  },
  addressText: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.secondary,
    lineHeight: FontSize.sm * 1.6,
  },

  // ─── Timeline ────────────────────────────────────────────────────────────
  timelineCard: {
    paddingBottom: Spacing[2],
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  timelineLine: {
    alignItems: 'center',
    width: 16,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand.primary,
    marginTop: 3,
  },
  timelineConnector: {
    flex: 1,
    width: 1,
    backgroundColor: Colors.dark.border,
    marginTop: Spacing[1],
    marginBottom: -Spacing[3],
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing[5],
    gap: Spacing[0.5],
  },
  timelineStatus: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text.dark.primary,
    letterSpacing: 0.5,
  },
  timelineDate: {
    fontSize: FontSize.xs,
    color: Colors.text.dark.muted,
  },
  timelineNote: {
    fontSize: FontSize.xs,
    color: Colors.text.dark.secondary,
    fontStyle: 'italic',
  },

  // ─── Notes ────────────────────────────────────────────────────────────────
  notes: {
    fontSize: FontSize.sm,
    color: Colors.text.dark.secondary,
    lineHeight: FontSize.sm * 1.6,
  },
});
