import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Plus } from 'lucide-react';
import CompletedActivityCard from '../../components/activities/CompletedActivityCard';
import CompletedActivityDetailModal from '../../components/activities/CompletedActivityDetailModal';
import ActivityStatisticsModal from '../../components/activities/ActivityStatisticsModal';
import { mockCompletedActivities } from '../../data/completedActivityData';
import type { CompletedActivityData } from '../../data/completedActivityData';

export default function AdminActivityListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CompletedActivityData['type'] | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<CompletedActivityData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

  const handleViewDetails = (activityId: string) => {
    const activity = mockCompletedActivities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsDetailModalOpen(true);
    }
  };

  const handleViewStatistics = (activityId: string) => {
    const activity = mockCompletedActivities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsStatisticsModalOpen(true);
    }
  };

  // Filter activities
  const filteredActivities = mockCompletedActivities.filter(activity => {
    // Search filter
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-white" />
              <div className="text-2xl font-bold text-white">Quản lý hoạt động</div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {/* Top row: Search + Create button */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hoạt động..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => navigate('/admin/activities/create')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tạo hoạt động
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* Completed Activities */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hoạt động đã hoàn thành
          </h2>
          
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <CompletedActivityCard
                  key={activity.id}
                  activity={activity}
                  onViewDetails={handleViewDetails}
                  onViewStatistics={handleViewStatistics}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Calendar className="w-16 h-16 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Không tìm thấy hoạt động
                </h3>
                <p className="text-gray-600 max-w-md">
                  Không có hoạt động nào phù hợp với bộ lọc của bạn. 
                  Hãy thử điều chỉnh tiêu chí tìm kiếm.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <CompletedActivityDetailModal
          activity={selectedActivity}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedActivity(null);
          }}
          onViewStatistics={handleViewStatistics}
        />
      )}

      {/* Activity Statistics Modal */}
      {selectedActivity && (
        <ActivityStatisticsModal
          activity={selectedActivity}
          isOpen={isStatisticsModalOpen}
          onClose={() => {
            setIsStatisticsModalOpen(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
}
