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
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <span className="ml-4 text-gray-600 font-semibold">Đang tải lịch sử giao dịch...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border-2 border-red-200 shadow-lg p-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="font-bold text-red-600 text-lg">Lỗi khi tải dữ liệu</p>
          <p className="text-sm mt-2 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-16">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-blue-600" />
          </div>
          <p className="font-bold text-xl text-gray-700 mb-2">Chưa có lịch sử giao dịch</p>
          <p className="text-sm text-gray-500">Các giao dịch của bạn sẽ hiển thị tại đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden font-['Open_Sans'] hover:shadow-xl transition-shadow duration-300">
      <div className="px-6 py-5 border-b-2 border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Lịch sử giao dịch <span className="text-gray-500 font-normal">({transactions.length})</span>
          </h3>
        </div>
      </div>
      
      <div className="divide-y divide-slate-100">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
