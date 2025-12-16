import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmRegistrationModalProps {
  isOpen: boolean;
  activityName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmRegistrationModal({ isOpen, activityName, onConfirm, onCancel }: ConfirmRegistrationModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-brightness-60 transition-all"
        onClick={onCancel}
      ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6 relative z-10">
        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg">
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white" id="modal-title">
                Xác nhận đăng ký
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-900 mb-3">
                Bạn có chắc chắn muốn đăng ký tham gia hoạt động "{activityName}"?
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Lưu ý quan trọng:</h4>
                  <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside">
                    <li>Sau khi đăng ký, bạn <strong>đảm bảo có mặt tham gia</strong> hoạt động.</li>
                    <li>Thời gian muộn nhất: <strong>1 ngày sau khi hoạt động bắt đầu</strong>.</li>
                    <li>Nếu trễ hơn, bạn sẽ bị <strong>đánh vắng</strong> và <strong>khiển trách</strong> tùy mức độ.</li>
                    <li>Bằng cách nhấn "Tham gia", bạn <strong>đồng ý</strong> và sẽ <strong>chịu trách nhiệm hoàn toàn</strong> với hành động của mình.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirmation Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Lưu ý:</strong> Sau khi đăng ký thành công, bạn sẽ nhận được thông báo xác nhận qua email và có thể xem chi tiết trong phần "Hoạt động của tôi".
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(156, 163, 175, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Tôi đồng ý và Tham gia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
