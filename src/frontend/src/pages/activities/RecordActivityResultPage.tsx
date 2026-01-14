import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar, 
  ClipboardList, 
  XCircle, 
  Edit2,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';
import { participationService } from '../../services/participationService';
import { getAllActivities } from '../../services/activityService';
import type { Activity } from '../../types/activity';
import ResultModal from '../../components/activities/ResultModal'; // Import Modal vừa tạo

interface ParticipantWithResult {
  id: number;
  employeeId: number;
  activityId: number;
  employeeName: string;
  employeeCode: string;
  status: string;
  performance?: string;
  result: Record<string, any> | null;
}

export default function RecordActivityResultPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  
  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<ParticipantWithResult | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (selectedActivityId) {
      fetchParticipants(selectedActivityId);
    }
  }, [selectedActivityId]);

  const hasValidResult = (result: any) => {
    if (!result) return false;
    if (Object.keys(result).length === 0) return false;
    return true;
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getAllActivities({ page: 1, pageSize: 100 });
      const completedActivities = response.activities.filter(
        (a: Activity) => a.status === 'completed' || a.status === 'ongoing'
      );
      setActivities(completedActivities);
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
      const data = await participationService.getActivityParticipants(activityId);
      
      const attendedParticipants = data
        .filter((p: any) => p.status === 'attended')
        .map((p: any) => ({
          id: p.id,
          employeeId: p.employeeId,
          activityId: p.activityId,
          employeeName: p.employeeName,
          employeeCode: `EMP${p.employeeId.toString().padStart(3, '0')}`,
          status: p.status,
          performance: p.performance,
          result: p.result,
        }));
      
      setParticipants(attendedParticipants);
    } catch (error) {
      console.error('Failed to fetch participants', error);
      alert('Không thể tải danh sách người tham gia');
    } finally {
      setLoading(false);
    }
  };

  // --- MODAL HANDLERS ---
  const handleOpenModal = (participant: ParticipantWithResult) => {
    setEditingParticipant(participant);
    setFormData({
      ...(participant.result || {}),
      performance: participant.performance || ''
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // --- SAVE LOGIC (GIỮ NGUYÊN HOÀN TOÀN) ---
  const handleSaveResult = async () => {
    if (!selectedActivityId || !editingParticipant) return;

    try {
      setIsSaving(true);
      const employeeId = editingParticipant.employeeId;
      const rawData = formData;
      
      // Validate performance
      if (!rawData.performance) {
        alert('Vui lòng chọn đánh giá hiệu suất trước khi lưu!');
        setIsSaving(false);
        return;
      }
      
      // Extract performance (will be sent separately)
      const { performance, ...resultOnlyData } = rawData;
      
      // Convert data types for result (Logic parse giữ nguyên)
      const resultData = { ...resultOnlyData };
      if (resultData.distance_m) resultData.distance_m = parseInt(resultData.distance_m) || 0;
      if (resultData.distance_km) resultData.distance_km = parseFloat(resultData.distance_km) || 0;
      if (resultData.rank) resultData.rank = parseInt(resultData.rank) || 0;
      if (resultData.attendance_hours) resultData.attendance_hours = parseInt(resultData.attendance_hours) || 0;
      if (resultData.quiz_score) resultData.quiz_score = parseInt(resultData.quiz_score) || 0;
      if (resultData.hours_contributed) resultData.hours_contributed = parseFloat(resultData.hours_contributed) || 0;
      if (resultData.team_rank) resultData.team_rank = parseInt(resultData.team_rank) || 0;
      if (resultData.points_earned) resultData.points_earned = parseInt(resultData.points_earned) || 0;
      if (resultData.donation_amount) resultData.donation_amount = parseFloat(resultData.donation_amount) || 0;
      if (resultData.hours_volunteered) resultData.hours_volunteered = parseFloat(resultData.hours_volunteered) || 0;
      
      // 1. Update result (JSONB data)
      await participationService.updateParticipationResult(
        selectedActivityId,
        employeeId,
        { resultData }
      );

      // 2. Update performance (separate field)
      await participationService.updatePerformance(
        selectedActivityId,
        employeeId,
        { performance, note: resultData.note }
      );

      alert('Đã lưu kết quả thành công!');
      setIsModalOpen(false);
      await fetchParticipants(selectedActivityId); // Reload data
    } catch (error) {
      console.error('Failed to save result', error);
      alert('Lỗi khi lưu kết quả. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- FILTERING ---
  const searchedParticipants = participants.filter(p =>
    p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = searchedParticipants.filter(p => !hasValidResult(p.result)).length;
  const completedCount = searchedParticipants.filter(p => hasValidResult(p.result)).length;

  const displayedParticipants = searchedParticipants.filter(p => {
    const hasResult = hasValidResult(p.result);
    if (activeTab === 'completed') return hasResult;
    return !hasResult; 
  });

  const selectedActivity = activities.find(a => a.id === selectedActivityId);

  // Helper Badge
  const getPerformanceBadge = (performance?: string) => {
    if (!performance) return <span className="text-gray-400">-</span>;
    const badges: any = {
      excellent: { icon: '⭐', text: 'Xuất sắc', color: 'bg-yellow-100 text-yellow-800' },
      good: { icon: '✅', text: 'Tốt', color: 'bg-green-100 text-green-800' },
      bad: { icon: '⚠️', text: 'Kém', color: 'bg-red-100 text-red-800' }
    };
    const badge = badges[performance];
    if (!badge) return <span>{performance}</span>;
    return (
      <span className={`px-2 py-0.5 ${badge.color} text-xs font-medium rounded-full inline-flex items-center gap-1`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* HEADER */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Award className="w-8 h-8" />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight">Ghi nhận thành tích</h1>
              </div>
              <p className="text-white/90 text-lg font-light ml-16">Ghi nhận kết quả và đánh giá hiệu suất tham gia hoạt động</p>
            </div>
          </div>

          <div className="p-6 border-b border-purple-100">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-600" />
              Chọn hoạt động <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white transition-all shadow-sm hover:border-purple-300"
            >
              <option value="">🎯 -- Chọn hoạt động --</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.status === 'completed' ? '✅' : '🎪'} {activity.name} - {activity.status === 'completed' ? 'Đã hoàn thành' : 'Đang diễn ra'}
                </option>
              ))}
            </select>
          </div>

          {selectedActivityId && (
            <motion.div 
              className="px-6 pt-6 pb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <motion.div 
                  className="flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="bg-blue-500 p-2 rounded-lg shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">Tổng số: <span className="text-blue-600 font-bold text-lg">{participants.length}</span> người</span>
                </motion.div>

                <motion.div 
                  className="relative w-full md:w-96"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="🔍 Tìm kiếm nhân viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all shadow-sm"
                  />
                </motion.div>
              </div>

              <div className="flex border-b-2 border-purple-100">
                <motion.button
                  onClick={() => setActiveTab('pending')}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-3 transition-all ${
                    activeTab === 'pending'
                      ? 'border-orange-500 text-orange-600 bg-linear-to-b from-orange-50 to-transparent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AlertCircle className="w-5 h-5" />
                  Chưa nhập <span className="bg-orange-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{pendingCount}</span>
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('completed')}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-3 transition-all ${
                    activeTab === 'completed'
                      ? 'border-green-500 text-green-600 bg-linear-to-b from-green-50 to-transparent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Đã nhập <span className="bg-green-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">{completedCount}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* MAIN CONTENT - TABLE VIEW */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-gray-700 font-medium text-lg flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                Đang tải dữ liệu...
              </p>
            </motion.div>
          ) : selectedActivityId ? (
            displayedParticipants.length > 0 ? (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-purple-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
              >
                <table className="min-w-full divide-y divide-purple-100">
                  <thead className="bg-linear-to-r from-purple-50 to-blue-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          Nhân viên
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          Trạng thái
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center justify-center gap-2">
                          <Award className="w-4 h-4 text-purple-600" />
                          Đánh giá
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-purple-50">
                    {displayedParticipants.map((participant, index) => (
                      <motion.tr 
                        key={participant.employeeId} 
                        className="hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <motion.div 
                              className="flex-shrink-0 w-12 h-12 bg-linear-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <span className="text-white font-bold text-lg">
                                {participant.employeeName.charAt(0)}
                              </span>
                            </motion.div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{participant.employeeName}</div>
                              <div className="text-xs text-gray-500 bg-purple-50 px-2 py-0.5 rounded-md inline-block font-medium">{participant.employeeCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {hasValidResult(participant.result) ? (
                            <motion.span 
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-md"
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <CheckCircle className="w-3 h-3" />
                              ✅ Đã hoàn thành
                            </motion.span>
                          ) : (
                            <motion.span 
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md animate-pulse"
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <AlertCircle className="w-3 h-3" />
                              ⏳ Chờ cập nhật
                            </motion.span>
                          )}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getPerformanceBadge(participant.performance)}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <motion.button
                            onClick={() => handleOpenModal(participant)}
                            className="text-white bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 inline-flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-all shadow-lg"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit2 className="w-4 h-4" />
                            {hasValidResult(participant.result) ? '✏️ Chỉnh sửa' : '📝 Nhập kết quả'}
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border-2 border-purple-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <XCircle className="w-20 h-20 text-purple-300 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🔍 Không tìm thấy dữ liệu</h3>
                <p className="text-gray-600 text-lg">Không có nhân viên nào trong danh sách này.</p>
              </motion.div>
            )
          ) : (
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-16 text-center border-2 border-purple-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="relative inline-block mb-6">
                <Calendar className="w-24 h-24 text-purple-300 mx-auto" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">🎯 Chưa chọn hoạt động</h3>
              <p className="text-gray-600 text-lg">Vui lòng chọn một hoạt động từ danh sách phía trên để bắt đầu.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Render Modal */}
      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        participant={editingParticipant}
        activityType={selectedActivity?.activityType || 'training'}
        activityName={selectedActivity?.name || ''}
        form={formData}
        onFormChange={handleFormChange}
        onSave={handleSaveResult}
        isSaving={isSaving}
      />
    </motion.div>
  );
}