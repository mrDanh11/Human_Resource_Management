import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { RequestResponseDto } from '../services/requestForAttendanceService';
import { 
  getRequestTypeDisplay, 
  getRequestStatusDisplay,
  formatRequestDateRange 
} from '../services/requestForAttendanceService';

interface RequestDetailModalProps {
  request: RequestResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ request, isOpen, onClose }) => {
  if (!request) return null;

  const getStatusIcon = (status: RequestResponseDto['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: RequestResponseDto['status']) => {
    const styles = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'approved': 'bg-green-100 text-green-800 border-green-300',
      'rejected': 'bg-red-100 text-red-800 border-red-300',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: RequestResponseDto['type']) => {
    const styles = {
      'wfh': 'bg-blue-50 text-blue-700 border-blue-200',
      'leave': 'bg-purple-50 text-purple-700 border-purple-200',
      'overtime': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'attendance_correction': 'bg-orange-50 text-orange-700 border-orange-200',
      'equipment': 'bg-teal-50 text-teal-700 border-teal-200',
      'other': 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      {getStatusIcon(request.status)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Chi tiết yêu cầu</h2>
                      <p className="text-blue-100 text-sm">Mã yêu cầu: #{request.id}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Status and Type */}
                <div className="flex gap-3 mb-6">
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-xl border-2 ${getStatusBadge(request.status)}`}>
                    {getRequestStatusDisplay(request.status)}
                  </span>
                  <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-xl border-2 ${getTypeBadge(request.type)}`}>
                    {getRequestTypeDisplay(request.type)}
                  </span>
                </div>

                {/* Employee Information */}
                <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-xl p-5 mb-6 border-2 border-purple-100">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-800">Thông tin nhân viên</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Họ và tên</label>
                      <p className="text-gray-900 font-medium">{request.employeeName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{request.employeeEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Mã nhân viên</label>
                      <p className="text-gray-900 font-medium">{request.employeeId}</p>
                    </div>
                    {request.departmentName && (
                      <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-1">Phòng ban</label>
                        <p className="text-gray-900 font-medium">{request.departmentName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Request Details */}
                <div className="bg-linear-to-br from-orange-50 to-yellow-50 rounded-xl p-5 mb-6 border-2 border-orange-100">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-800">Chi tiết yêu cầu</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Thời gian</label>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        {formatRequestDateRange(request.startTime, request.endTime)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Mô tả</label>
                      <p className="text-gray-900 bg-white rounded-lg p-3 border border-orange-200">
                        {request.description || 'Không có mô tả'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="bg-linear-to-br from-gray-50 to-slate-50 rounded-xl p-5 border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-800">Lịch sử</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Ngày tạo</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(request.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 block mb-1">Cập nhật lần cuối</label>
                      <p className="text-gray-900 font-medium">
                        {new Date(request.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-end">
                  <motion.button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all shadow-md font-semibold"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Đóng
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestDetailModal;
