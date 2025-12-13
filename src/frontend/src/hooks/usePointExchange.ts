import { useState, useEffect } from "react";
import { pointService } from "../services/pointService";

interface UsePointExchangeReturn {
  currentPoints: number;
  conversionRate: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePointExchange(employeeId: number): UsePointExchangeReturn {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [conversionRate, setConversionRate] = useState(50000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const pointData = await pointService.getEmployeePoint(employeeId);
      const ruleData = await pointService.getActiveConversionRule();

      setCurrentPoints(pointData.pointTotal);
      setConversionRate(ruleData.moneyValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  return {
    currentPoints,
    conversionRate,
    loading,
    error,
    refetch: fetchData,
  };
}
