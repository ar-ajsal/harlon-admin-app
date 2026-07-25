/**
 * Production-grade Axios instance for the Harlon Admin API.
 *
 * Responsibilities:
 *  1. Attach baseURL and timeout to every request
 *  2. Inject Authorization header from persisted token
 *  3. Normalise all errors into ApiError objects
 *  4. Detect network failures vs. server errors
 *
 * Nothing outside this file should ever import raw axios.
 * All API calls go through this instance.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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
// Automatically attaches the stored Bearer token to every request.

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      // If AsyncStorage fails, we still send the request without auth.
      // The server will respond with 401 and the app will redirect to login.
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Unwraps the `data` envelope on success.
// Normalises all errors into a typed ApiError on failure.

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: unknown): Promise<never> => {
    const apiError = normaliseError(error);
    return Promise.reject(apiError);
  },
);

// ─── Error Normaliser ─────────────────────────────────────────────────────────

function normaliseError(error: unknown): ApiError {
  // Network error (no response received — device is offline or server unreachable)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (!axiosError.response) {
      // Check if it is specifically a timeout
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

    // Server responded with an error status (4xx, 5xx)
    const serverMessage =
      axiosError.response.data?.message ?? axiosError.message ?? 'An unexpected error occurred.';

    return {
      message: serverMessage,
      statusCode: axiosError.response.status,
      isNetworkError: false,
      isTimeout: false,
    };
  }

  // Unknown / non-axios error
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    statusCode: -1,
    isNetworkError: false,
    isTimeout: false,
  };
}

export default apiClient;
