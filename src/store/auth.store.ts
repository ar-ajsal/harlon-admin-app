/**
 * Auth Store
 *
 * Thin utility layer over AsyncStorage for token management.
 * This is the ONLY place in the app that reads/writes the auth token.
 *
 * Design choice: We use a simple module (not Zustand/Redux) because
 * auth state is a single persisted value that screens read once.
 * Reactive global state is overkill here — React Query + navigation
 * handles the reactive parts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';

const AuthStore = {
  /**
   * Returns the stored token, or null if not authenticated.
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  /**
   * Persists the token received from a successful login.
   */
  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch {
      // Silent fail — the user will simply be asked to log in again next session.
    }
  },

  /**
   * Removes the token. Called on logout.
   */
  clearToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      // Silent fail.
    }
  },

  /**
   * Returns true if a token exists in storage.
   * Used by the auth gate on app startup.
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await AuthStore.getToken();
    return token !== null && token.length > 0;
  },
};

export default AuthStore;
