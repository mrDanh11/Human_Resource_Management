import { useEffect } from 'react';
import { Loader2, AlertCircle, X, User, FileUser, FileCheck, Paperclip } from 'lucide-react';
import { fetchRequestDetail, resetDetail } from '../../store/requestSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Modal from '../common/Modal';

interface LeaveRequestDetailProps {
  requestId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

// Component Chi tiết Yêu cầu Nghỉ phép
const LeaveRequestDetail = ({ requestId, isOpen, onClose } : LeaveRequestDetailProps) => {
  const dispatch = useAppDispatch();
  const { requestDetail, loading, error } = useAppSelector((state) => state.requests);

  useEffect(() => {
    if (isOpen && requestId) {
      dispatch(fetchRequestDetail(requestId));
    }

    return () => {
      if (!isOpen) {
        dispatch(resetDetail());
      }
    }

  }, [isOpen, requestId, dispatch]);
  
  if (!isOpen) return null;

  console.log('Request Detail:', requestDetail);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      leave: 'Nghỉ phép',
      wfh: 'Làm từ xa',
      checkin: 'Check-in',
      checkout: 'Check-out'
    };
    return typeMap[type] || type;
  };

  const getLeaveModeDisplay = (leaveMode: string) => {
    const leaveModeMap: Record<string, string> = {
      annual: 'Nghỉ phép năm',
      sick: 'Nghỉ ốm',
      personal: 'Nghỉ cá nhân',
      maternity: 'Nghỉ thai sản',
      emergency: 'Nghỉ khẩn cấp'
    };
    return leaveModeMap[leaveMode] || leaveMode;
  }

  const getSessionDisplay = (session: string) => {
    const sessionMap: Record<string, string> = {
      morning: 'Buổi sáng',
      afternoon: 'Buổi chiều',
      full_day: 'Cả ngày'
    };
    return sessionMap[session] || session;
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' },
      approved: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-700' },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Yêu cầu">
          {loading ? (
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
      ) : error ? (
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
              <AlertCircle className="h-16 w-16 text-red-600 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                      Đóng
                  </button>
            </div>
    ) : !requestDetail ? (
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">      
          <p className="text-gray-600 text-center">Không tìm thấy thông tin yêu cầu</p>
          <AlertCircle className="h-16 w-16 text-red-600 mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                  Đóng
              </button>
        </div>
    ) : (
        <div className="p-6 space-y-6">
          {/* Thông tin nhân viên */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" /> Thông tin nhân viên
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-base text-blue-400">Tên nhân viên</p>
                <p className="text-sm text-gray-600">{requestDetail.employeeName}</p>
              </div>
              <div>
                <p className="text-base text-blue-400">Mã nhân viên</p>
                <p className="text-sm text-gray-600">{requestDetail.employeeId}</p>
              </div>
            </div>
          </div>

          {/* Thông tin yêu cầu */}
          <div>
            <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
              <FileUser className="w-4 h-4 mr-2" /> Thông tin yêu cầu
            </h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-base text-blue-400">Loại yêu cầu</p>
                  <p className="text-sm text-gray-600">{getTypeDisplay(requestDetail.type)}</p>
                </div>
                <div>
                  <p className="text-base text-blue-400">Trạng thái</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm ${getStatusDisplay(requestDetail.status).color}`}>
                    {getStatusDisplay(requestDetail.status).label}
                  </span>
                </div>
              </div>
              
              {requestDetail.startTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base text-blue-400">Thời gian bắt đầu</p>
                    <p className="text-sm text-gray-600">{formatDate(requestDetail.startTime)}</p>
                  </div>
                  {requestDetail.endTime && (
                    <div>
                      <p className="text-base text-blue-400">Thời gian kết thúc</p>
                      <p className="text-sm text-gray-600">{formatDate(requestDetail.endTime)}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {requestDetail.leaveMode && (
                  <div>
                    <p className="text-base text-blue-400">Loại nghỉ phép</p>
                    <p className="text-sm text-gray-600">{getLeaveModeDisplay(requestDetail.leaveMode)}</p>
                  </div>
                )}

                {requestDetail.session && (
                  <div>
                    <p className="text-base text-blue-400">Buổi nghỉ</p>
                    <p className="text-sm text-gray-600">{getSessionDisplay(requestDetail.session)}</p>
                  </div>
                )}
              </div>

              {requestDetail.description && (
                <div>
                  <p className="text-base text-blue-400">Mô tả / Lý do</p>
                  <p className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    {requestDetail.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin phê duyệt */}
          {requestDetail.managerActionStatus && (
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
                <FileCheck className="w-4 h-4 mr-2" /> Thông tin phê duyệt
              </h3>
              <div className="space-y-3 bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base text-blue-400">Kết quả phê duyệt</p>
                    <span className={`inline-block px-3 py-1 rounded text-sm ${
                      requestDetail.managerActionStatus === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {requestDetail.managerActionStatus === 'approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                    </span>
                  </div>
                  {requestDetail.actionDate && (
                    <div>
                      <p className="text-base text-blue-400">Thời gian phê duyệt</p>
                      <p className="text-sm text-gray-600">{formatDate(requestDetail.actionDate)}</p>
                    </div>
                  )}
                </div>

                {requestDetail.managerNote && (
                  <div>
                    <p className="text-base text-blue-400">Ghi chú của quản lý</p>
                    <p className="text-sm bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                      {requestDetail.managerNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File đính kèm */}
          <div>
            <h3 className="text-sm text-gray-600 mb-3 flex items-center">
              <Paperclip className="w-4 h-4 mr-2" /> File chứng từ đính kèm
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              {requestDetail.attachment ? (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <a 
                      href={requestDetail.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Xem file đính kèm
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600">Không có file đính kèm</p>
              )}
            </div>
          </div>
        </div>
     )}
    </Modal>
  );
};

export default LeaveRequestDetail;