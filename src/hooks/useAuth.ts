/**
 * useAuth hook
 *
 * Provides login, logout, and authentication state to screens.
 * This is the bridge between the UI layer and (AuthStore + AuthService).
 *
 * Screens NEVER import AuthStore or AuthService directly.
 */

import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';

import AuthService from '@/services/auth.service';
import AuthStore from '@/store/auth.store';
import { LoginFormValues } from '@/types/auth.types';
import { ApiError } from '@/types/api.types';

interface UseAuthReturn {
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthService.login({ password: values.password });

      if (!response.success || !response.data?.token) {
        throw new Error(response.message ?? 'Login failed. Please try again.');
      }

      await AuthStore.setToken(response.data.token);
      router.replace('/(app)/dashboard');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(
        apiErr?.message ?? 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    await AuthStore.clearToken();
    router.replace('/(auth)/login');
  }, [router]);

  return { login, logout, isLoading, error };
}
