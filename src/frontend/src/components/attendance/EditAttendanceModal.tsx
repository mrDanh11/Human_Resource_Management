import React from 'react';
import { X, Save, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecord: any;
  formData: {
    checkIn: string;
    checkOut: string;
    status: string;
    note: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
}

const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  isOpen,
  onClose,
  editingRecord,
  formData,
  onFormChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Edit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Điều chỉnh thông tin chấm công</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {editingRecord?.employeeName} - {editingRecord?.employeeId}
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Thông tin nhân viên */}
          <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6 border-2 border-purple-100">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Ngày làm việc:</span>
                <span className="ml-2 font-semibold text-gray-900">{editingRecord?.date}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Giờ vào */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ vào <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={(e) => onFormChange('checkIn', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
              />
            </div>

            {/* Giờ ra */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ ra <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={(e) => onFormChange('checkOut', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
              >
                <option value="normal">Đúng giờ</option>
                <option value="late">Đi muộn</option>
                <option value="missing">Vắng mặt</option>
                <option value="on-leave">Nghỉ phép</option>
              </select>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => onFormChange('note', e.target.value)}
                rows={4}
                placeholder="Nhập ghi chú (nếu có)..."
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex items-center justify-end gap-3 border-t-2 border-purple-100 shrink-0">
          <motion.button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hủy
          </motion.button>
          <motion.button
            onClick={onSave}
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditAttendanceModal;
