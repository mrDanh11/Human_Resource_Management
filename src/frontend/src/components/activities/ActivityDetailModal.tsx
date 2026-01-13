import { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Users, Building2, Clock } from 'lucide-react';
import type { ActivityData } from '../../data/activityData';

interface ActivityDetailModalProps {
  activity: ActivityData;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (activityId: string) => void;
  onUnregister?: (activityId: string) => void;
  isRegistered?: boolean;
  userRole?: string;
}

const activityTypeLabels: Record<ActivityData['type'], string> = {
  sports: 'Thể thao',
  charity: 'Từ thiện',
  training: 'Đào tạo',
  'team-building': 'Team Building',
  volunteer: 'Tình nguyện'
};

const activityTypeColors: Record<ActivityData['type'], string> = {
  sports: 'bg-blue-100 text-blue-800 border-blue-200',
  charity: 'bg-pink-100 text-pink-800 border-pink-200',
  training: 'bg-purple-100 text-purple-800 border-purple-200',
  'team-building': 'bg-green-100 text-green-800 border-green-200',
  volunteer: 'bg-orange-100 text-orange-800 border-orange-200'
};

export default function ActivityDetailModal({ 
  activity, 
  isOpen, 
  onClose, 
  onRegister,
  onUnregister,
  isRegistered = false,
  userRole
}: ActivityDetailModalProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const regStart = new Date(activity.registrationStart);
    const regEnd = new Date(activity.registrationEnd);
    return now >= regStart && now <= regEnd;
  };

  const isFullyBooked = () => {
    return activity.maxParticipants !== undefined && 
           activity.currentParticipants >= activity.maxParticipants;
  };

  const canRegister = isRegistrationOpen() && !isFullyBooked();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
       <div
            className="fixed inset-0 backdrop-brightness-60 transition-all"
            onClick={onClose}
        ></div>

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-6 relative z-10">
        <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-3xl max-h-[90vh] flex flex-col">
          {/* Header Image */}
          {activity.imageUrl && (
            <div className="h-64 overflow-hidden relative shrink-0">
              <img 
                src={activity.imageUrl} 
                alt={activity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={onClose}
                  className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white px-6 pt-5 pb-4 overflow-y-auto flex-1">
            {/* Close button if no image */}
            {!activity.imageUrl && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={onClose}
                  className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}

            {/* Title and Type Badge */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-2xl font-bold text-gray-900 flex-1" id="modal-title">
                  {activity.name}
                </h3>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${activityTypeColors[activity.type]}`}>
                  {activityTypeLabels[activity.type]}
                </span>
              </div>
              
              {/* Organizer */}
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                <span>Tổ chức bởi: <span className="font-semibold">{activity.organizer}</span></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h4>
              <p className="text-gray-700 leading-relaxed">
                {activity.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 mb-6">
              <h4 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h4>
              
              {/* Activity Time */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Thời gian diễn ra</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Bắt đầu:</span> {formatDateTime(activity.startDate)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Kết thúc:</span> {formatDateTime(activity.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Time */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Thời gian đăng ký</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Từ:</span> {formatDateTime(activity.registrationStart)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Đến:</span> {formatDateTime(activity.registrationEnd)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Địa điểm</p>
                    <p className="text-sm text-gray-700">{activity.location}</p>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Số lượng tham gia</p>
                    <p className="text-sm text-gray-700">
                      Đã đăng ký: <span className="font-semibold">{activity.currentParticipants}</span>
                      {activity.maxParticipants && ` / ${activity.maxParticipants}`} người
                    </p>
                    
                    {/* Progress Bar */}
                    {activity.maxParticipants && (
                      <div className="mt-3">
                        <div className="w-full bg-purple-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              isFullyBooked() ? 'bg-red-500' : 'bg-purple-600'
                            }`}
                            style={{ 
                              width: `${Math.min((activity.currentParticipants / activity.maxParticipants) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {isFullyBooked() 
                            ? 'Đã đủ số lượng' 
                            : `Còn ${activity.maxParticipants - activity.currentParticipants} chỗ trống`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-all"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(156, 163, 175, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Đóng
              </button>              
              
              {/* Chỉ hiển thị nút đăng ký cho EMPLOYEE */}
              {!['HR', 'ADMIN'].includes(userRole?.toUpperCase() || '') && (
                isRegistered ? (
                  !isRegistrationOpen() ? (
                    <button
                      disabled
                      className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
                    >
                      Đã đăng ký
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (onUnregister) {
                          onUnregister(activity.id);
                          onClose();
                        }
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
                      style={{
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        setIsHovered(true);
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(22, 163, 74, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        setIsHovered(false);
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {!isHovered ? (
                        <span>Đã đăng ký</span>
                      ) : (
                        <span>Hủy đăng ký</span>
                      )}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => {
                      onRegister(activity.id);
                      onClose();
                    }}
                    disabled={!canRegister}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                      canRegister
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    style={{
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (canRegister) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isFullyBooked() ? 'Đã đủ số lượng' : !isRegistrationOpen() ? 'Đã đóng đăng ký' : 'Đăng ký ngay'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
