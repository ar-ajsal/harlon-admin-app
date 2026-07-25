/**
 * Harlon Admin – Color System
 *
 * Design direction: Dark-mode-first. Premium minimal aesthetic.
 * Inspired by Linear, Stripe Dashboard, and Vercel.
 *
 * Scale:
 *  - Backgrounds: layered surfaces from deep to elevated
 *  - Brand: deep indigo as the primary action color
 *  - Semantic: green (success), amber (warning), red (danger), blue (info)
 *  - Text: 3-tier hierarchy (primary → secondary → muted)
 */

export const Colors = {
  // ─── Brand ──────────────────────────────────────────────────────────────
  brand: {
    primary: '#5B4AE8',       // CTA buttons, active tabs, links
    primaryLight: '#7C6FF0',  // Hover states, pressed states
    primaryDark: '#3D2EC4',   // Active pressed
    primaryMuted: '#2D2560',  // Subtle backgrounds behind brand elements
  },

  // ─── Dark Surfaces (background layers) ──────────────────────────────────
  dark: {
    bg: '#09090F',            // True base background
    surface: '#111118',       // Cards, modals, sheets
    elevated: '#18181F',      // Elevated cards, dropdowns
    border: '#2A2A35',        // Subtle separators
    borderStrong: '#3D3D4D',  // More prominent dividers
  },

  // ─── Light Surfaces ─────────────────────────────────────────────────────
  light: {
    bg: '#F5F5FA',
    surface: '#FFFFFF',
    elevated: '#FFFFFF',
    border: '#E4E4EF',
    borderStrong: '#CACAD8',
  },

  // ─── Text ────────────────────────────────────────────────────────────────
  text: {
    dark: {
      primary: '#F0F0F8',     // Main readable text
      secondary: '#A0A0B8',   // Supporting text, labels
      muted: '#60607A',       // Placeholders, disabled text
      inverse: '#09090F',     // Text on light backgrounds
    },
    light: {
      primary: '#111118',
      secondary: '#555568',
      muted: '#9898AA',
      inverse: '#F0F0F8',
    },
  },

  // ─── Semantic ────────────────────────────────────────────────────────────
  success: {
    default: '#22C55E',
    light: '#16A34A',
    muted: '#14532D',
    bg: '#052E16',
  },
  warning: {
    default: '#F59E0B',
    light: '#D97706',
    muted: '#78350F',
    bg: '#431407',
  },
  danger: {
    default: '#EF4444',
    light: '#DC2626',
    muted: '#7F1D1D',
    bg: '#450A0A',
  },
  info: {
    default: '#3B82F6',
    light: '#2563EB',
    muted: '#1E3A8A',
    bg: '#0C1A40',
  },

  // ─── Order Status ────────────────────────────────────────────────────────
  orderStatus: {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    processing: '#8B5CF6',
    shipped: '#06B6D4',
    delivered: '#22C55E',
    cancelled: '#EF4444',
    returned: '#F97316',
  },

  // ─── Static ──────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
