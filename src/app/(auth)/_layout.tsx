/**
 * Auth Route Group Layout
 *
 * Stack navigator for unauthenticated screens.
 * Currently only contains the Login screen.
 * Future: ForgotPassword, OTP verification, etc.
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
  );
}
