import React, { useEffect } from 'react';
import { X, Calendar, LogIn, LogOut, FileText, Upload } from 'lucide-react';

interface AttendanceFormData {
  date: string;
  checkinTime: string;
  checkoutTime: string;
  reason: string;
  attachment: File | null;
}

interface AttendanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: AttendanceFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  validDates: string[];
  onValidationChange?: (hasErrors: boolean) => void;
}

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  onClose,
  formData,
  onInputChange,
  onSubmit,
  validDates,
  onValidationChange
}) => {
  // Validation states
  const [dateError, setDateError] = React.useState<string>('');
  const [timeError, setTimeError] = React.useState<string>('');
  const [reasonError, setReasonError] = React.useState<string>('');

  // Notify parent about validation state
  useEffect(() => {
    const hasErrors = !!(dateError || timeError || reasonError);
    onValidationChange?.(hasErrors);
  }, [dateError, timeError, reasonError, onValidationChange]);

  // Validate date
  useEffect(() => {
    if (formData.date) {
      const formattedDate = new Date(formData.date).toLocaleDateString('vi-VN');
      if (!validDates.includes(formattedDate)) {
        setDateError('Ngày làm việc phải nằm trong các ngày đã có trong bảng chấm công!');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [formData.date, validDates]);

  // Validate time
  useEffect(() => {
    if (formData.checkinTime && formData.checkoutTime) {
      const checkinMinutes = parseInt(formData.checkinTime.split(':')[0]) * 60 + parseInt(formData.checkinTime.split(':')[1]);
      const checkoutMinutes = parseInt(formData.checkoutTime.split(':')[0]) * 60 + parseInt(formData.checkoutTime.split(':')[1]);
      
      if (checkoutMinutes <= checkinMinutes) {
        setTimeError('Giờ ra phải lớn hơn giờ vào!');
      } else {
        setTimeError('');
      }
    } else {
      setTimeError('');
    }
  }, [formData.checkinTime, formData.checkoutTime]);

  // Validate reason
  useEffect(() => {
    const reasonLength = formData.reason.trim().length;
    if (formData.reason && reasonLength > 0 && reasonLength < 10) {
      setReasonError('Nguyên nhân phải có ít nhất 10 ký tự!');
    } else if (reasonLength > 500) {
      setReasonError('Nguyên nhân không được vượt quá 500 ký tự!');
    } else {
      setReasonError('');
    }
  }, [formData.reason]);

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
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  dateError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {dateError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {dateError}
                </p>
              )}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    timeError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
            </div>
            {timeError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> {timeError}
              </p>
            )}

            {/* Nguyên nhân */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <FileText className="w-4 h-4" />
                Nguyên nhân <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={onInputChange}
                rows={3}
                minLength={10}
                maxLength={500}
                required
                placeholder="Nhập nguyên nhân yêu cầu cập nhật (từ 10 đến 500 ký tự)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                  reasonError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {reasonError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span>⚠️</span> {reasonError}
                </p>
              )}
              <p className={`text-xs mt-1 ${formData.reason.length < 10 ? 'text-orange-500' : 'text-gray-500'}`}>
                {formData.reason.length}/500 ký tự
              </p>
            </div>

            {/* Attachment */}
            <div>
              <label className="flex items-center gap-2 text-base font-medium text-blue-700 mb-2">
                <Upload className="w-4 h-4" />
                Đính kèm file (nếu có)
              </label>
              <input
                type="file"
                name="attachment"
                onChange={onInputChange}
                accept="image/*,.pdf,.doc,.docx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Định dạng hỗ trợ: ảnh, PDF, Word (tối đa 5MB)
              </p>
              {formData.attachment && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Đã chọn: {formData.attachment.name}
                </p>
              )}
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Yêu cầu sẽ được gửi đến HR để xem xét và phê duyệt.
              </p>
              <ul className="text-sm text-blue-800 mt-2 ml-4 list-disc space-y-1">
                <li>Ngày làm việc phải nằm trong các ngày đã có trong bảng chấm công</li>
                <li>Giờ ra phải lớn hơn giờ vào</li>
                <li>Nguyên nhân phải từ 10 đến 500 ký tự</li>
                <li>Đính kèm tài liệu chứng minh (nếu có)</li>
              </ul>
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
              disabled={!!(dateError || timeError || reasonError)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!(dateError || timeError || reasonError)) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.4)';
                }
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
