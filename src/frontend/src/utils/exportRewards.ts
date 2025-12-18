/**
 * Export utilities for reward transaction history
 * Single Responsibility: Handle export logic
 * TODO: Implement when export feature is needed
 */

import type { TransactionRecord, ExportConfig } from '../types/reward';

/**
 * Export transactions to PDF
 * Uses pdfmake library (already in package.json)
 */
export async function exportToPDF(
  transactions: TransactionRecord[],
  config: ExportConfig
): Promise<void> {
  // TODO: Implement PDF generation using pdfmake
  console.log('Export to PDF:', transactions.length, 'transactions', config);
  throw new Error('PDF export not implemented yet');
}

/**
 * Export transactions to Excel
 * Can use simple CSV or library like xlsx
 */
export async function exportToExcel(
  transactions: TransactionRecord[],
  config: ExportConfig
): Promise<void> {
  // TODO: Implement Excel export
  console.log('Export to Excel:', transactions.length, 'transactions', config);
  throw new Error('Excel export not implemented yet');
}

/**
 * Format transactions to CSV string
 */
function formatToCSV(transactions: TransactionRecord[]): string {
  const headers = ['ID', 'Ngày', 'Loại', 'Số điểm', 'Mô tả', 'Trạng thái'];
  const rows = transactions.map(t => [
    t.id,
    new Date(t.date).toLocaleString('vi-VN'),
    t.typeDisplay,
    t.amount,
    t.description,
    t.statusDisplay,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Download file to user's device
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Quick CSV export (works without additional libraries)
 */
export function exportToCSV(transactions: TransactionRecord[]): void {
  const csv = formatToCSV(transactions);
  const filename = `reward-history-${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}
