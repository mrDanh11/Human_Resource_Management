import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, AlertTriangle, X } from "lucide-react";
import { createWfhRequest, validateWfhDates } from "../../../services/wfhService";
import type { CreateWfhRequestDto, WfhValidation } from "../../../types/wfh";

interface WfhFormProps {
  onSuccess?: () => void;
  onPreviewUpdate?: (dates: string[]) => void;
}

export default function WfhForm({ onSuccess, onPreviewUpdate }: WfhFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [validation, setValidation] = useState<WfhValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const employeeId = parseInt(localStorage.getItem("userId") || "0");

  useEffect(() => {
    if (startDate && endDate) {
      handleValidateDates();
    } else {
      setValidation(null);
      onPreviewUpdate?.([]);
    }
  }, [startDate, endDate]);

  const handleValidateDates = async () => {
    if (!startDate || !endDate) return;

    setIsValidating(true);
    try {
      const result = await validateWfhDates(employeeId, startDate, endDate);
      setValidation(result);

      if (result.isValid && result.affectedDates) {
        onPreviewUpdate?.(result.affectedDates);
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file PNG, JPG, PDF, DOC, DOCX");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }

      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation?.isValid) {
      alert("Vui lòng kiểm tra lại thông tin ngày WFH");
      return;
    }

    if (!reason.trim()) {
      alert("Vui lòng nhập lý do WFH");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData: CreateWfhRequestDto = {
        employeeId,
        startDate,
        endDate,
        reason: reason.trim(),
        attachment,
      };

      await createWfhRequest(requestData);

      alert("Yêu cầu WFH đã được gửi thành công!");

      setStartDate("");
      setEndDate("");
      setReason("");
      setNote("");
      setAttachment(null);
      setValidation(null);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/requests/my-requests");
      }
    } catch (error: any) {
      console.error("Error submitting WFH request:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (startDate || endDate || reason || attachment || note) {
      if (window.confirm("Bạn có chắc muốn hủy? Dữ liệu đã nhập sẽ bị mất.")) {
        navigate("/requests/my-requests");
      }
    } else {
      navigate("/requests/my-requests");
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const wfhDays = calculateDays();
  const showLongTermWarning = wfhDays > 5;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">
        Thông tin yêu cầu WFH
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ngày kết thúc
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>

        {/* WFH Days Display */}
        {wfhDays > 0 && (
          <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
            <span className="font-medium">Số ngày WFH:</span>{" "}
            <span className="font-semibold text-gray-900">{wfhDays} ngày</span>
            <span className="text-xs text-gray-500 ml-2">(Giới hạn: 10 ngày/tháng)</span>
          </div>
        )}

        {/* Validation Loading */}
        {isValidating && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            Đang kiểm tra tính hợp lệ...
          </div>
        )}

        {/* Validation Errors */}
        {validation && !validation.isValid && validation.errors.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-blue-700 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-blue-900 font-medium">
                Không được gửi yêu cầu trùng với nghỉ phép hoặc công tác.
              </p>
            </div>
          </div>
        )}

        {/* Long-term WFH Warning */}
        {showLongTermWarning && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-yellow-700 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-yellow-900 font-medium">
                WFH hơn 5 ngày liên tiếp yêu cầu phải được phê duyệt bổ sung từ cấp cao hơn.
              </p>
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Lý do <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={3}
            maxLength={200}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do..."
            required
          />
          <div className="text-right text-xs text-gray-400 mt-1">
            {reason.length}/200 ký tự
          </div>
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            File đính kèm (Không bắt buộc)
          </label>

          {!attachment ? (
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-md px-4 py-6 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-600 mb-1">
                Kéo thả file hoặc chọn file
              </span>
              <span className="text-xs text-gray-400">
                Chỉ chấp nhận: PNG, JPG, DOC, DOCX
              </span>
              <input
                type="file"
                className="hidden"
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50">
              <span className="text-sm text-gray-700">{attachment.name}</span>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ghi chú thêm
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={2}
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thông tin bổ sung..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !validation?.isValid || isValidating || !reason.trim()}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </form>
    </div>
  );
}
