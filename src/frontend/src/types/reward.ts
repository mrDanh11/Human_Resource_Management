/**
 * reward.ts - Định nghĩa types cho hệ thống khen thưởng
 * Quản lý điểm thưởng, lịch sử tích điểm, quy đổi tiền mặt
 * Following Interface Segregation Principle - only what's needed
 */

// Point Summary for dashboard display
export interface PointSummary {
  current: number;
  earnedThisPeriod: number;
  redeemedThisPeriod: number;
  conversionRate: number; // VND per point
}

// Filter options for transaction history
export interface TransactionFilter {
  fromDate?: string;
  toDate?: string;
  type?: string;
  status?: string;
}

// Transaction types enum
export type TransactionType = 'earn' | 'redeem' | 'adjust';

// Transaction status enum  
export type TransactionStatus = 'success' | 'pending' | 'cancelled';

// Single transaction record
export interface TransactionRecord {
  id: number;
  date: string;
  type: string;
  typeDisplay: string;
  amount: number;
  description: string;
  status: string;
  statusDisplay: string;
  actor?: string;
}

// Monthly aggregated statistics
export interface MonthlyStats {
  month: string;
  earned: number;
  redeemed: number;
}

// Export configuration
export interface ExportConfig {
  format: 'pdf' | 'excel';
  filters: TransactionFilter;
}
