/**
 * Root Layout
 *
 * Responsibilities:
 *  1. Provide QueryClient to the entire app (React Query)
 *  2. Provide SafeAreaProvider
 *  3. Keep splash screen visible until auth check in index.tsx completes
 *  4. Set global status bar style
 *
 * IMPORTANT: We do NOT call SplashScreen.hideAsync() here.
 * It is called from index.tsx AFTER the auth check resolves,
 * so there is never a blank frame between splash and the first screen.
 */

import React from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import '@/global.css';

// Prevent auto-hide — we control exactly when the splash hides.
SplashScreen.preventAutoHideAsync();

/**
 * Global QueryClient configuration.
 *
 * retry: 2      → 3 total attempts before showing error state
 * staleTime     → how long cached data is considered fresh (no background refetch)
 * refetchOnWindowFocus: false → don't refetch every time user switches apps
 *                              (can enable this in Phase 2 for live order updates)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds default
    },
    mutations: {
      retry: 0, // Never retry mutations — double-submitting an order is worse than an error
    },
  },
});

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
