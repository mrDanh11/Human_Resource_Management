/**
 * useRewardHistory - Custom hook for reward transaction history
 * Single Responsibility: Manage transaction history state and fetching
 * Dependency Inversion: Depends on pointService abstraction
 */

import { useState, useEffect, useCallback } from 'react';
import { pointService, type PointTransactionDto } from '../services/pointService';
import type { TransactionFilter, TransactionRecord } from '../types/reward';

interface UseRewardHistoryReturn {
  transactions: TransactionRecord[];
  loading: boolean;
  error: string | null;
  filters: TransactionFilter;
  setFilters: (filters: TransactionFilter) => void;
  refresh: () => void;
}

/**
 * Map backend DTO to frontend Transaction type
 * Open/Closed: Easy to extend mapping without modifying hook
 */
function mapTransactionDto(dto: PointTransactionDto): TransactionRecord {
  return {
    id: dto.id,
    date: dto.createdAt,
    type: dto.type,
    typeDisplay: dto.typeDisplay,
    amount: dto.value,
    description: dto.description || 'Không có mô tả',
    status: 'success', // backend doesn't track status yet
    statusDisplay: 'Thành công',
    actor: dto.actorName || undefined,
  };
}

export function useRewardHistory(employeeId: number): UseRewardHistoryReturn {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilter>({});

  const fetchTransactions = useCallback(async () => {
    if (!employeeId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the paginated API with filters
      const result = await pointService.getPointTransactions(
        1, // pageNumber
        1000, // pageSize - get all records for now
        employeeId,
        filters.type,
        filters.fromDate,
        filters.toDate
      );
      
      const mapped = result.items.map(mapTransactionDto);
      setTransactions(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải lịch sử');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchTransactions,
  };
}
