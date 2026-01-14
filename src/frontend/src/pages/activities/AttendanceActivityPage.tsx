import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Users, Calendar, Clock, AlertCircle, Sparkles, TrendingUp, Award } from 'lucide-react';
import { participationService } from '../../services/participationService';
import { getAllActivities } from '../../services/activityService';
import type { Activity } from '../../types/activity';

interface ParticipantForAttendance {
  id: number;
  employeeId: number;
  activityId: number;
  employeeName: string;
  employeeCode: string;
  status: string;
  registerDate: string;
}

export default function AttendancePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<ParticipantForAttendance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (selectedActivityId) {
      fetchParticipants(selectedActivityId);
    }
  }, [selectedActivityId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getAllActivities({ page: 1, pageSize: 100 });
      
      // Lọc hoạt động đang diễn ra hoặc sắp diễn ra
      const now = new Date();
      const activeActivities = response.activities.filter((a: Activity) => {
        const endDate = new Date(a.endDate);
        const status = a.status?.toLowerCase().trim();
        return (endDate >= now || status === 'ongoing') && status !== 'cancelled';
      });
      
      setActivities(activeActivities);
    } catch (error) {
      console.error('Failed to fetch activities', error);
      alert('Không thể tải danh sách hoạt động');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (activityId: number) => {
    try {
      setLoading(true);
      
      // ⭐ Reset dữ liệu cũ NGAY khi bắt đầu fetch
      setParticipants([]);
      setSelectedParticipants(new Set());
      
      const data = await participationService.getActivityParticipants(activityId);
      
      // Lấy những người đã đăng ký (registered) hoặc đã điểm danh
      const registeredParticipants = data
        .filter(p => p.status === 'registered' || p.status === 'attended' || p.status === 'absent')
        .map(p => ({
          id: p.id,
          employeeId: p.employeeId,
          activityId: p.activityId,
          employeeName: p.employeeName,
          employeeCode: `EMP${p.employeeId.toString().padStart(3, '0')}`,
          status: p.status,
          registerDate: p.registerDate,
        }));
      
      setParticipants(registeredParticipants);
      
      // Set selected activity
      const activity = activities.find(a => a.id === activityId);
      setSelectedActivity(activity || null);
    } catch (error: any) {
      console.error('Failed to fetch participants', error);
      
      // ⭐ Nếu là lỗi "Không tìm thấy" thì đó là empty, không cần alert
      const isEmptyError = error?.message?.includes('Không tìm thấy') || 
                          error?.message?.includes('chưa tham gia');
      
      // ⭐ Đảm bảo reset về empty state
      setParticipants([]);
      setSelectedParticipants(new Set());
      
      // Set selected activity để hiển thị empty state
      const activity = activities.find(a => a.id === activityId);
      setSelectedActivity(activity || null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const notAttendedIds = filteredParticipants
        .filter(p => p.status === 'registered')
        .map(p => p.employeeId);
      setSelectedParticipants(new Set(notAttendedIds));
    } else {
      setSelectedParticipants(new Set());
    }
  };

  const handleSelectParticipant = (employeeId: number, checked: boolean) => {
    const newSelected = new Set(selectedParticipants);
    if (checked) {
      newSelected.add(employeeId);
    } else {
      newSelected.delete(employeeId);
    }
    setSelectedParticipants(newSelected);
  };

  const handleBatchAttendance = async (status: 'attended' | 'absent') => {
    if (selectedParticipants.size === 0) {
      alert('Vui lòng chọn ít nhất một người để điểm danh');
      return;
    }

    if (!selectedActivityId) return;

    const confirmMessage = status === 'attended'
      ? `Xác nhận điểm danh CÓ MẶT cho ${selectedParticipants.size} người?`
      : `Xác nhận điểm danh VẮNG MẶT cho ${selectedParticipants.size} người?`;

    if (!confirm(confirmMessage)) return;

    try {
      setProcessing(true);

      const attendances = Array.from(selectedParticipants).map(employeeId => ({
        employeeId,
        status,
      }));

      const result = await participationService.batchUpdateAttendance(selectedActivityId, {
        attendances,
      });

      if (result.successCount > 0) {
        alert(`✅ Điểm danh thành công ${result.successCount} người`);
        
        if (result.failCount > 0) {
          console.error('Errors:', result.errors);
          alert(`⚠️ ${result.failCount} người điểm danh thất bại`);
        }

        // Refresh data
        await fetchParticipants(selectedActivityId);
        setSelectedParticipants(new Set());
      } else {
        alert('❌ Điểm danh thất bại');
      }
    } catch (error) {
      console.error('Failed to update attendance', error);
      alert('Lỗi khi điểm danh. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSingleAttendance = async (
    employeeId: number,
    status: 'attended' | 'absent'
  ) => {
    if (!selectedActivityId) return;

    try {
      setProcessing(true);

      await participationService.updateAttendanceStatus(selectedActivityId, employeeId, {
        status,
      });

      alert('✅ Điểm danh thành công');
      await fetchParticipants(selectedActivityId);
    } catch (error) {
      console.error('Failed to update attendance', error);
      alert('Lỗi khi điểm danh. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: participants.length,
    registered: participants.filter(p => p.status === 'registered').length,
    attended: participants.filter(p => p.status === 'attended').length,
    absent: participants.filter(p => p.status === 'absent').length,
  };

  const notAttendedCount = filteredParticipants.filter(p => p.status === 'registered').length;
  const allNotAttendedSelected = notAttendedCount > 0 && 
    filteredParticipants
      .filter(p => p.status === 'registered')
      .every(p => selectedParticipants.has(p.employeeId));

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-pink-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-8 border border-white/20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative bg-linear-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-8 py-8">
            <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <motion.div 
                  className="p-3 bg-white/20 backdrop-blur-md rounded-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-linear-to-r from-white to-blue-100">
                    Điểm danh hoạt động
                  </h1>
                  <p className="text-blue-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Điểm danh người tham gia và tự động cộng điểm thưởng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Selection */}
          <div className="p-8 bg-linear-to-br from-white to-purple-50/30">
            <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Chọn hoạt động <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(Number(e.target.value))}
              className="w-full px-5 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white shadow-sm transition-all duration-200 text-gray-800 font-medium hover:border-purple-300"
            >
              <option value="">🎯 -- Chọn hoạt động --</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  🎪 {activity.name} - {new Date(activity.startDate).toLocaleDateString('vi-VN')}
                </option>
              ))}
            </select>
          </div>

          {/* Search & Stats */}
          {selectedActivityId && (
            <div className="p-8 border-t border-purple-100">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm nhân viên theo tên hoặc mã..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white shadow-sm transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  className="group bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-blue-100 font-semibold">Tổng số</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.total}</div>
                  <div className="mt-2 text-xs text-blue-100">người đăng ký</div>
                </motion.div>

                <motion.div 
                  className="group bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-orange-100 font-semibold">Chờ điểm danh</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.registered}</div>
                  <div className="mt-2 text-xs text-orange-100">chưa xác nhận</div>
                </motion.div>

                <motion.div 
                  className="group bg-linear-to-br from-emerald-500 to-green-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-green-100 font-semibold">Có mặt</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.attended}</div>
                  <div className="mt-2 text-xs text-green-100">đã xác nhận</div>
                </motion.div>

                <motion.div 
                  className="group bg-linear-to-br from-red-500 to-pink-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                      <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-pink-100 font-semibold">Vắng mặt</span>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.absent}</div>
                  <div className="mt-2 text-xs text-pink-100">không tham gia</div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Batch Actions */}
        <AnimatePresence>
          {selectedActivityId && selectedParticipants.size > 0 && (
            <motion.div 
              className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl border border-purple-400/30 p-6 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-lg">
                    🎯 Đã chọn {selectedParticipants.size} người
                  </span>
                  <p className="text-purple-100 text-sm">Thực hiện điểm danh hàng loạt</p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleBatchAttendance('attended')}
                  disabled={processing}
                  className="px-8 py-3 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                  whileHover={!processing ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!processing ? { scale: 0.95 } : {}}
                >
                  <CheckCircle className="w-5 h-5" />
                  {processing ? '⏳ Đang xử lý...' : '✅ Có mặt'}
                </motion.button>
                <motion.button
                  onClick={() => handleBatchAttendance('absent')}
                  disabled={processing}
                  className="px-8 py-3 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                  whileHover={!processing ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!processing ? { scale: 0.95 } : {}}
                >
                  <XCircle className="w-5 h-5" />
                  {processing ? '⏳ Đang xử lý...' : '❌ Vắng mặt'}
                </motion.button>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-8 border-purple-200 border-t-purple-600 mx-auto"></div>
              <Sparkles className="w-8 h-8 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">✨ Đang tải dữ liệu...</p>
            </motion.div>
          ) : selectedActivityId ? (
          filteredParticipants.length > 0 ? (
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              {/* Table Header */}
              <div className="bg-linear-to-r from-purple-100 via-blue-100 to-indigo-100 px-8 py-5 border-b border-purple-200">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={allNotAttendedSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={notAttendedCount === 0}
                    className="w-5 h-5 text-purple-600 border-purple-300 rounded-lg focus:ring-purple-500 focus:ring-2 disabled:opacity-50 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Chọn tất cả ({notAttendedCount} chưa điểm danh)
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-purple-100">
                {filteredParticipants.map((participant, index) => {
                  const isAttended = participant.status === 'attended';
                  const isAbsent = participant.status === 'absent';
                  const isRegistered = participant.status === 'registered';
                  const isSelected = selectedParticipants.has(participant.employeeId);

                  return (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-8 py-6 transition-all duration-300 ${
                        isAttended 
                          ? 'bg-linear-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100' 
                          : isAbsent 
                          ? 'bg-linear-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100' 
                          : 'hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50'
                      } ${isSelected ? 'ring-2 ring-purple-400 bg-purple-50' : ''}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5 flex-1">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectParticipant(participant.employeeId, e.target.checked)}
                            disabled={!isRegistered || processing}
                            className="w-5 h-5 text-purple-600 border-purple-300 rounded-lg focus:ring-purple-500 focus:ring-2 disabled:opacity-50 cursor-pointer"
                          />

                          {/* Avatar */}
                          <div className="relative">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transform transition-transform hover:scale-110 ${
                              isAttended 
                                ? 'bg-linear-to-br from-emerald-400 to-green-500 text-white' 
                                : isAbsent 
                                ? 'bg-linear-to-br from-red-400 to-pink-500 text-white' 
                                : 'bg-linear-to-br from-purple-400 to-blue-500 text-white'
                            }`}>
                              {participant.employeeName.charAt(0)}
                            </div>
                            {isAttended && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {isAbsent && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                                <XCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {participant.employeeName}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
                                {participant.employeeCode}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Đăng ký: {new Date(participant.registerDate).toLocaleDateString('vi-VN')}
                              </span>
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isAttended && (
                              <span className="px-4 py-2 bg-linear-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg">
                                <CheckCircle className="w-5 h-5" />
                                ✅ Có mặt
                              </span>
                            )}
                            {isAbsent && (
                              <span className="px-4 py-2 bg-linear-to-r from-red-500 to-pink-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg">
                                <XCircle className="w-5 h-5" />
                                ❌ Vắng mặt
                              </span>
                            )}
                            {isRegistered && (
                              <span className="px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-lg animate-pulse">
                                <Clock className="w-5 h-5" />
                                ⏳ Chờ điểm danh
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions (only for registered) */}
                        {isRegistered && (
                          <div className="flex gap-3 ml-6">
                            <motion.button
                              onClick={() => handleSingleAttendance(participant.employeeId, 'attended')}
                              disabled={processing}
                              className="px-6 py-3 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                              whileHover={!processing ? { scale: 1.05, y: -2 } : {}}
                              whileTap={!processing ? { scale: 0.95 } : {}}
                            >
                              ✅ Có mặt
                            </motion.button>
                            <motion.button
                              onClick={() => handleSingleAttendance(participant.employeeId, 'absent')}
                              disabled={processing}
                              className="px-6 py-3 bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                              whileHover={!processing ? { scale: 1.05, y: -2 } : {}}
                              whileTap={!processing ? { scale: 0.95 } : {}}
                            >
                              ❌ Vắng
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-linear-to-br from-purple-100 to-blue-100 rounded-full mx-auto flex items-center justify-center">
                  <AlertCircle className="w-16 h-16 text-purple-400" />
                </div>
                <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-1/3 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                🔍 Không tìm thấy người tham gia
              </h3>
              <p className="text-gray-600 text-lg">
                Chưa có nhân viên nào đăng ký hoạt động này.
              </p>
            </motion.div>
          )
        ) : (
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="relative mb-6">
              <div className="w-32 h-32 bg-linear-to-br from-purple-100 to-blue-100 rounded-full mx-auto flex items-center justify-center">
                <Calendar className="w-16 h-16 text-purple-400" />
              </div>
              <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-1/3 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🎯 Chọn hoạt động để bắt đầu
            </h3>
            <p className="text-gray-600 text-lg">
              Vui lòng chọn một hoạt động từ danh sách phía trên
            </p>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}