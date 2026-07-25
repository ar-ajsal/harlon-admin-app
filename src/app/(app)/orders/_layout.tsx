/**
 * Orders Stack Layout
 *
 * Stack navigator inside the Orders tab.
 * Handles: list → detail transition.
 */

import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
