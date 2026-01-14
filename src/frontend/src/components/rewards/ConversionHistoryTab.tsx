import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, Calendar, Filter, RefreshCcw, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pointService } from '../../services/pointService';
import type { PointToMoneyHistoryDto, PagedResult } from '../../services/pointService';

export default function ConversionHistoryTab() {
  const [history, setHistory] = useState<PointToMoneyHistoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;
  
  // Filter
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchHistory();
  }, [currentPage, statusFilter]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Không truyền employeeId để lấy tất cả (admin view)
      const response: PagedResult<PointToMoneyHistoryDto> = await pointService.getPointToMoneyHistory(
        currentPage,
        pageSize,
        undefined, // admin xem tất cả
        statusFilter || undefined
      );
      
      setHistory(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error('Error fetching conversion history:', err);
      setError(err.message || 'Không thể tải lịch sử quy đổi điểm');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-yellow-400 to-amber-500 text-white shadow-md">
            <Clock className="w-3 h-3" />
            Chờ duyệt
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-md">
            <CheckCircle className="w-3 h-3" />
            Đã duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-red-500 to-pink-600 text-white shadow-md">
            <XCircle className="w-3 h-3" />
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-200 text-gray-700 shadow-md">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-purple-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-gray-800">Lịch sử quy đổi điểm</h2>
          <p className="text-sm text-gray-500">Toàn bộ yêu cầu quy đổi điểm sang tiền trong hệ thống</p>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-4 py-2 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white hover:border-purple-300 transition-all"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
          
          <motion.button
            onClick={fetchHistory}
            className="p-2 border-2 border-purple-200 rounded-xl hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-all"
            title="Làm mới"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCcw className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          className="flex justify-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="ml-3 text-gray-600 font-medium">Đang tải...</p>
        </motion.div>
      ) : error ? (
        <motion.div 
          className="flex flex-col items-center py-12 text-red-600"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <p className="font-medium text-gray-900">{error}</p>
          <motion.button 
            onClick={fetchHistory} 
            className="mt-4 px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 font-bold shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCcw className="w-4 h-4" />
            Thử lại
          </motion.button>
        </motion.div>
      ) : history.length === 0 ? (
        <motion.div 
          className="text-center py-16 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-purple-100 p-4 rounded-full mb-3">
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-gray-700 font-semibold">Chưa có yêu cầu quy đổi nào</p>
          <p className="text-sm text-gray-500 mt-1">
            Các yêu cầu quy đổi điểm sẽ hiển thị tại đây
          </p>
        </motion.div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border-2 border-purple-100">
            <table className="w-full">
              <thead className="bg-linear-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Điểm đổi</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Tiền nhận</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ngày yêu cầu</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ngày xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50 bg-white">
                {history.map((item, index) => (
                  <motion.tr 
                    key={item.id} 
                    className="hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold shadow-md"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {item.employeeName.charAt(0)}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-gray-900">{item.employeeName}</div>
                          <div className="text-xs text-gray-500">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md">
                        {item.pointRequested}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl text-xs font-bold shadow-md">
                          {item.moneyReceived.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.processedAt ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {formatDate(item.processedAt)}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Chưa xử lý
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">
                Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)} trên {totalCount}
              </span>
              <div className="flex gap-2 items-center">
                <motion.button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-purple-200 rounded-xl disabled:opacity-50 hover:bg-purple-50 disabled:hover:bg-white font-medium transition-all"
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Trước
                </motion.button>
                <span className="px-3 py-2 text-gray-700 font-semibold bg-purple-50 rounded-xl">
                  Trang {currentPage} / {totalPages}
                </span>
                <motion.button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-purple-200 rounded-xl disabled:opacity-50 hover:bg-purple-50 disabled:hover:bg-white font-medium transition-all"
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  Sau
                </motion.button>
              </div>
            </div>
          )}
        </>
      )}
      </AnimatePresence>
    </motion.div>
  );
}