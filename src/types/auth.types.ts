/**
 * Auth domain types.
 * Matches the Harlon backend's current token-based auth contract exactly.
 */

// ─── Request ────────────────────────────────────────────────────────────────

export interface LoginRequest {
  password: string;
}

// ─── Response ───────────────────────────────────────────────────────────────

export interface AuthToken {
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthToken;
}

// ─── State ──────────────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Form ───────────────────────────────────────────────────────────────────

export interface LoginFormValues {
  password: string;
}
