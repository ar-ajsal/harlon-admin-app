/**
 * Central environment configuration.
 * All environment-specific values live here.
 * Never hardcode URLs or secrets directly in services.
 */
export const ENV = {
  API_BASE_URL: 'https://api.harlon.shop/api',
  API_TIMEOUT_MS: 15_000,
  APP_NAME: 'Harlon Admin',
  APP_VERSION: '1.0.0',
} as const;
