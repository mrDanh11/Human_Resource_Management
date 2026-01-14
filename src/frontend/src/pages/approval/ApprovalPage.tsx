import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, Check, X, Eye, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllRequests, batchProcessRequests, clearError } from '../../store/approvalSlice';
import type { RequestResponseDto } from '../../services/requestForAttendanceService';
import { 
  getRequestTypeDisplay, 
  getRequestStatusDisplay,
  formatRequestDateRange 
} from '../../services/requestForAttendanceService';



const ApprovalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, loading, error } = useAppSelector(state => state.approval);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả trạng thái');
  const [selectedType, setSelectedType] = useState<string>('Tất cả loại');
  const [dateRange, setDateRange] = useState('');
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch requests on component mount
  useEffect(() => {
    dispatch(fetchAllRequests({ type: 'attendance_correction' }));
  }, [dispatch]);

  // Show error alert
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    let filtered = [...requests];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        req.employeeName.toLowerCase().includes(query) ||
        req.employeeEmail.toLowerCase().includes(query) ||
        req.employeeId.toString().includes(query)
      );
    }

    // Filter by status
    if (selectedStatus !== 'Tất cả trạng thái') {
      const statusMap: Record<string, RequestResponseDto['status']> = {
        'Chờ duyệt': 'pending',
        'Đã duyệt': 'approved',
        'Từ chối': 'rejected',
      };
      const mappedStatus = statusMap[selectedStatus];
      if (mappedStatus) {
        filtered = filtered.filter(req => req.status === mappedStatus);
      }
    }

    // Filter by type
    if (selectedType !== 'Tất cả loại') {
      const typeMap: Record<string, RequestResponseDto['type']> = {
        'Làm từ xa': 'wfh',
        'Nghỉ phép': 'leave',
        'Làm thêm giờ': 'overtime',
        'Chỉnh sửa chấm công': 'attendance_correction',
        'Thiết bị': 'equipment',
        'Khác': 'other',
      };
      const mappedType = typeMap[selectedType];
      if (mappedType) {
        filtered = filtered.filter(req => req.type === mappedType);
      }
    }

    return filtered;
  }, [requests, searchQuery, selectedStatus, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRequests.slice(startIndex, endIndex);
  }, [filteredRequests, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedType]);

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRequests(paginatedRequests.map(req => req.id));
    } else {
      setSelectedRequests([]);
    }
  };

  // Handle individual select
  const handleSelectRequest = (id: number) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedRequests.length === 0) {
      alert('Vui lòng chọn ít nhất một yêu cầu');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn phê duyệt ${selectedRequests.length} yêu cầu đã chọn?`)) {
      return;
    }

    try {
      await dispatch(batchProcessRequests({
        requestIds: selectedRequests,
        status: 'approved',
        autoUpdateAttendance: true
      })).unwrap();
      
      alert('Đã phê duyệt các yêu cầu thành công');
      setSelectedRequests([]);
      dispatch(fetchAllRequests({ type: 'attendance_correction' }));
    } catch (error: any) {
      alert(error || 'Không thể phê duyệt một số yêu cầu');
    }
  };

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedRequests.length === 0) {
      alert('Vui lòng chọn ít nhất một yêu cầu');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn từ chối ${selectedRequests.length} yêu cầu đã chọn?`)) {
      return;
    }

    try {
      await dispatch(batchProcessRequests({
        requestIds: selectedRequests,
        status: 'rejected',
        note: 'Yêu cầu không được chấp nhận'
      })).unwrap();
      
      alert('Đã từ chối các yêu cầu');
      setSelectedRequests([]);
      dispatch(fetchAllRequests({ type: 'attendance_correction' }));
    } catch (error: any) {
      alert(error || 'Không thể từ chối một số yêu cầu');
    }
  };

  // Get status badge style
  const getStatusBadge = (status: RequestResponseDto['status']) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'approved': 'bg-green-100 text-green-800 border-green-300',
      'rejected': 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Get type badge style
  const getTypeBadge = (type: RequestResponseDto['type']) => {
    const styles = {
      'wfh': 'bg-blue-50 text-blue-700',
      'leave': 'bg-purple-50 text-purple-700',
      'overtime': 'bg-indigo-50 text-indigo-700',
      'attendance_correction': 'bg-orange-50 text-orange-700',
      'equipment': 'bg-teal-50 text-teal-700',
      'other': 'bg-gray-50 text-gray-700',
    };
    return styles[type] || 'bg-gray-50 text-gray-700';
  };

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      
      <div className="max-w-400 mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-6 relative rounded-2xl p-6 bg-white/90 backdrop-blur-sm overflow-hidden shadow-2xl border-2 border-purple-100"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 opacity-10 rounded-full blur-2xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl -ml-16 -mb-16"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <motion.div 
              className="w-14 h-14 bg-linear-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <CheckCircle className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-1">
                Phê duyệt yêu cầu cập nhật bảng công
              </h1>
              <p className="text-gray-600 font-medium">
                Quản lý và phê duyệt các yêu cầu chỉnh sửa chấm công của nhân viên
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-purple-100 p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bộ lọc tìm kiếm
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </motion.div>

            {/* Status Filter */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all appearance-none bg-white"
              >
                <option>Tất cả trạng thái</option>
                <option>Chờ duyệt</option>
                <option>Đã duyệt</option>
                <option>Từ chối</option>
              </select>
            </motion.div>

            {/* Type Filter */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all appearance-none bg-white"
              >
                <option>Tất cả loại</option>
                <option>Làm từ xa</option>
                <option>Nghỉ phép</option>
                <option>Làm thêm giờ</option>
                <option>Chỉnh sửa chấm công</option>
                <option>Thiết bị</option>
                <option>Khác</option>
              </select>
            </motion.div>

            {/* Date Range */}
            <motion.div 
              className="relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedRequests.length > 0 && (
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-purple-100 p-4 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-bold text-gray-700">
                    Đã chọn <span className="text-purple-600">{selectedRequests.length}</span> yêu cầu
                  </span>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleBulkApprove}
                    className="px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all shadow-md font-semibold text-sm flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="w-4 h-4" />
                    Phê duyệt
                  </motion.button>
                  <motion.button
                    onClick={handleBulkReject}
                    className="px-6 py-2.5 bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl transition-all shadow-md font-semibold text-sm flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                    Từ chối
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-purple-100 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
                <tr>
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRequests.length === paginatedRequests.length && paginatedRequests.length > 0}
                      className="w-4 h-4 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Loại yêu cầu
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                        <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {paginatedRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="hover:bg-linear-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-300"
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRequests.includes(request.id)}
                          onChange={() => handleSelectRequest(request.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm shadow-md">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{request.employeeName}</div>
                            <div className="text-sm text-gray-500">{request.employeeEmail}</div>
                            {request.departmentName && (
                              <div className="text-xs text-gray-400">{request.departmentName}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getTypeBadge(request.type)}`}>
                          {getRequestTypeDisplay(request.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {formatRequestDateRange(request.startTime, request.endTime)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate" title={request.description}>
                        {request.description || 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(request.status)}`}>
                          {getRequestStatusDisplay(request.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <motion.button 
                            className="p-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-md group relative"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-4 h-4" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              Chi tiết
                            </span>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && filteredRequests.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-100 to-blue-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Không tìm thấy yêu cầu</h3>
              <p className="text-gray-600 font-medium">Thử thay đổi bộ lọc hoặc tìm kiếm để xem kết quả</p>
            </motion.div>
          )}

          {/* Footer with pagination */}
          {filteredRequests.length > 0 && (
            <div className="border-t-2 border-purple-100 bg-purple-50/50 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700 font-medium">
                Hiển thị <span className="font-bold text-blue-600">{((currentPage - 1) * itemsPerPage) + 1}</span> - <span className="font-bold text-blue-600">{Math.min(currentPage * itemsPerPage, filteredRequests.length)}</span> trong số <span className="font-bold text-blue-600">{filteredRequests.length}</span> yêu cầu
                {selectedRequests.length > 0 && (
                  <span className="ml-2 text-purple-600 font-bold">
                    ({selectedRequests.length} đã chọn)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <motion.button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-purple-200 rounded-xl bg-white hover:bg-purple-50 hover:border-purple-400 transition-all text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  whileHover={currentPage !== 1 ? { scale: 1.05, y: -2 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Trang trước
                </motion.button>
                <div className="flex items-center gap-2 px-3">
                  <span className="text-sm text-gray-700 font-medium">
                    Trang <span className="font-bold text-purple-600">{currentPage}</span> / <span className="font-bold text-purple-600">{totalPages}</span>
                  </span>
                </div>
                <motion.button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-purple-200 rounded-xl bg-white hover:bg-purple-50 hover:border-purple-400 transition-all text-sm font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  whileHover={currentPage !== totalPages ? { scale: 1.05, y: -2 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  Trang sau
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApprovalPage;
