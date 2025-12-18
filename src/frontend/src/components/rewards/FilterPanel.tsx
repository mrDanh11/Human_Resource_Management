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
    <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-slate-400 p-5 h-fit sticky top-4 font-['Open_Sans'] shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Filter size={16} className="text-slate-400" />
        <h4 className="text-sm font-semibold text-[#213547] uppercase tracking-wide">Bộ lọc</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#213547] mb-1.5">
            Từ ngày
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#213547] mb-1.5">
            Đến ngày
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#213547] mb-1.5">
            Loại giao dịch
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white"
          >
            <option value="">Tất cả</option>
            <option value="earn">Nhận điểm</option>
            <option value="redeem">Đổi thưởng</option>
            <option value="adjust">Điều chỉnh</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#213547] mb-1.5">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#535bf2] focus:border-[#535bf2] bg-white"
          >
            <option value="">Tất cả</option>
            <option value="success">Thành công</option>
            <option value="pending">Đang xử lý</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="pt-3 space-y-2">
          <button
            onClick={handleApply}
            className="w-full bg-[#535bf2] hover:bg-[#646cff] text-white rounded-md py-2 text-sm font-medium transition-colors"
          >
            Áp dụng
          </button>
          <button
            onClick={handleClear}
            className="w-full text-[#213547] hover:text-slate-700 hover:bg-slate-50 rounded-md py-2 text-sm font-medium transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
}
