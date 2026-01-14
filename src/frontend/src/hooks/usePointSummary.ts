/**
 * usePointSummary - Hook for fetching point summary statistics
 * Single Responsibility: Manage point summary state
 */

import { useState, useEffect } from 'react';
import { pointService } from '../services/pointService';
import type { PointSummary } from '../types/reward';

interface UsePointSummaryReturn {
  summary: PointSummary | null;
  loading: boolean;
  error: string | null;
}

/**
 * Calculate period stats from transactions (current month)
 */
function calculatePeriodStats(employeeId: number): Promise<{ earned: number; redeemed: number }> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return pointService.getPointTransactions(
    1,
    1000,
    employeeId,
    undefined,
    firstDayOfMonth.toISOString().split('T')[0],
    undefined
  ).then(result => {
    let earned = 0;
    let redeemed = 0;
    
    result.items.forEach(transaction => {
      if (transaction.type === 'earn') {
        earned += transaction.value;
      } else if (transaction.type === 'redeem') {
        redeemed += Math.abs(transaction.value);
      }
    });
    
    return { earned, redeemed };
  });
}

export function usePointSummary(employeeId: number): UsePointSummaryReturn {
  const [summary, setSummary] = useState<PointSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const [pointData, periodStats, conversionRule] = await Promise.all([
          pointService.getEmployeePoint(employeeId),
          calculatePeriodStats(employeeId),
          pointService.getActiveConversionRule()
        ]);
        
        // Calculate conversion rate from backend rule
        const conversionRate = conversionRule.moneyValue / conversionRule.pointValue;
        
        setSummary({
          current: pointData.pointTotal || 0,
          earnedThisPeriod: periodStats.earned,
          redeemedThisPeriod: periodStats.redeemed,
          conversionRate: conversionRate,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải thông tin điểm');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [employeeId]);

  return { summary, loading, error };
}
