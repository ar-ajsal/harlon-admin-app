/**
 * Auth Service
 *
 * Handles all authentication-related API calls.
 * This is the ONLY file that calls auth endpoints.
 * Hooks and screens import from here — never from axios directly.
 */

import apiClient from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { LoginRequest, LoginResponse } from '@/types/auth.types';

const AuthService = {
  /**
   * POST /auth/login
   * Sends password to the backend and returns the session token.
   * Token persistence (AsyncStorage) is handled by the auth store, not here.
   */
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload);
    return response.data;
  },
};

export default AuthService;
