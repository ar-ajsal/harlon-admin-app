/**
 * Shared formatting utilities.
 *
 * Rule: If a formatting function is used in more than one file, it lives here.
 * Never duplicate formatCurrency, formatDate, or similar helpers across screens.
 */

/**
 * Formats a number as Indian Rupees.
 * Example: 12500 → "₹12,500"
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Formats an ISO date string as a short readable date.
 * Example: "2024-01-15T10:30:00Z" → "15 Jan"
 */
export function formatShortDate(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Formats an ISO date string as a full readable date.
 * Example: "2024-01-15T10:30:00Z" → "15 Jan 2024"
 */
export function formatFullDate(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats an ISO date string as a full readable date + time.
 * Example: "2024-01-15T10:30:00Z" → "15 Jan 2024, 10:30 AM"
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Returns a time-appropriate greeting.
 * Used in the Dashboard header.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
