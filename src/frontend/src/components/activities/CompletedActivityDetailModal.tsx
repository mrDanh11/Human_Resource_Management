import { X, Calendar, MapPin, Users, Award, Briefcase } from 'lucide-react';
import { useEffect } from 'react';
import type { CompletedActivityData } from '../../types/activity';

interface CompletedActivityDetailModalProps {
  activity: CompletedActivityData;
  isOpen: boolean;
  onClose: () => void;
  onViewStatistics: (activityId: string) => void;
}

export default function CompletedActivityDetailModal({ 
  activity, 
  isOpen, 
  onClose,
  onViewStatistics
}: CompletedActivityDetailModalProps) {
  
  if (!isOpen) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const participationRate = ((activity.currentParticipants / activity.maxParticipants) * 100).toFixed(1);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
       <div
          className="fixed inset-0 backdrop-brightness-60 transition-all"
          onClick={onClose}
        ></div>

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Image Header */}
        <div className="relative h-64 overflow-hidden bg-linear-to-br from-blue-50 to-blue-100">
          {activity.imageUrl ? (
            <>
              <img 
                src={activity.imageUrl} 
                alt={activity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-24 h-24 text-blue-300" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                Đã hoàn thành
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">{activity.name}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Giới thiệu</h3>
            <p className="text-gray-700 leading-relaxed">{activity.description}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">{activity.currentParticipants}</p>
              <p className="text-xs text-gray-600">Người tham gia</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <div className="text-2xl">📊</div>
              </div>
              <p className="text-2xl font-bold text-green-700">{participationRate}%</p>
              <p className="text-xs text-gray-600">Tỷ lệ đăng ký</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">{activity.excellentEmployees}</p>
              <p className="text-xs text-gray-600">Xuất sắc</p>
            </div>
          </div>

          {/* Excellent Employees List */}
          {activity.excellentEmployeeList && activity.excellentEmployeeList.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Danh sách nhân viên xuất sắc
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activity.excellentEmployeeList.map((employee) => (
                  <div 
                    key={employee.id}
                    className="bg-linear-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                        {employee.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{employee.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{employee.department}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{employee.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details Grid - 2 Columns */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Chi tiết hoạt động</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Time */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Thời gian diễn ra</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(activity.startDate)}</p>
                  <p className="text-sm text-gray-600 mt-1">đến</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(activity.endDate)}</p>
                </div>
              </div>

              {/* Location */}
              {activity.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Địa điểm</p>
                    <p className="font-semibold text-gray-900">{activity.location}</p>
                  </div>
                </div>
              )}

              {/* Organizer */}
              {activity.organizer && (
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Đơn vị tổ chức</p>
                    <p className="font-semibold text-gray-900">{activity.organizer}</p>
                  </div>
                </div>
              )}

              {/* Points */}
              {activity.points !== undefined && activity.points !== null && (
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Điểm thưởng</p>
                    <p className="font-semibold text-amber-700">{activity.points} điểm</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => {
                onClose();
                onViewStatistics(activity.id.toString());
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
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
              <Award className="w-5 h-5" />
              <span className="font-medium">Xem thống kê chi tiết</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
              style={{
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(75, 85, 99, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
