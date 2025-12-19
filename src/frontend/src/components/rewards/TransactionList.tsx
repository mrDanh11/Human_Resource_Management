/**
 * TransactionList - List of transaction records
 * Single Responsibility: Display list of transactions with empty state
 */

import TransactionItem from './TransactionItem';
import type { TransactionRecord } from '../../types/reward';
import { FileText } from 'lucide-react';

interface TransactionListProps {
  transactions: TransactionRecord[];
  loading: boolean;
  error: string | null;
}

export default function TransactionList({ transactions, loading, error }: TransactionListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-400 shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-3 text-slate-600">Đang tải lịch sử giao dịch...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-400 shadow-sm p-8">
        <div className="text-center text-red-600">
          <p className="font-medium">Lỗi khi tải dữ liệu</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-400 shadow-sm p-12">
        <div className="text-center text-slate-500">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium text-lg">Bạn chưa có lịch sử nhận hoặc đổi điểm thưởng</p>
          <p className="text-sm mt-2">Các giao dịch của bạn sẽ hiển thị tại đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-400 shadow-sm overflow-hidden font-['Open_Sans']">
      <div className="px-6 py-4 border-b border-slate-400 bg-slate-50/50">
        <h3 className="text-sm font-semibold text-[#213547] uppercase tracking-wide">
          Lịch sử giao dịch <span className="text-slate-500 font-normal">({transactions.length})</span>
        </h3>
      </div>
      
      <div className="divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
