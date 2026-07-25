/**
 * Root Layout
 *
 * Responsibilities:
 *  1. Provide QueryClient to the entire app (React Query)
 *  2. Provide SafeAreaProvider
 *  3. Handle SplashScreen hide logic
 *  4. Set global status bar style
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/global.css';

// Keep the splash screen visible until we're ready
SplashScreen.preventAutoHideAsync();

// Configure the global QueryClient.
// These settings are production-appropriate:
//  - 2 retries on failure (3rd attempt is the final one)
//  - No refetch on window focus for mutations
//  - Errors do not cause global throw (handled per-query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds default
    },
    mutations: {
      retry: 0,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen once the layout is mounted.
    // The auth check in index.tsx will handle navigation before this renders.
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
