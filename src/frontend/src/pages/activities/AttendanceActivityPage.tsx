import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Users, Calendar, Clock, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Điểm danh hoạt động</h1>
            </div>
            <p className="text-green-100">
              Điểm danh người tham gia hoạt động và tự động cộng điểm
            </p>
          </div>

          {/* Activity Selection */}
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn hoạt động <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="">-- Chọn hoạt động --</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} - {new Date(activity.startDate).toLocaleDateString('vi-VN')}
                </option>
              ))}
            </select>
          </div>

          {/* Search & Stats */}
          {selectedActivityId && (
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhân viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">Tổng số</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600 font-medium">Chờ điểm danh</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">{stats.registered}</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Có mặt</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{stats.attended}</div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Vắng mặt</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">{stats.absent}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Batch Actions */}
        {selectedActivityId && selectedParticipants.size > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Đã chọn {selectedParticipants.size} người
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleBatchAttendance('attended')}
                  disabled={processing}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {processing ? 'Đang xử lý...' : 'Có mặt'}
                </button>
                <button
                  onClick={() => handleBatchAttendance('absent')}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {processing ? 'Đang xử lý...' : 'Vắng mặt'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : selectedActivityId ? (
          filteredParticipants.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={allNotAttendedSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={notAttendedCount === 0}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Chọn tất cả ({notAttendedCount} chưa điểm danh)
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredParticipants.map(participant => {
                  const isAttended = participant.status === 'attended';
                  const isAbsent = participant.status === 'absent';
                  const isRegistered = participant.status === 'registered';
                  const isSelected = selectedParticipants.has(participant.employeeId);

                  return (
                    <div
                      key={participant.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                        isAttended ? 'bg-green-50' : isAbsent ? 'bg-red-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectParticipant(participant.employeeId, e.target.checked)}
                            disabled={!isRegistered || processing}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
                          />

                          {/* Avatar */}
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold text-lg">
                              {participant.employeeName.charAt(0)}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {participant.employeeName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {participant.employeeCode} • Đăng ký: {new Date(participant.registerDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isAttended && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Có mặt
                              </span>
                            )}
                            {isAbsent && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                Vắng mặt
                              </span>
                            )}
                            {isRegistered && (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Chưa điểm danh
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions (only for registered) */}
                        {isRegistered && (
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleSingleAttendance(participant.employeeId, 'attended')}
                              disabled={processing}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Có mặt
                            </button>
                            <button
                              onClick={() => handleSingleAttendance(participant.employeeId, 'absent')}
                              disabled={processing}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Vắng
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy người tham gia
              </h3>
              <p className="text-gray-600">
                Chưa có nhân viên nào đăng ký hoạt động này.
              </p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chọn hoạt động để bắt đầu
            </h3>
            <p className="text-gray-600">
              Vui lòng chọn một hoạt động từ danh sách phía trên
            </p>
          </div>
        )}
      </div>
    </div>
  );
}