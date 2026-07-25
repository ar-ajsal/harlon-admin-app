/**
 * App Entry Point — Auth Gate
 *
 * This is the first screen Expo Router renders.
 *
 * Flow:
 *  1. Show native splash screen (already visible from app.json config)
 *  2. Check AsyncStorage for a token (~50ms typically)
 *  3. Hide splash screen (no blank frame — transition is seamless)
 *  4. Redirect: token exists → /(app)/dashboard, no token → /(auth)/login
 *
 * The user never sees any content here — they are always redirected.
 * The Loader is a safety net for the rare case where navigation takes
 * longer than the auth check.
 */

import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { Loader } from '@/components/ui/Loader';
import AuthStore from '@/store/auth.store';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await AuthStore.isAuthenticated();
      setIsAuthenticated(authenticated);
      // Hide the native splash AFTER we know where to navigate.
      // This eliminates any blank/white frame between splash and first screen.
      await SplashScreen.hideAsync();
    }
    checkAuth();
  }, []);

  // Still reading from AsyncStorage — keep showing the splash (it's still visible)
  if (isAuthenticated === null) {
    return <Loader variant="fullscreen" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
