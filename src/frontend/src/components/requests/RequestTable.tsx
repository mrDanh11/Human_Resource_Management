import { FileText, Eye, X as XIcon, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { RequestResponse } from "../../services/requestService";

interface RequestTableProps {
  requests: RequestResponse[];
  loading: boolean;
  onViewDetail: (request: RequestResponse) => void;
  onCancel: (request: RequestResponse) => void;
}

export default function RequestTable({ requests, loading, onViewDetail, onCancel }: RequestTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-700",
        icon: Clock
      },
      approved: {
        label: "Đã duyệt",
        className: "bg-green-100 text-green-700",
        icon: CheckCircle
      },
      rejected: {
        label: "Từ chối",
        className: "bg-red-100 text-red-700",
        icon: XCircle
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-gray-100 text-gray-700",
        icon: AlertCircle
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Không có yêu cầu nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại yêu cầu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="text-blue-500 mr-2" size={18} />
                    <span className="text-sm font-medium text-gray-900">
                      {getRequestTypeLabel(request.type)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(request.startTime).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="text-xs text-gray-500">
                    đến {new Date(request.endTime).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(request.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetail(request)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                    {request.status === "pending" && (
                      <button
                        onClick={() => onCancel(request)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Hủy yêu cầu"
                      >
                        <XIcon size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
