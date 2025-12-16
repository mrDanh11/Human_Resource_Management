import { useState } from 'react';
import { Search, Filter, Calendar, Plus } from 'lucide-react';
import ActivityListCard from '../../components/activities/ActivityListCard';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';
import type { CreateActivityData } from '../../components/activities/CreateActivityModal';
import CreateActivityModal from '../../components/activities/CreateActivityModal';
import { mockActivities } from '../../data/activityData';
import type { ActivityData } from '../../data/activityData';

export default function AdminActivityListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityData['type'] | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleViewDetails = (activityId: string) => {
    const activity = mockActivities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsDetailModalOpen(true);
    }
  };

  const handleDelete = (activityId: string) => {
    const activity = mockActivities.find(a => a.id === activityId);
    if (activity) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa hoạt động "${activity.name}"?`)) {
        console.log('Delete activity:', activityId);
        alert(`Đã xóa hoạt động: ${activity.name}`);
      }
    }
  };

  const handleCreateActivity = (activityData: CreateActivityData) => {
    console.log('Create new activity:', activityData);
    alert(`Đã tạo hoạt động mới: ${activityData.name}`);
    setIsCreateModalOpen(false);
  };

  // Filter activities
  const filteredActivities = mockActivities.filter(activity => {
    // Search filter
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    
    // Status filter
    let matchesStatus = true;
    if (selectedStatus !== 'all') {
      const now = new Date();
      const regStart = new Date(activity.registrationStart);
      const regEnd = new Date(activity.registrationEnd);
      const isOpen = now >= regStart && now <= regEnd;
      
      matchesStatus = selectedStatus === 'open' ? isOpen : !isOpen;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý hoạt động
            </h1>
          </div>
          <p className="text-gray-600">
            Quản lý và tổ chức các hoạt động của công ty
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Top row: Filters + Create button */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hoạt động..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ActivityData['type'] | 'all')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="sports">Thể thao</option>
                    <option value="charity">Từ thiện</option>
                    <option value="training">Đào tạo</option>
                    <option value="team-building">Team Building</option>
                    <option value="volunteer">Tình nguyện</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'open' | 'closed')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="open">Đang mở đăng ký</option>
                    <option value="closed">Đã đóng đăng ký</option>
                  </select>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all whitespace-nowrap"
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
                <Plus className="w-5 h-5" />
                <span>Tạo hoạt động</span>
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{filteredActivities.length}</span> hoạt động
            </div>
          </div>
        </div>

        {/* Activity Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityListCard
                key={activity.id}
                activity={activity}
                onViewDetails={handleViewDetails}
                onRegister={() => {}} // Admin không cần đăng ký
                onDelete={handleDelete}
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
                Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc tạo hoạt động mới.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedStatus('all');
                  }}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all"
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(156, 163, 175, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Đặt lại bộ lọc
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
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
                  Tạo hoạt động mới
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedActivity(null);
          }}
          onRegister={() => {}} // Admin không cần đăng ký
          onDelete={handleDelete}
        />
      )}

      {/* Create Activity Modal */}
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateActivity}
      />
    </div>
  );
}
