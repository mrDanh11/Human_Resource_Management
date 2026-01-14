/**
 * TransactionList - List of transaction records with pagination
 * Single Responsibility: Display list of transactions with empty state and pagination
 */

import { useState } from 'react';
import TransactionItem from './TransactionItem';
import type { TransactionRecord } from '../../types/reward';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionListProps {
  transactions: TransactionRecord[];
  loading: boolean;
  error: string | null;
}

export default function TransactionList({ transactions, loading, error }: TransactionListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
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
        {currentTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t-2 border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, transactions.length)} trong tổng số {transactions.length} giao dịch
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
