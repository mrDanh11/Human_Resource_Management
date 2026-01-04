import React, { useState } from 'react';
import { Search, ChevronDown, Eye } from 'lucide-react';

// Component Chi tiết Yêu cầu Nghỉ phép
const LeaveRequestDetail = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">Chi tiết Yêu cầu Nghỉ phép</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin nhân viên */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">👤</span> Thông tin nhân viên
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-sm text-gray-600">Tên nhân viên</p>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mã nhân viên</p>
                <p className="font-medium">{request.code}</p>
              </div>
            </div>
          </div>

          {/* Thông tin nghỉ phép */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📋</span> Thông tin nghỉ phép
            </h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Loại nghỉ phép</p>
                  <p className="font-medium">{request.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hình thức nghỉ</p>
                  <p className="font-medium">{request.method}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Từ ngày</p>
                  <p className="font-medium">{request.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Đến ngày</p>
                  <p className="font-medium">{request.endDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Thời gian bắt đầu</p>
                  <p className="font-medium">{request.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${request.statusColor}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Người phê duyệt</p>
                <p className="font-medium">{request.approver || 'Trần Thị B'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Thời gian phê duyệt</p>
                <p className="font-medium">{request.approvalTime || '2025-10-18 14:30'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Lý do nghỉ</p>
                <p className="font-medium bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  {request.reason || 'Về quê xử lý công việc cá nhân và nghỉ ngơi. Mong được sự chấp thuận.'}
                </p>
              </div>
            </div>
          </div>

          {/* File đính kèm */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📎</span> File chứng từ đính kèm
            </h3>
            <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
              Không có file đính kèm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestDetail;