import { Clock } from "lucide-react";
import type { PointToMoneyHistoryDto } from "../../services/pointService";

export default function PendingExchangeAlert({ pendingRequests }: { pendingRequests: PointToMoneyHistoryDto[] }) {
  if (!pendingRequests.length) return null;
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 text-base sm:text-lg mb-2">
            Yêu cầu đang chờ xử lý
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Bạn có {pendingRequests.length} yêu cầu quy đổi đang chờ admin duyệt. 
            Vui lòng đợi trước khi gửi yêu cầu mới.
          </p>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-yellow-100 rounded-lg px-3 py-2 text-sm">
                <span className="font-medium">{req.pointRequested} điểm</span> → {req.moneyReceived.toLocaleString('vi-VN')}đ
                <span className="text-gray-600 ml-2">
                  ({new Date(req.createdAt).toLocaleDateString('vi-VN')})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
