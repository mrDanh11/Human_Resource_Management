/**
 * usePointSummary - Hook for fetching point summary statistics
 * Single Responsibility: Manage point summary state
 */

import { useState, useEffect } from 'react';
import { pointService, type EmployeePointDto } from '../services/pointService';
import type { PointSummary } from '../types/reward';

interface UsePointSummaryReturn {
  summary: PointSummary | null;
  loading: boolean;
  error: string | null;
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
        const pointData: EmployeePointDto = await pointService.getEmployeePoint(employeeId);
        
        // TODO: Enhance backend to return period stats
        // For now, we'll use total points as current
        setSummary({
          current: pointData.pointTotal || 0,
          earnedThisPeriod: 0, // would come from backend
          redeemedThisPeriod: 0, // would come from backend  
          conversionRate: 1000, // 1 point = 1000 VND (should come from backend)
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
