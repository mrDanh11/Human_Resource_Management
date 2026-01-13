import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Sparkles, Filter, TrendingUp } from 'lucide-react';
import CompletedActivityCard from '../../components/activities/CompletedActivityCard';
import ActivityStatisticsModal from '../../components/activities/ActivityStatisticsModal';
import type { CompletedActivityData } from '../../types/activity';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCompletedActivities } from '../../store/completedActivitySlice';

export default function AdminActivityListPage() {
  const dispatch = useAppDispatch();
  const { activities, loading, error } = useAppSelector((state) => state.completedActivity);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CompletedActivityData['activityType'] | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<CompletedActivityData | null>(null);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch completed activities on component mount
  useEffect(() => {
    dispatch(fetchCompletedActivities());
  }, [dispatch]);

  console.log('Completed Activities:', activities);

  useEffect(() => {
    if (isStatisticsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isStatisticsModalOpen]);

  const handleViewStatistics = (activityId: string) => {
    const activity = activities.find(a => a.id === Number(activityId));
    if (activity) {
      setSelectedActivity(activity);
      setIsStatisticsModalOpen(true);
    }
  };

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    // Search filter
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedType === 'all' || activity.activityType === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(startIndex, endIndex);

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
    <motion.div 
      className="h-full bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                <h1 className="text-4xl font-bold tracking-tight">
                  Quản lý hoạt động
                </h1>
              </div>
              <p className="text-white/90 text-lg font-light ml-16">Phân tích và theo dõi hoạt động đã hoàn thành</p>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {/* Top row: Search + Type Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <motion.div 
                  className="relative"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm hoạt động..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </motion.div>

                {/* Type Filter */}
                <motion.div 
                  className="relative"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as CompletedActivityData['activityType'] | 'all')}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none bg-white transition-all"
                  >
                    <option value="all">Tất cả loại</option>
                    <option value="sports">Thể thao</option>
                    <option value="charity">Từ thiện</option>
                    <option value="training">Đào tạo</option>
                    <option value="team-building">Team Building</option>
                    <option value="volunteer">Tình nguyện</option>
                  </select>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              className="flex justify-center items-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-red-800 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed Activities */}
        {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Hoạt động đã hoàn thành
            </h2>
          </motion.div>
          
          {filteredActivities.length > 0 ? (
            <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
            >
              {currentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <CompletedActivityCard
                    activity={activity}
                    onViewStatistics={handleViewStatistics}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center items-center gap-2 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200'
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.05, y: -2 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Trước
                </motion.button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
                      className={`px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  );
                })}
                
                <motion.button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200'
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.05, y: -2 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  Sau
                </motion.button>
              </motion.div>
            )}
            </>
          ) : (
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Calendar className="w-20 h-20 text-gray-300" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900">
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
                  }}
                  className="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Đặt lại bộ lọc
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
        )}
      </div>

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
    </motion.div>
  );
}
