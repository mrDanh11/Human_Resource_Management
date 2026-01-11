import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Calendar, Clock, FileText, AlertCircle } from "lucide-react";
import { createRequest, type CreateRequestDto } from "../../services/requestService";

type RequestTypeParam = "attendance" | "overtime" | "wfh" | "business-trip" | "shift-change";

interface FormData {
  description: string;
  startTime: string;
  endTime: string;
  attachment?: string;
}

export default function RequestFormPage() {
  const { type } = useParams<{ type: RequestTypeParam }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: "",
    startTime: "",
    endTime: "",
    attachment: ""
  });

  const requestConfig = {
    attendance: {
      title: "Cập nhật giờ vào/ra",
      description: "Chỉnh sửa thời gian check-in/check-out",
      fields: ["description", "startTime", "endTime", "attachment"]
    },
    overtime: {
      title: "Đăng ký OT",
      description: "Đăng ký làm thêm giờ",
      fields: ["description", "startTime", "endTime"]
    },
    wfh: {
      title: "Làm việc từ xa (WFH)",
      description: "Đăng ký làm việc tại nhà",
      fields: ["description", "startTime", "endTime"]
    },
    "business-trip": {
      title: "Công tác",
      description: "Đăng ký đi công tác",
      fields: ["description", "startTime", "endTime", "attachment"]
    },
    "shift-change": {
      title: "Đổi ca làm việc",
      description: "Yêu cầu thay đổi ca",
      fields: ["description", "startTime", "endTime"]
    }
  };

  const config = type ? requestConfig[type] : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const employeeId = parseInt(localStorage.getItem("userId") || "0");
      
      // Map request type to backend format
      const typeMapping: Record<string, CreateRequestDto["type"]> = {
        "attendance": "attendance_correction",
        "overtime": "overtime",
        "wfh": "wfh",
        "business-trip": "other",
        "shift-change": "other"
      };

      const requestData: CreateRequestDto = {
        employeeId,
        type: typeMapping[type || "other"],
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attachment: formData.attachment || undefined
      };

      await createRequest(requestData);

      alert("Yêu cầu đã được gửi thành công!");
      navigate("/requests");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Loại yêu cầu không hợp lệ</h2>
          <button
            onClick={() => navigate("/requests/create")}
            className="text-indigo-600 hover:text-indigo-700 font-medium px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            Quay lại chọn loại yêu cầu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50/20 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/requests/create")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {config.title}
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              {config.description}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border-2 border-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description Field */}
            {config.fields.includes("description") && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-purple-700 mb-3">
                  <FileText size={18} className="text-purple-600" />
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về yêu cầu của bạn..."
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none bg-purple-50/30"
                />
              </div>
            )}

            {/* Start Time Field */}
            {config.fields.includes("startTime") && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-3">
                  <Calendar size={18} className="text-blue-600" />
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-blue-50/30"
                />
              </div>
            )}

            {/* End Time Field */}
            {config.fields.includes("endTime") && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-green-700 mb-3">
                  <Clock size={18} className="text-green-600" />
                  Thời gian kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-green-50/30"
                />
              </div>
            )}

            {/* Attachment Field (Optional) */}
            {config.fields.includes("attachment") && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-orange-700 mb-3">
                  <FileText size={18} className="text-orange-600" />
                  Tệp đính kèm (nếu có)
                </label>
                <input
                  type="text"
                  name="attachment"
                  value={formData.attachment}
                  onChange={handleChange}
                  placeholder="Link hoặc đường dẫn tệp đính kèm"
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-orange-50/30"
                />
                <p className="mt-2 text-xs text-orange-600 font-medium">
                  Đính kèm tài liệu liên quan nếu cần thiết (ảnh, file PDF, v.v.)
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={22} className="text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-amber-800 mb-2">
                    Lưu ý quan trọng
                  </h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Yêu cầu của bạn sẽ được gửi đến quản lý trực tiếp để xem xét và phê duyệt. 
                    Vui lòng điền đầy đủ thông tin để quá trình xử lý được nhanh chóng và hiệu quả.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/requests/create")}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 bg-white shadow-md hover:shadow-lg"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Gửi yêu cầu</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
