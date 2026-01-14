/**
 * FilterPanel - Transaction filter sidebar
 * Single Responsibility: Handle filter UI and state
 */

import { useState } from 'react';
import { Filter } from 'lucide-react';
import type { TransactionFilter } from '../../types/reward';

interface FilterPanelProps {
  onFilterChange: (filters: TransactionFilter) => void;
  onClearFilters: () => void;
}

export default function FilterPanel({ onFilterChange, onClearFilters }: FilterPanelProps) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    onFilterChange({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      type: type || undefined,
      status: status || undefined,
    });
  };

  const handleClear = () => {
    setFromDate('');
    setToDate('');
    setType('');
    setStatus('');
    onClearFilters();
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 h-fit sticky top-4 font-['Open_Sans'] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Filter size={20} className="text-white" />
        </div>
        <h4 className="text-lg font-bold text-gray-800">Bộ lọc</h4>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loại giao dịch
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
          >
            <option value="">Tất cả</option>
            <option value="earn">Nhận điểm</option>
            <option value="redeem">Đổi thưởng</option>
            <option value="adjustment">Điều chỉnh</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300"
          >
            <option value="">Tất cả</option>
            <option value="success">Thành công</option>
            <option value="pending">Đang xử lý</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={handleApply}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Áp dụng
          </button>
          <button
            onClick={handleClear}
            className="w-full text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl py-3 text-sm font-semibold transition-all duration-300"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
