import React, { useState, useMemo, useEffect } from 'react';
import { Search, RefreshCw, Download, Plus, ChevronLeft, ChevronRight, Edit, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllAttendances, updateAttendanceRecord, createAttendanceRecord } from '../../store/attendanceSlice';
import EditAttendanceModal from '../../components/attendance/EditAttendanceModal';
import CreateAttendanceModal from '../../components/attendance/CreateAttendanceModal';

const AttendanceManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { allAttendances, allAttendancesLoading, error } = useAppSelector(state => state.attendance);
  
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2024-01-31');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [itemsPerPage] = useState(5);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    checkIn: '',
    checkOut: '',
    status: '',
    note: ''
  });
  const [createFormData, setCreateFormData] = useState({
    employeeId: '',
    date: '',
    checkIn: '',
    checkOut: '',
    status: '',
    note: ''
  });

  // Fetch data khi component mount
  useEffect(() => {
    dispatch(fetchAllAttendances({}));
  }, [dispatch]);

  const transformedRecords = useMemo(() => {
    return allAttendances;
  }, [allAttendances]);

  // Tạo danh sách unique employees từ API data
  const uniqueEmployees = useMemo(() => {
    const employeeMap = new Map();
    transformedRecords.forEach(record => {
      if (!employeeMap.has(record.employeeId)) {
        employeeMap.set(record.employeeId, {
          id: record.employeeId,
          name: record.employeeName
        });
      }
    });
    return Array.from(employeeMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [transformedRecords]);

  const filteredRecords = useMemo(() => {
    return transformedRecords.filter(record => {
      const matchesEmployee = selectedEmployee === 'all' || record.employeeId === selectedEmployee;
      return matchesEmployee;
    });
  }, [transformedRecords, selectedEmployee]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Chọn tất cả records trong trang hiện tại
      const currentIds = currentRecords.map(r => r.id);
      setSelectedRecords(prev => {
        // Thêm các IDs mới mà chưa có trong danh sách
        const newIds = currentIds.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      });
    } else {
      // Bỏ chọn tất cả records trong trang hiện tại
      const currentIds = currentRecords.map(r => r.id);
      setSelectedRecords(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  const handleSelectRecord = (id: string) => {
    setSelectedRecords(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedEmployee('all');
    setFromDate('2024-01-01');
    setToDate('2024-01-31');
    setCurrentPage(1);
    // Fetch lại tất cả dữ liệu
    dispatch(fetchAllAttendances({}));
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
    const params: any = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (selectedEmployee !== 'all') params.employeeId = parseInt(selectedEmployee);
    
    dispatch(fetchAllAttendances(params));
  };

  const handleEditRecord = (record: any) => {
    setEditingRecord(record);
    setEditFormData({
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      note: ''
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
    setEditFormData({
      checkIn: '',
      checkOut: '',
      status: '',
      note: ''
    });
  };

  const handleSaveChanges = async () => {
    if (!editingRecord) return;

    try {
      // Chuẩn bị dữ liệu để gửi API
      const updateData: any = {};
      
      // Chỉ gửi những field đã thay đổi
      if (editFormData.checkIn) {
        // Parse date từ editingRecord.date (format: DD/MM/YYYY -> YYYY-MM-DD)
        const dateParts = editingRecord.date.split('/');
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        updateData.checkinTime = `${isoDate}T${editFormData.checkIn}:00`;
      }
      
      if (editFormData.checkOut) {
        const dateParts = editingRecord.date.split('/');
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        updateData.checkoutTime = `${isoDate}T${editFormData.checkOut}:00`;
      }
      
      // Map status từ local sang API format
      if (editFormData.status) {
        const statusMap: Record<string, 'present' | 'absent' | 'late' | 'half_day' | 'wfh'> = {
          'normal': 'present',
          'late': 'late',
          'missing': 'absent',
          'on-leave': 'half_day'
        };
        updateData.status = statusMap[editFormData.status] || 'present';
      }
      
      if (editFormData.note) {
        updateData.note = editFormData.note;
      }

      // Gọi API thông qua thunk
      await dispatch(updateAttendanceRecord({
        id: parseInt(editingRecord.id),
        data: updateData
      })).unwrap();

      // Đóng modal và hiển thị thông báo thành công
      handleCloseModal();
      alert('Cập nhật chấm công thành công!');
    } catch (error: any) {
      console.error('Error updating attendance:', error);
      alert(error || 'Có lỗi xảy ra khi cập nhật chấm công!');
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateFormChange = (field: string, value: string) => {
    setCreateFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenCreateModal = () => {
    setCreateFormData({
      employeeId: '',
      date: '',
      checkIn: '',
      checkOut: '',
      status: '',
      note: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({
      employeeId: '',
      date: '',
      checkIn: '',
      checkOut: '',
      status: '',
      note: ''
    });
  };

  const handleCreateAttendance = async () => {
    // Validate required fields
    if (!createFormData.employeeId || !createFormData.date || !createFormData.status) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    try {
      const payload: any = {
        employeeId: parseInt(createFormData.employeeId),
        date: createFormData.date,
        status: createFormData.status as 'present' | 'absent' | 'late' | 'half_day' | 'wfh'
      };

      // Add optional fields
      if (createFormData.checkIn) {
        payload.checkinTime = `${createFormData.date}T${createFormData.checkIn}:00`;
      }
      if (createFormData.checkOut) {
        payload.checkoutTime = `${createFormData.date}T${createFormData.checkOut}:00`;
      }
      if (createFormData.note) {
        payload.note = createFormData.note;
      }

      await dispatch(createAttendanceRecord(payload)).unwrap();
      
      handleCloseCreateModal();
      alert('Thêm bản ghi chấm công thành công!');
    } catch (error: any) {
      console.error('Error creating attendance:', error);
      alert(error || 'Có lỗi xảy ra khi tạo bản ghi!');
    }
  };

  const handleExportCSV = () => {
    // Lọc ra các records đã được chọn
    const selectedData = transformedRecords.filter(record => 
      selectedRecords.includes(record.id)
    );

    if (selectedData.length === 0) {
      alert('Vui lòng chọn ít nhất một bản ghi để xuất!');
      return;
    }

    // Tạo CSV header
    const headers = ['ID', 'Nhân viên', 'ID Nhân viên', 'Ngày làm việc', 'Giờ vào', 'Giờ ra', 'Trạng thái'];
    
    // Tạo CSV rows
    const rows = selectedData.map(record => [
      record.id,
      record.employeeName,
      record.employeeId,
      record.date,
      record.checkIn,
      record.checkOut,
      record.statusText
    ]);

    // Kết hợp header và rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Tạo BOM cho UTF-8 để Excel hiển thị đúng tiếng Việt
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Tạo link download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `cham-cong-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Đã xuất ${selectedData.length} bản ghi thành công!`);
  };

  const getStatusBadge = (status: string, text: string) => {
    const statusConfig: Record<string, string> = {
      'normal': 'bg-green-100 text-green-700',
      'late': 'bg-orange-100 text-orange-700',
      'missing': 'bg-red-100 text-red-700',
      'on-leave': 'bg-gray-100 text-gray-700'
    };

    return (
      <span className={`px-3 py-1 rounded text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-700'}`}>
        {text}
      </span>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-8 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 text-white shadow-2xl overflow-hidden border border-white/20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Users className="w-7 h-7" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Quản lý chấm công</h1>
                <p className="text-blue-100 text-lg font-light">Theo dõi và quản lý thời gian làm việc của nhân viên</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border-2 border-purple-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bộ lọc tìm kiếm</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Nhân viên */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nhân viên
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white hover:border-purple-300"
              >
                <option value="all">Tất cả nhân viên</option>
                {uniqueEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </motion.div>

            {/* Từ ngày */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white hover:border-purple-300"
              />
            </motion.div>

            {/* Đến ngày */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white hover:border-purple-300"
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleSearch}
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-4 h-4" />
              Tìm kiếm
            </motion.button>
            <motion.button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-md"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </motion.button>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-6 border-b-2 border-purple-100 bg-linear-to-r from-purple-50 to-blue-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-linear-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Danh sách chấm công</h2>
            </div>
            <div className="flex gap-3">
              <motion.button 
                onClick={handleExportCSV}
                className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Xuất CSV ({selectedRecords.length})
              </motion.button>
              <motion.button 
                onClick={handleOpenCreateModal}
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Thêm bản ghi
              </motion.button>
            </div>
          </div>

          {allAttendancesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 font-semibold">{error}</div>
            </div>
          ) : allAttendances.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500 font-semibold">Không có dữ liệu chấm công</div>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={currentRecords.length > 0 && currentRecords.every(r => selectedRecords.includes(r.id))}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Ngày làm việc
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Giờ vào
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Giờ ra
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-purple-50 hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 transition-all`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                        className="w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {record.avatar}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-gray-900">{record.employeeName}</div>
                          <div className="text-xs text-gray-500">ID: {record.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${record.checkIn === '--:--' ? 'text-red-500' : record.status === 'late' ? 'text-orange-500' : 'text-green-600'}`}>
                        {record.checkIn}
                      </span>
                      {record.status === 'late' && record.checkIn !== '--:--' && (
                        <div className="text-xs text-orange-500">Muộn 15 phút</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${record.checkOut === '--:--' ? 'text-red-500' : 'text-gray-700'}`}>
                        {record.checkOut}
                      </span>
                      {record.checkOut === '--:--' && record.checkIn !== '--:--' && (
                        <div className="text-xs text-red-500">Chưa check-out</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(record.status, record.statusText)}
                    </td>
                    <td className="px-6 py-4">
                      <motion.button 
                        onClick={() => handleEditRecord(record)}
                        className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-md"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Điều chỉnh
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t-2 border-purple-100 bg-purple-50/50 flex items-center justify-between">
            <div className="text-sm text-gray-700 font-medium">
              Hiện thị <span className="font-bold text-blue-600">{startIndex + 1}</span> - <span className="font-bold text-blue-600">{Math.min(endIndex, filteredRecords.length)}</span> trong tổng số <span className="font-bold text-blue-600">{filteredRecords.length}</span> bản ghi
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 border-2 border-purple-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-purple-50 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all border-2 flex items-center justify-center ${
                      currentPage === page
                        ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white border-purple-600 shadow-lg'
                        : 'text-gray-700 hover:bg-purple-50 border-purple-200 hover:border-purple-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {page}
                  </motion.button>
                ))}
              </div>

              <motion.button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 border-2 border-purple-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-purple-50 hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        editingRecord={editingRecord}
        formData={editFormData}
        onFormChange={handleFormChange}
        onSave={handleSaveChanges}
      />

      {/* Create Modal */}
      <CreateAttendanceModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        employees={uniqueEmployees}
        formData={createFormData}
        onFormChange={handleCreateFormChange}
        onSave={handleCreateAttendance}
      />
    </motion.div>
  );
};

export default AttendanceManagementPage;
