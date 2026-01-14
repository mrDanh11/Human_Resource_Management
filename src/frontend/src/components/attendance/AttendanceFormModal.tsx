import React, { useEffect } from 'react';
import { X, User, Calendar, LogIn, LogOut, CheckCircle, Timer, FileText } from 'lucide-react';

interface AttendanceFormData {
  employeeId: number;
  date: string;
  checkinTime: string;
  checkoutTime: string;
  status: string;
  overtimeHours: number;
  note: string;
}

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: AttendanceFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSubmit
}) => {

  useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
              onClose();
          }
      };

      if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      }

      return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-brightness-50 transition-all"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative z-10 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">
            Gửi yêu cầu cập nhật chấm công
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Employee ID */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <User className="w-4 h-4" />
                ID Nhân viên <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="employeeId"
                value={formData.employeeId}
                onChange={onInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <Calendar className="w-4 h-4" />
                Ngày làm việc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Check-in & Check-out */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                  <LogIn className="w-4 h-4" />
                  Giờ vào
                </label>
                <input
                  type="time"
                  name="checkinTime"
                  value={formData.checkinTime}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                  <LogOut className="w-4 h-4" />
                  Giờ ra
                </label>
                <input
                  type="time"
                  name="checkoutTime"
                  value={formData.checkoutTime}
                  onChange={onInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <CheckCircle className="w-4 h-4" />
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={onInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="present">Present (Có mặt)</option>
                <option value="absent">Absent (Vắng mặt)</option>
                <option value="late">Late (Đi trễ)</option>
                <option value="half_day">Half Day (Nửa ngày)</option>
                <option value="wfh">WFH (Làm từ xa)</option>
              </select>
            </div>

            {/* Overtime Hours */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <Timer className="w-4 h-4" />
                Giờ làm thêm (giờ)
              </label>
              <input
                type="number"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={onInputChange}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Note */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <FileText className="w-4 h-4" />
                Ghi chú
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={onInputChange}
                rows={3}
                maxLength={500}
                placeholder="Nhập ghi chú (tối đa 500 ký tự)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.note.length}/500 ký tự
              </p>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Số giờ làm việc sẽ được tự động tính từ giờ vào và giờ ra. 
                Thời gian tạo và cập nhật sẽ được hệ thống tự động xử lý.
              </p>
            </div>
          </div>

          {/* Modal Footer - Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
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
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceFormModal;
