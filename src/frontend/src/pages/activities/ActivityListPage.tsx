import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityListCard from '../../components/activities/ActivityListCard';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';
import ConfirmRegistrationModal from '../../components/activities/ConfirmRegistrationModal';
import { getAllActivities, registerActivity, unregisterActivity, getMyParticipations } from '../../services/activityService';
import type { Activity } from '../../types/activity';

export default function ActivityListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedType, setSelectedType] = useState<Activity['activityType'] | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [activityToRegister, setActivityToRegister] = useState<Activity | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [myParticipations, setMyParticipations] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
      if (isModalOpen || isConfirmModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
  
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isModalOpen, isConfirmModalOpen]);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchActivities();
    fetchMyParticipations();
  }, []);

  const fetchMyParticipations = async () => {
    try {
      const data = await getMyParticipations();
      setMyParticipations(data.map((p: any) => p.activityId));
    } catch (error) {
      console.error("Failed to fetch participations", error);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getAllActivities({ page: 1, pageSize: 100 }); // Fetch all for now
      const mappedActivities: Activity[] = response.activities.map((a: Activity) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        startDate: a.startDate,
        endDate: a.endDate,
        registrationStartDate: a.registrationStartDate,
        registrationEndDate: a.registrationEndDate,
        maxParticipants: a.maxParticipants,
        currentParticipants: a.currentParticipants || 0,
        location: a.location,
        activityType: a.activityType as any,
        status: a.status as any,
        imageUrl: a.imageUrl,
        organizer: a.organizer,
        points: a.points,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
      setActivities(mappedActivities);
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (activityId: string) => {
    const activity = activities.find(a => a.id === +activityId);
    if (activity) {
      setSelectedActivity(activity);
      setIsModalOpen(true);
    }
  };

  const handleRegister = (activityId: string) => {
    const activity = activities.find(a => a.id === +activityId);
    if (activity) {
      setActivityToRegister(activity);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmRegister = async () => {
    if (activityToRegister) {
      try {
        await registerActivity(Number(activityToRegister.id));
        alert(`Đăng ký thành công: ${activityToRegister.name}`);
        setIsConfirmModalOpen(false);
        setActivityToRegister(null);
        // Refresh data
        fetchActivities();
        fetchMyParticipations();
      } catch (error) {
        console.error("Registration failed", error);
        alert("Đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleUnregister = async (activityId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký hoạt động này không?")) {
      try {
        await unregisterActivity(Number(activityId));
        alert("Hủy đăng ký thành công");
        fetchActivities();
        fetchMyParticipations();
      } catch (error) {
        console.error("Unregistration failed", error);
        alert("Hủy đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };



  // Memoize filtered activities để tránh tính toán lại không cần thiết
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Filter out deleted activities
      if (activity.isDeleted === true) {
        return false;
      }

      // Search filter - sử dụng debounced search
      const matchesSearch = activity.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        activity.description.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Type filter
      const matchesType = selectedType === 'all' || activity.activityType === selectedType;

      // Status filter
      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        const now = new Date();
        const regStart = new Date(activity.registrationStartDate);
        const regEnd = new Date(activity.registrationEndDate);
        const isOpen = now >= regStart && now <= regEnd;

        matchesStatus = selectedStatus === 'open' ? isOpen : !isOpen;
      }

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [activities, debouncedSearch, selectedType, selectedStatus]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedType, selectedStatus]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentActivities = filteredActivities.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentActivities };
  }, [filteredActivities, currentPage, itemsPerPage]);

  const { totalPages, startIndex, endIndex, currentActivities } = paginationData;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    // Also try scrolling the document element
    document.documentElement.scrollTop = 0;
  };

  return (
    <div className="h-full bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-5 pointer-events-none" />
      
      {/* Header and Filters Combined */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Calendar className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Danh sách hoạt động
                </h1>
              </div>
              <p className="text-white/90 text-lg font-light ml-16">Khám phá và tham gia các hoạt động thú vị</p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hoạt động..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              {/* Type Filter */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as Activity['activityType'] | 'all')}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-300"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="sports">Thể thao</option>
                  <option value="charity">Từ thiện</option>
                  <option value="training">Đào tạo</option>
                  <option value="team-building">Team Building</option>
                  <option value="volunteer">Tình nguyện</option>
                </select>
              </motion.div>

              {/* Status Filter */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'open' | 'closed')}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-300"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="open">Đang mở đăng ký</option>
                  <option value="closed">Đã đóng đăng ký</option>
                </select>
              </motion.div>
            </div>

            {/* Results Count */}
            <motion.div 
              className="mt-4 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Hiển thị <span className="font-semibold text-blue-600">{startIndex + 1}-{Math.min(endIndex, filteredActivities.length)}</span> trong tổng số <span className="font-semibold text-blue-600">{filteredActivities.length}</span> hoạt động
            </motion.div>
          </div>
        </motion.div>

        {/* Activity Grid */}
        <div className="mt-6 space-y-8">
          {/* Available Activities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-linear-to-b from-blue-600 to-purple-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">
                Danh sách hoạt động
              </h2>
            </div>
            
            {filteredActivities.length > 0 ? (
              <>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${currentPage}-${debouncedSearch}-${selectedType}-${selectedStatus}`}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.05
                      }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <ActivityListCard
                        activity={activity}
                        onViewDetails={handleViewDetails}
                        onRegister={handleRegister}
                        onUnregister={handleUnregister}
                        isRegistered={myParticipations.includes(Number(activity.id))}
                        userRole="EMPLOYEE"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex justify-center items-center gap-2 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    whileHover={{ scale: currentPage !== 1 ? 1.05 : 1 }}
                    whileTap={{ scale: currentPage !== 1 ? 0.95 : 1 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                    }`}
                  >
                    Trước
                  </motion.button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 || 
                                   page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage && page === currentPage - 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    if (!showPage && page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    if (!showPage) return null;
                    
                    return (
                      <motion.button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                        }`}
                      >
                        {page}
                      </motion.button>
                    );
                  })}
                  
                  <motion.button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    whileHover={{ scale: currentPage !== totalPages ? 1.05 : 1 }}
                    whileTap={{ scale: currentPage !== totalPages ? 0.95 : 1 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300'
                    }`}
                  >
                    Sau
                  </motion.button>
                </motion.div>
              )}
              </>
            ) : (
              <motion.div 
                className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Calendar className="w-16 h-16 text-gray-300" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Không tìm thấy hoạt động
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Không có hoạt động nào phù hợp với bộ lọc của bạn. 
                    Hãy thử điều chỉnh tiêu chí tìm kiếm.
                  </p>
                  <motion.button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                      setSelectedStatus('all');
                    }}
                    className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Đặt lại bộ lọc
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
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
          onUnregister={handleUnregister}
          isRegistered={myParticipations.includes(Number(selectedActivity.id))}
          userRole="EMPLOYEE"
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
