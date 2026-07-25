/**
 * Production-grade Axios instance for the Harlon Admin API.
 *
 * Responsibilities:
 *  1. Attach baseURL and timeout to every request
 *  2. Inject Authorization header from persisted token
 *  3. Normalise all errors into ApiError objects
 *  4. Detect network failures vs. server errors
 *  5. On 401 → clear token and redirect to login (session expired)
 *
 * Nothing outside this file should ever import raw axios.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { router } from 'expo-router';

import { ENV } from '@/config/env';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { ApiError, ApiResponse } from '@/types/api.types';

// ─── Instance ────────────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attaches the stored Bearer token to every outgoing request.

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      // If AsyncStorage fails, send the request without auth.
      // The server will respond with 401 and we'll handle it below.
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On success: pass through.
// On 401: clear token + redirect to login (session has expired or is invalid).
// On all other errors: normalise into typed ApiError.

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: unknown): Promise<never> => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Session is no longer valid. Clear persisted token and force re-login.
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      } catch {
        // Ignore storage errors — we're already in an error path.
      }
      // Navigate to login. This works because expo-router's imperative
      // router is available outside React components.
      router.replace('/(auth)/login');
    }

    const apiError = normaliseError(error);
    return Promise.reject(apiError);
  },
);

// ─── Error Normaliser ─────────────────────────────────────────────────────────
// Converts any error (AxiosError, network failure, unknown) into a
// consistent ApiError shape that services and hooks can rely on.

function normaliseError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED') {
        return {
          message: 'Request timed out. Please check your connection.',
          statusCode: 408,
          isNetworkError: false,
          isTimeout: true,
        };
      }
      return {
        message: 'No internet connection. Please check your network.',
        statusCode: 0,
        isNetworkError: true,
        isTimeout: false,
      };
    }

    const serverMessage =
      axiosError.response.data?.message ??
      axiosError.message ??
      'An unexpected error occurred.';

    return {
      message: serverMessage,
      statusCode: axiosError.response.status,
      isNetworkError: false,
      isTimeout: false,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    statusCode: -1,
    isNetworkError: false,
    isTimeout: false,
  };
}

export default apiClient;
