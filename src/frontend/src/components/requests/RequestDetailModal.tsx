import { useState } from "react";
import { X, FileText, Calendar, Clock, User, CheckCircle, XCircle, Download, AlertCircle } from "lucide-react";
import type { RequestResponse } from "../../services/requestService";

interface RequestDetailModalProps {
  request: RequestResponse;
  onClose: () => void;
}

export default function RequestDetailModal({ request, onClose }: RequestDetailModalProps) {
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
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

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: Clock
      },
      approved: {
        label: "Đã duyệt",
        className: "bg-green-100 text-green-700 border-green-300",
        icon: CheckCircle
      },
      rejected: {
        label: "Từ chối",
        className: "bg-red-100 text-red-700 border-red-300",
        icon: XCircle
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-gray-100 text-gray-700 border-gray-300",
        icon: AlertCircle
      }
    };

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const statusInfo = getStatusInfo(request.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <FileText size={24} />
            <h2 className="text-xl font-bold">Chi tiết yêu cầu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${statusInfo.className}`}>
              <StatusIcon size={24} />
              <span className="text-lg font-semibold">{statusInfo.label}</span>
            </div>
          </div>

          {/* Request Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Request Type */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-600">Loại yêu cầu</span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {getRequestTypeLabel(request.type)}
              </p>
            </div>

            {/* Employee ID */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-600">Mã nhân viên</span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {request.employeeId}
              </p>
            </div>

            {/* Start Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-600">Thời gian bắt đầu</span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {formatDateTime(request.startTime)}
              </p>
            </div>

            {/* End Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-600">Thời gian kết thúc</span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {formatDateTime(request.endTime)}
              </p>
            </div>

            {/* Created At */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-600">Ngày tạo</span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {formatDateTime(request.createdAt)}
              </p>
            </div>

            {/* Updated At */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-600">Cập nhật lần cuối</span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {formatDateTime(request.updatedAt)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-blue-600" size={18} />
              <span className="text-sm font-medium text-gray-700">Mô tả</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {request.description || "Không có mô tả"}
            </p>
          </div>

          {/* Attachment */}
          {request.attachment && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Download className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-700">File đính kèm</span>
              </div>
              <a
                href={request.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Tải xuống file
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Định dạng hỗ trợ: PNG, JPG, PDF
              </p>
            </div>
          )}

          {/* Reviewer Info (if approved/rejected) */}
          {(request.status === "approved" || request.status === "rejected") && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-600">
              <div className="flex items-center gap-2 mb-3">
                <User className="text-blue-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Thông tin người duyệt</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Người duyệt:</span> {request.employeeId} {/* TODO: Add reviewer name */}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Thời gian xử lý:</span> {formatDateTime(request.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
