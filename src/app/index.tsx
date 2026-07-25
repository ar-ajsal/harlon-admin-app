/**
 * App Entry Point — Auth Gate
 *
 * This screen is the first thing Expo Router renders.
 * It reads AsyncStorage and redirects to the correct route group:
 *
 *   Token exists  →  /(app)/dashboard
 *   No token      →  /(auth)/login
 *
 * It renders a full-screen loader while checking (typically < 100ms).
 * Users never see any content here — they're always redirected immediately.
 */

import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { Loader } from '@/components/ui/Loader';
import AuthStore from '@/store/auth.store';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    AuthStore.isAuthenticated().then(setIsAuthenticated);
  }, []);

  // Still checking AsyncStorage
  if (isAuthenticated === null) {
    return <Loader variant="fullscreen" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
