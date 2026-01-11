import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { RequestResponse } from "../../services/requestService";

interface CancelRequestModalProps {
  request: RequestResponse;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelRequestModal({ request, onCancel, onConfirm }: CancelRequestModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do hủy yêu cầu");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Lý do hủy phải có ít nhất 10 ký tự");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onConfirm(reason.trim());
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getRequestTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      wfh: "Làm việc từ xa",
      leave: "Nghỉ phép",
      overtime: "Tăng ca",
      attendance_correction: "Cập nhật chấm công",
      equipment: "Thiết bị",
      other: "Khác"
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">Hủy yêu cầu</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Lưu ý:</strong> Bạn đang hủy yêu cầu{" "}
              <strong>{getRequestTypeLabel(request.type)}</strong>. Hành động này không thể hoàn tác.
            </p>
          </div>

          {/* Request Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Loại yêu cầu:</span> {getRequestTypeLabel(request.type)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Thời gian:</span>{" "}
              {new Date(request.startTime).toLocaleDateString("vi-VN")} -{" "}
              {new Date(request.endTime).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Trạng thái:</span>{" "}
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                Chờ duyệt
              </span>
            </p>
          </div>

          {/* Reason Input */}
          <div>
            <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
              Lý do hủy <span className="text-red-600">*</span>
            </label>
            <textarea
              id="cancelReason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              placeholder="Nhập lý do hủy yêu cầu (tối thiểu 10 ký tự)..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle size={14} />
                {error}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              {reason.length} / 500 ký tự
            </p>
          </div>

          {/* Business Rules Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              <strong>Quy định:</strong>
            </p>
            <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li>Chỉ có thể hủy yêu cầu ở trạng thái "Chờ duyệt"</li>
              <li>Lý do hủy là bắt buộc và tối thiểu 10 ký tự</li>
              <li>Hành động hủy sẽ được ghi log hệ thống</li>
              <li>Không thể hoàn tác sau khi hủy</li>
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
            disabled={loading}
          >
            Quay lại
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
            disabled={loading || !reason.trim()}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <AlertTriangle size={18} />
                Xác nhận hủy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
