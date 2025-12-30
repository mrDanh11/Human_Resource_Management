import { Calendar, MapPin, Users, Eye, BarChart3 } from 'lucide-react';
import type { CompletedActivityData } from '../../data/completedActivityData';

interface CompletedActivityCardProps {
  activity: CompletedActivityData;
  onViewDetails: (activityId: string) => void;
  onViewStatistics: (activityId: string) => void;
}

const activityTypeLabels: Record<CompletedActivityData['type'], string> = {
  sports: 'Thể thao',
  charity: 'Từ thiện',
  training: 'Đào tạo',
  'team-building': 'Team Building',
  volunteer: 'Tình nguyện'
};

const activityTypeColors: Record<CompletedActivityData['type'], string> = {
  sports: 'bg-blue-100 text-blue-800',
  charity: 'bg-pink-100 text-pink-800',
  training: 'bg-purple-100 text-purple-800',
  'team-building': 'bg-green-100 text-green-800',
  volunteer: 'bg-orange-100 text-orange-800'
};

export default function CompletedActivityCard({ activity, onViewDetails, onViewStatistics }: CompletedActivityCardProps) {
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

  const participationRate = ((activity.currentParticipants / activity.maxParticipants) * 100).toFixed(0);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      {activity.imageUrl && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={activity.imageUrl} 
            alt={activity.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {/* Completed Badge */}
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Đã hoàn thành
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1">
            {activity.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activityTypeColors[activity.type]}`}>
            {activityTypeLabels[activity.type]}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
              {activity.currentParticipants}/{activity.maxParticipants} người
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Tỷ lệ tham gia</span>
            <span className="font-semibold">{participationRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ 
                width: `${participationRate}%` 
              }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-600">Xuất sắc</p>
            <p className="text-lg font-bold text-yellow-600">{activity.excellentEmployees}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Vắng mặt</p>
            <p className="text-lg font-bold text-red-600">{activity.absentees}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(activity.id)}
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
          
          <button
            onClick={() => onViewStatistics(activity.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
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
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Thống kê</span>
          </button>
        </div>

        {/* Organizer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Tổ chức bởi: <span className="font-semibold text-gray-700">{activity.organizer}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
