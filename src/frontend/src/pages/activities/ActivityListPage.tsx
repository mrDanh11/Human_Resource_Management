import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import FilterChips from './components/FilterChips';
import ActivityCard from './components/ActivityCard';
import LoadMore from './components/LoadMore';
import ActivityListCard from '../../components/activities/ActivityListCard';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';
import ConfirmRegistrationModal from '../../components/activities/ConfirmRegistrationModal';
import { mockActivities } from '../../data/activityData';
import { isActivityRegistered } from '../../data/registeredActivityData';
import type { ActivityData } from '../../data/activityData';

export default function ActivityListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ActivityData['type'] | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activityToRegister, setActivityToRegister] = useState<ActivityData | null>(null);
  const [visible, setVisible] = useState(3);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const currentEmployeeId = localStorage.getItem('userId') || '';

  const handleViewDetails = (activityId: string) => {
    const activity = mockActivities.find(a => a.id === activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsModalOpen(true);
    }
  };

  const handleRegister = (activityId: string) => {
    const activity = mockActivities.find(a => a.id === activityId);
    if (activity) {
      setActivityToRegister(activity);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmRegister = () => {
    if (activityToRegister) {
      console.log('Confirmed registration for activity:', activityToRegister.id);
      alert(`Đăng ký thành công: ${activityToRegister.name}`);
      setIsConfirmModalOpen(false);
      setActivityToRegister(null);
    }
  };

  // Mock data cho hoạt động có thể hủy
  const cancelableActivities = [
    {
      id: "1",
      title: "Thi đua sáng kiến cải tiến",
      status: "Đang diễn ra",
      people: 85,
      date: "15/09/2025 → 30/11/2025",
    },
    {
      id: "2",
      title: "Hoạt động teambuilding",
      status: "Sắp diễn ra",
      people: 120,
      date: "20/11/2025 → 22/11/2025",
    },
    {
      id: "3",
      title: "Chương trình đào tạo Q4",
      status: "Đang diễn ra",
      people: 45,
      date: "01/10/2025 → 31/12/2025",
    },
  ];

  // Filter hoạt động có thể hủy
  const filteredCancelableActivities = cancelableActivities.filter(activity => {
    if (activeFilter === "Tất cả") return true;
    return activity.status === activeFilter;
  });

  // Filter activities - only show unregistered activities
  const filteredActivities = mockActivities.filter(activity => {
    // Exclude registered activities
    const isRegistered = isActivityRegistered(currentEmployeeId, activity.id);
    if (isRegistered) return false;

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
      {/* Header and Filters Combined */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8" />
              <h1 className="text-3xl font-bold">
                Danh sách hoạt động
              </h1>
            </div>
            <p className="text-blue-100">
              Khám phá và đăng ký tham gia các hoạt động của công ty
            </p>
          </div>

          {/* Filters Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Hiển thị <span className="font-semibold">{filteredActivities.length}</span> hoạt động
            </div>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="mt-6 space-y-8">
          {/* Cancelable Activities Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hoạt động có thể hủy
            </h2>
            
            <FilterChips 
              selected={activeFilter}
              onFilterChange={setActiveFilter}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredCancelableActivities.slice(0, visible).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  id={activity.id}
                  title={activity.title}
                  status={activity.status}
                  people={activity.people}
                  date={activity.date}
                />
              ))}
            </div>
            <LoadMore 
              shown={visible} 
              total={filteredCancelableActivities.length}
              onLoadMore={() => setVisible(prev => prev + 3)}
            />
          </div>

          {/* Available Activities Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hoạt động có thể đăng ký
            </h2>
            
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity) => (
                  <ActivityListCard
                    key={activity.id}
                    activity={activity}
                    onViewDetails={handleViewDetails}
                    onRegister={handleRegister}
                    isRegistered={false}
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
                      setSelectedStatus('all');
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
          onRegister={handleRegister}
        />
      )}

      {/* Confirm Registration Modal */}
      {activityToRegister && (
        <ConfirmRegistrationModal
          isOpen={isConfirmModalOpen}
          activityName={activityToRegister.name}
          onConfirm={handleConfirmRegister}
          onCancel={() => {
            setIsConfirmModalOpen(false);
            setActivityToRegister(null);
          }}
        />
      )}
    </div>
  );
}
