import { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Calendar, 
  ClipboardList, 
  XCircle, 
  Edit2 
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
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Ghi nhận thành tích</h1>
            </div>
            <p className="text-blue-100">Ghi nhận kết quả và đánh giá hiệu suất tham gia hoạt động</p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn hoạt động <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedActivityId || ''}
              onChange={(e) => setSelectedActivityId(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Chọn hoạt động --</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} - {activity.status === 'completed' ? 'Đã hoàn thành' : 'Đang diễn ra'}
                </option>
              ))}
            </select>
          </div>

          {selectedActivityId && (
            <div className="px-6 pt-6 pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Tổng số: <span className="text-blue-600 font-bold">{participants.length}</span></span>
                </div>

                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'pending'
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Chưa nhập <span className="bg-orange-100 text-orange-800 px-2 rounded-full text-xs">{pendingCount}</span>
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'completed'
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Đã nhập <span className="bg-green-100 text-green-800 px-2 rounded-full text-xs">{completedCount}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT - TABLE VIEW */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : selectedActivityId ? (
          displayedParticipants.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đánh giá
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedParticipants.map((participant) => (
                    <tr key={participant.employeeId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                              {participant.employeeName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{participant.employeeName}</div>
                            <div className="text-sm text-gray-500">{participant.employeeCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {hasValidResult(participant.result) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đã hoàn thành
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Chờ cập nhật
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getPerformanceBadge(participant.performance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(participant)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          {hasValidResult(participant.result) ? 'Chỉnh sửa' : 'Nhập kết quả'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Không tìm thấy dữ liệu</h3>
              <p className="text-gray-500 mt-1">Không có nhân viên nào trong danh sách này.</p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa chọn hoạt động</h3>
            <p className="text-gray-600">Vui lòng chọn một hoạt động từ danh sách phía trên để bắt đầu.</p>
          </div>
        )}
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
    </div>
  );
}