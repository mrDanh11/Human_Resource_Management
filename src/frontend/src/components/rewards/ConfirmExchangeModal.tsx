import { X, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface ConfirmExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  points: number;
  money: number;
  loading?: boolean;
  hasPendingRequest?: boolean;
}

export default function ConfirmExchangeModal({
  isOpen,
  onClose,
  onConfirm,
  points,
  money,
  loading = false,
  hasPendingRequest = false,
}: ConfirmExchangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 animate-fadeIn border border-blue-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all hover:rotate-90 duration-300"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* Icon with animation */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg animate-pulse">
            <AlertCircle size={40} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
          Xác nhận quy đổi điểm
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Vui lòng kiểm tra thông tin trước khi xác nhận
        </p>

        {/* Exchange Details with beautiful animation */}
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200 shadow-inner overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center justify-between">
            {/* Points */}
            <div className="text-center flex-1 transform hover:scale-105 transition-transform duration-300">
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Điểm quy đổi</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {points.toLocaleString("vi-VN")}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 size={14} className="text-blue-500" />
                điểm
              </div>
            </div>

            {/* Arrow with animation */}
            <div className="px-4">
              <div className="relative">
                <ArrowRight size={28} className="text-blue-500 animate-pulse" />
                <div className="absolute inset-0 blur-md">
                  <ArrowRight size={28} className="text-blue-300" />
                </div>
              </div>
            </div>

            {/* Money */}
            <div className="text-center flex-1 transform hover:scale-105 transition-transform duration-300">
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Số tiền nhận</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {money.toLocaleString("vi-VN")}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 size={14} className="text-green-500" />
                đồng
              </div>
            </div>
          </div>
          
          {/* Exchange rate info */}
          <div className="mt-4 pt-4 border-t border-blue-200/50">
            <p className="text-xs text-center text-gray-600">
              Tỷ lệ quy đổi: <span className="font-semibold text-blue-600">{(money / points).toFixed(0)}đ/điểm</span>
            </p>
          </div>
        </div>

        {/* Info with icon */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900 mb-1">Lưu ý quan trọng</p>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Yêu cầu của bạn sẽ được gửi đến quản trị viên để xét duyệt. 
                Bạn có thể kiểm tra trạng thái trong <span className="font-semibold">Lịch sử giao dịch</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Actions with gradient buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Xác nhận quy đổi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
