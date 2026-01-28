import { useState } from 'react';
import { Calendar, MapPin, Users, Eye, UserPlus, UserMinus, Trash2, Pencil } from 'lucide-react';
import type { Activity } from '../../types/activity';

interface ActivityListCardProps {
  activity: Activity;
  onViewDetails: (activityId: string) => void;
  onRegister: (activityId: string) => void;
  onUnregister?: (activityId: string) => void;
  onDelete?: (activityId: string) => void;
  onEdit?: (activity: Activity) => void;
  isRegistered?: boolean;
  userRole?: string;
}

const activityTypeLabels: Record<Activity['activityType'], string> = {
  sports: 'Thể thao',
  charity: 'Từ thiện',
  training: 'Đào tạo',
  'team-building': 'Team Building',
  volunteer: 'Tình nguyện'
};

const activityTypeColors: Record<Activity['activityType'], string> = {
  sports: 'bg-blue-100 text-blue-800',
  charity: 'bg-pink-100 text-pink-800',
  training: 'bg-purple-100 text-purple-800',
  'team-building': 'bg-green-100 text-green-800',
  volunteer: 'bg-orange-100 text-orange-800'
};

export default function ActivityListCard({ 
  activity, 
  onViewDetails, 
  onRegister, 
  onUnregister,
  onDelete,
  onEdit,
  isRegistered = false,
  userRole
}: ActivityListCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const regStart = new Date(activity.registrationStartDate);
    const regEnd = new Date(activity.registrationEndDate);
    return now >= regStart && now <= regEnd;
  };

  const isFullyBooked = () => {
    return activity.maxParticipants !== undefined && 
           activity.currentParticipants >= activity.maxParticipants;
  };

  const getRegistrationStatus = () => {
    if (!isRegistrationOpen()) {
      const now = new Date();
      const regStart = new Date(activity.registrationStartDate);
      const regEnd = new Date(activity.registrationEndDate);
      
      if (now < regStart) {
        return { text: 'Chưa mở đăng ký', color: 'text-gray-500' };
      } else if (now > regEnd) {
        return { text: 'Đã đóng đăng ký', color: 'text-red-500' };
      }
    }
    
    if (isFullyBooked()) {
      return { text: 'Đã đủ số lượng', color: 'text-red-500' };
    }
    
    return { text: 'Đang mở đăng ký', color: 'text-green-600' };
  };

  const canRegister = isRegistrationOpen() && !isFullyBooked();
  const regStatus = getRegistrationStatus();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      {activity.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={activity.imageUrl} 
            alt={activity.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-1">
          <h3 className="text-xl font-bold text-gray-900 flex-1 line-clamp-2" style={{ minHeight: '3.5rem', lineHeight: '1.75rem' }}>
            {activity.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activityTypeColors[activity.activityType]}`}>
            {activityTypeLabels[activity.activityType]}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{ minHeight: '2.5rem', lineHeight: '1.25rem' }}>
          {activity.description}
        </p>

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          {/* Activity Time */}
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-medium mr-2">Diễn ra:</span>
            <span>{formatDateTime(activity.startDate)} - {formatDateTime(activity.endDate)}</span>
          </div>

          {/* Registration Time */}
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-green-600" />
            <span className="font-medium mr-2">Đăng ký:</span>
            <span>{formatDateTime(activity.registrationStartDate)} - {formatDateTime(activity.registrationEndDate)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-red-600" />
            <span className="font-medium mr-2">Địa điểm:</span>
            <span>{activity.location}</span>
          </div>

          {/* Participants */}
          <div className="flex items-center text-sm text-gray-700">
            <Users className="w-4 h-4 mr-2 text-purple-600" />
            <span className="font-medium mr-2">Người tham gia:</span>
            <span>
              {activity.currentParticipants}
              {activity.maxParticipants && `/${activity.maxParticipants}`} người
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {activity.maxParticipants && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  isFullyBooked() ? 'bg-red-500' : 'bg-blue-600'
                }`}
                style={{ 
                  width: `${Math.min((activity.currentParticipants / activity.maxParticipants) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Status */}
        <div className="mb-4">
          <span className={`text-sm font-semibold ${regStatus.color}`}>
            {regStatus.text}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(activity.id.toString())}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-200"
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
            <Eye className="w-4 h-4" />
            <span className="font-medium">Chi tiết</span>
          </button>
          
          {/* Hiển thị nút quản lý cho HR/ADMIN */}
          {['HR', 'ADMIN'].includes(userRole?.toUpperCase() || '') ? (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(activity)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200"
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
                  title="Chỉnh sửa hoạt động"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(activity.id.toString())}
                  className="flex items-center justify-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-200"
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title="Xóa hoạt động"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            /* Hiển thị nút đăng ký cho EMPLOYEE */
            <>
              {isRegistered ? (
                !isRegistrationOpen() ? (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Đã đăng ký</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onUnregister && onUnregister(activity.id.toString())}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-red-600 text-white rounded-lg transition-all duration-200"
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
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        <span className="font-medium">Đã đăng ký</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserMinus className="w-4 h-4" />
                        <span className="font-medium">Hủy đăng ký</span>
                      </span>
                    )}
                  </button>
                )
              ) : (
                <button
                  onClick={() => onRegister(activity.id.toString())}
                  disabled={!canRegister}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
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
                  <UserPlus className="w-4 h-4" />
                  <span className="font-medium">Đăng ký</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Organizer - small text below buttons */}
        {activity.organizer && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-bold">Tổ chức:</span> {activity.organizer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
