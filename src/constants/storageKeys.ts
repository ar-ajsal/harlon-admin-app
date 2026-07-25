/**
 * All AsyncStorage keys used by the app.
 *
 * Centralised here so we never have typos or magic strings scattered
 * across the codebase. If a key changes, we change it in one place.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@harlon/auth_token',
  REMEMBER_LOGIN: '@harlon/remember_login',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
