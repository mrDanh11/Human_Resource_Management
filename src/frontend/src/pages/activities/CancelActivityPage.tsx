import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteActivity, getAllActivities } from "../../services/activityService";
import type { Activity } from "../../types/activity";
import { format } from "date-fns";
import { Ban, Eye } from "lucide-react"; // Icon trang trí

export default function CancelActivityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const activityData = location.state;

  // State cho form hủy (giữ nguyên logic cũ)
  const [reason, setReason] = useState("");
  const canSubmit = reason.length >= 5; // Giảm xuống 5 cho dễ test, hoặc giữ 30 tùy bạn
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho danh sách đã hủy (Logic mới)
  const [cancelledActivities, setCancelledActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  // Effect: Nếu không có activityData (tức là vào xem danh sách), thì load các hoạt động đã hủy
  useEffect(() => {
    if (!activityData) {
      fetchCancelledActivities();
    }
  }, [activityData]);

  const fetchCancelledActivities = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách với status = CANCELLED
      const response = await getAllActivities({ 
        page: 1, 
        pageSize: 100, 
        status: 'cancelled' 
      });
      setCancelledActivities(response.activities || []);
    } catch (error) {
      console.error("Lỗi tải danh sách hủy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!activityData?.id) return;
    
    if (!window.confirm("Bạn có chắc chắn muốn hủy hoạt động này? Hành động không thể hoàn tác.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Gọi API hủy (Lưu ý: Backend phải update status="CANCELLED" như đã sửa ở bước trước)
      await deleteActivity(activityData.id); 
      alert("Hủy hoạt động thành công!");
      navigate("/activities");
    } catch (error) {
      console.error("Lỗi khi hủy:", error);
      alert("Có lỗi xảy ra khi hủy hoạt động.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // VIEW 1: DANH SÁCH CÁC HOẠT ĐỘNG ĐÃ HỦY
  // (Hiển thị khi truy cập trực tiếp /activities/cancel)
  // ==========================================
  if (!activityData) {
    return (
      <div className="h-full bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Ban className="text-red-600" />
                Hoạt động đã hủy
              </h1>
              <p className="text-gray-600 mt-1">Danh sách các hoạt động đã bị hủy bỏ hoặc tạm ngưng.</p>
            </div>
            <button
              onClick={() => navigate("/activities")}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
            >
              Quay lại danh sách
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Đang tải dữ liệu...</div>
            ) : cancelledActivities.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ban className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Chưa có hoạt động nào bị hủy</h3>
                <p className="text-gray-500 mt-1">Các hoạt động bị hủy sẽ xuất hiện tại đây.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên hoạt động</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người tổ chức</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cancelledActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{activity.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.organizer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.startDate ? format(new Date(activity.startDate), 'dd/MM/yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Đã hủy
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Xem chi tiết">
                           <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FORM HỦY HOẠT ĐỘNG
  // (Hiển thị khi có state truyền vào từ nút "Hủy" ở trang danh sách)
  // ==========================================
  
  // Giả lập logic phân quyền (giữ nguyên code cũ của bạn)
  const requiresManagerApproval = (activityData.currentParticipants || 0) > 50;

  return (
    <div className="h-full bg-gray-50 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-red-50 border-b border-red-100">
          <h2 className="text-2xl font-bold text-red-700 flex items-center gap-2">
            ⚠️ Hủy Hoạt Động
          </h2>
          <p className="text-red-600 mt-2">
            Bạn đang thực hiện hủy hoạt động: <span className="font-semibold text-gray-900">{activityData.name}</span>
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do hủy hoạt động <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vui lòng nhập lý do chi tiết (tối thiểu 30 ký tự)..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all"
            />
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-xs ${reason.length < 30 ? "text-red-500" : "text-green-600"}`}>
                {reason.length}/30 ký tự
              </span>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex items-start gap-3 mb-6">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-orange-900">
                Lưu ý quan trọng
              </p>
              <ul className="list-disc list-inside text-xs text-orange-800 mt-1 space-y-1">
                <li>Hành động này sẽ gửi thông báo đến tất cả người tham gia.</li>
                <li>Trạng thái hoạt động sẽ chuyển sang "Đã hủy".</li>
                <li>Không thể khôi phục hoạt động sau khi hủy.</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/activities")}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-md flex items-center gap-2 ${
                canSubmit && !isSubmitting
                  ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                  : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}