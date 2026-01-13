import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Search, Send, AlertCircle, Zap, XCircle, Loader2 } from 'lucide-react';
import {
  allMonthlyAttendance,
  workShifts
} from '../../data/attendanceData';
import AttendanceFormModal from '../../components/attendance/AttendanceFormModal';

import type {
    AttendanceStatus
} from '../../data/attendanceData';

const AttendancePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('10/2025');
  const [selectedShift, setSelectedShift] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    employeeId: 1,
    date: '',
    checkinTime: '',
    checkoutTime: '',
    status: 'present',
    overtimeHours: 0,
    note: ''
  });

  // Lấy dữ liệu chấm công theo tháng được chọn
  const currentAttendance = useMemo(() => {
    return allMonthlyAttendance.find(att => att.month === selectedMonth) || allMonthlyAttendance[0];
  }, [selectedMonth]);

  // Lọc dữ liệu theo search
  const filteredRecords = useMemo(() => {
    return currentAttendance.records.filter(record => {
      const matchesSearch = searchQuery === '' || 
        record.date.includes(searchQuery) ||
        record.note.toLowerCase().includes(searchQuery.toLowerCase());
      
      // TODO: Implement shift filtering logic if needed
      return matchesSearch;
    });
  }, [currentAttendance.records, searchQuery]);

  // Phân trang
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset về trang 1 khi filter thay đổi
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, searchQuery]);

  // Hàm render trạng thái với màu sắc
  const getStatusBadge = (status: AttendanceStatus) => {
    const statusConfig = {
      Normal: { label: 'Normal', className: 'bg-green-100 text-green-700' },
      Late: { label: 'Late', className: 'bg-orange-100 text-orange-700' },
      Missing: { label: 'Missing', className: 'bg-red-100 text-red-700' },
      Overtime: { label: 'Overtime', className: 'bg-blue-100 text-blue-700' },
      Leave: { label: 'Leave', className: 'bg-gray-100 text-gray-700' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Hàm render row với màu nền khác nhau
  const getRowClassName = (status: AttendanceStatus, index: number) => {
    if (status === 'Leave') {
      return 'bg-green-50';
    }
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Chuẩn bị dữ liệu gửi lên API
    const payload = {
      employeeId: formData.employeeId,
      date: formData.date,
      checkinTime: formData.checkinTime ? `${formData.date}T${formData.checkinTime}:00` : null,
      checkoutTime: formData.checkoutTime ? `${formData.date}T${formData.checkoutTime}:00` : null,
      status: formData.status,
      overtimeHours: formData.overtimeHours,
      note: formData.note
    };

    try {
      // TODO: Gọi API POST /api/v1/attendance
      console.log('Submitting:', payload);
      
      // Giả lập API call
      alert('Gửi yêu cầu cập nhật chấm công thành công!');
      setIsModalOpen(false);
      
      // Reset form
      setFormData({
        employeeId: 1,
        date: '',
        checkinTime: '',
        checkoutTime: '',
        status: 'present',
        overtimeHours: 0,
        note: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu!');
    }
  };

  // Xử lý thay đổi form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'overtimeHours' || name === 'employeeId' ? Number(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Bảng chấm công cá nhân
              </h1>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Dữ liệu được đồng bộ tự động mỗi 15 phút từ máy chấm công
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tháng/Năm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Tháng/Năm
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-blue-300"
              >
                {allMonthlyAttendance.map(att => (
                  <option key={att.month} value={att.month}>
                    {att.month}
                  </option>
                ))}
              </select>
            </div>

            {/* Ca làm việc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Ca làm việc
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-blue-300"
              >
                {workShifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tìm kiếm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" />
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Nhập ngày hoặc ghi chú..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-blue-300"
              />
            </div>

            {/* Nút gửi yêu cầu */}
            <div className="flex items-end">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Gửi yêu cầu cập nhật
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mb-6 border border-white/20">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Chi tiết chấm công tháng {selectedMonth}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Đang tải dữ liệu chấm công...</p>
              </div>
            </div>
          ) : currentRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Calendar className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Không có dữ liệu chấm công</h3>
              <p className="text-gray-500">Không tìm thấy bản ghi nào trong tháng này</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                    Ngày
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                    Check-in
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                    Check-out
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                    Tổng giờ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <tr 
                    key={record.id}
                    className={`${getRowClassName(record.status, startIndex + index)} border-b border-gray-100 hover:bg-blue-50/50 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkIn || <span className="text-red-500">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkOut || <span className="text-red-500">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {record.totalHours || <span className="text-red-500">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {record.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Pagination */}
          {!isLoading && currentRecords.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">
              Hiển thị <span className="text-blue-600 font-bold">{startIndex + 1}</span> đến{' '}
              <span className="text-blue-600 font-bold">{Math.min(endIndex, filteredRecords.length)}</span> trong tổng số{' '}
              <span className="text-blue-600 font-bold">{filteredRecords.length}</span> bản ghi
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tổng công trong tháng */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Tổng công trong tháng</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  {currentAttendance.summary.totalWorkDays}
                </p>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  ngày
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Đi trễ / Về sớm */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Đi trễ / Về sớm</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                  {currentAttendance.summary.lateOrEarlyCount}
                </p>
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  lần
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Giờ làm thêm */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Giờ làm thêm</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  {currentAttendance.summary.overtimeHours}
                </p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  giờ
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Nghỉ / Thiếu công */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Nghỉ / Thiếu công</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {currentAttendance.summary.absenceOrLeaveCount}
                </p>
                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  ngày
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <XCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Form Cập nhật chấm công */}
        <AttendanceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
