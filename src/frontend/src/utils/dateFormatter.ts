/**
 * Utility functions for date formatting
 */

/**
 * Format date to Vietnamese locale
 */
export function formatDateVN(value?: string | number | Date): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("vi-VN");
}

/**
 * Format date with custom format
 */
export function formatDate(value?: string | number | Date, locale: string = "vi-VN"): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(locale);
}
