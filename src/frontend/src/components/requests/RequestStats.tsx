import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import type { RequestResponse } from "../../services/requestService";

interface RequestStatsProps {
  totalCount: number;
  requests: RequestResponse[];
}

export default function RequestStats({ totalCount, requests }: RequestStatsProps) {
  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng số</p>
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
          </div>
          <FileText className="text-blue-500" size={32} />
        </div>
      </div>
      <div className="bg-yellow-50 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-700">Chờ duyệt</p>
            <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
          </div>
          <Clock className="text-yellow-500" size={32} />
        </div>
      </div>
      <div className="bg-green-50 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-700">Đã duyệt</p>
            <p className="text-2xl font-bold text-green-900">{approvedCount}</p>
          </div>
          <CheckCircle className="text-green-500" size={32} />
        </div>
      </div>
      <div className="bg-red-50 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-red-700">Từ chối</p>
            <p className="text-2xl font-bold text-red-900">{rejectedCount}</p>
          </div>
          <XCircle className="text-red-500" size={32} />
        </div>
      </div>
    </div>
  );
}
