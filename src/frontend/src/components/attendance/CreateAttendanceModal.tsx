import React, { useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployees } from '../../store/employeeSlice';

interface CreateAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    employeeId: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: string;
    note: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSave: () => void;
}

const CreateAttendanceModal: React.FC<CreateAttendanceModalProps> = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSave,
}) => {
  const dispatch = useAppDispatch();
  const { employees, loading: employeesLoading } = useAppSelector((state) => state.employee);

  // Fetch employees khi component mount hoặc khi modal mở
  useEffect(() => {
    if (isOpen && employees.length === 0) {
      dispatch(fetchEmployees({ pageNumber: 1, pageSize: 100 }));
    }
  }, [isOpen, dispatch, employees.length]);

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
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Thêm bản ghi chấm công</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Tạo mới dữ liệu chấm công cho nhân viên
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
          {/* Form Fields */}
          <div className="space-y-5">
            {/* Nhân viên */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nhân viên <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => onFormChange('employeeId', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
                disabled={employeesLoading}
              >
                <option value="">
                  {employeesLoading ? 'Đang tải...' : 'Chọn nhân viên'}
                </option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullname}</option>
                ))}
              </select>
            </div>

            {/* Ngày làm việc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày làm việc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => onFormChange('date', e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all bg-white"
              />
            </div>

            {/* Giờ vào */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ vào
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
                Giờ ra
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
                <option value="">Chọn trạng thái</option>
                <option value="present">Đúng giờ</option>
                <option value="late">Đi muộn</option>
                <option value="absent">Vắng mặt</option>
                <option value="half_day">Nửa ngày</option>
                <option value="wfh">Làm từ xa (WFH)</option>
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
            Thêm bản ghi
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAttendanceModal;
