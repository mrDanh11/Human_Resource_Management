import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, Calendar, Filter, RefreshCcw } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="w-3 h-3" />
            Chờ duyệt
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Đã duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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
    <div className="bg-white rounded-b-xl shadow-sm p-6 border border-gray-100">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Lịch sử quy đổi điểm</h2>
          <p className="text-sm text-gray-500">Toàn bộ yêu cầu quy đổi điểm sang tiền trong hệ thống</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>
          
          <button
            onClick={fetchHistory}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Làm mới"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-12 text-red-600">
          <XCircle className="h-12 w-12 mb-4" />
          <p className="font-medium">{error}</p>
          <button 
            onClick={fetchHistory} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Chưa có yêu cầu quy đổi nào</p>
          <p className="text-sm text-gray-400 mt-1">
            Các yêu cầu quy đổi điểm sẽ hiển thị tại đây
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nhân viên</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Điểm đổi</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Tiền nhận</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ngày yêu cầu</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ngày xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{item.employeeName}</div>
                        <div className="text-xs text-gray-500">{item.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                        {item.pointRequested}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                        {item.moneyReceived.toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.processedAt ? (
                        formatDate(item.processedAt)
                      ) : (
                        <span className="text-gray-400 italic">Chưa xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Hiển thị {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)} trên {totalCount}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Trước
                </button>
                <span className="px-3 py-1 text-gray-600 font-medium">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}