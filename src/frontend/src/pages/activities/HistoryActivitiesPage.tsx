import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, CheckCircle, Sparkles, Award } from 'lucide-react';
import ActivityListCard from '../../components/activities/ActivityListCard';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';
import type { Activity } from '../../types/activity';
import { getMyParticipations, unregisterActivity } from '../../services/activityService';
import type { MyParticipationResponse } from '../../types/activity';

export default function HistoryActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<Activity['activityType'] | 'all'>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchMyActivities();
  }, []);

  const fetchMyActivities = async () => {
    try {
      setLoading(true);
      const data = await getMyParticipations();
      const mappedActivities: Activity[] = data.map((p: MyParticipationResponse) => ({
        id: p.activityId,
        name: p.activityName,
        description: p.description,
        startDate: p.startDate,
        endDate: p.endDate,
        registrationStartDate: p.registrationStartDate,
        registrationEndDate: p.registrationEndDate,
        maxParticipants: p.maxParticipants,
        currentParticipants: p.currentParticipants || 0,
        location: p.location,
        activityType: p.activityType as any,
        status: p.activityStatus as any,
        imageUrl: p.imageUrl,
        organizer: p.organizer,
        points: p.points,
        createdAt: '',
        updatedAt: '',
      }));
      setActivities(mappedActivities);
    } catch (error) {
      console.error("Failed to fetch my activities", error);
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

  const handleUnregister = async (activityId: string) => {
    const activity = activities.find(a => a.id === +activityId);
    if (activity && window.confirm(`Bạn có chắc muốn hủy đăng ký hoạt động "${activity.name}"?`)) {
      try {
        await unregisterActivity(Number(activityId));
        alert(`Đã hủy đăng ký: ${activity.name}`);
        fetchMyActivities(); // Refresh list
      } catch (error) {
        console.error("Unregister failed", error);
        alert("Hủy đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  // Filter registered activities
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
    <div className="min-h-screen bg-linear-to-br from-green-50 via-teal-50 to-blue-50 p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 right-40 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header and Filters Combined */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <motion.div 
            className="relative bg-green-600 text-white px-8 py-8 overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <motion.div 
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Hoạt động đã đăng ký
                  </h1>
                  <p className="text-green-100 mt-1">
                    Danh sách các hoạt động bạn đã đăng ký tham gia
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters Section */}
          <motion.div 
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hoạt động..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                />
              </motion.div>

              {/* Type Filter */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.01 }}
              >
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as Activity['activityType'] | 'all')}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 appearance-none transition-all"
                >
                  <option value="all">🌟 Tất cả loại</option>
                  <option value="sports">🏃 Thể thao</option>
                  <option value="charity">❤️ Từ thiện</option>
                  <option value="training">📚 Đào tạo</option>
                  <option value="team-building">🤝 Team Building</option>
                  <option value="volunteer">🌟 Tình nguyện</option>
                </select>
              </motion.div>
            </div>

            {/* Results Count */}
            <motion.div 
              className="mt-4 text-sm font-medium text-gray-600 bg-linear-to-r from-green-50 to-teal-50 px-4 py-2 rounded-lg border border-green-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {filteredActivities.length > 0 ? (
                <>
                  Hiển thị <span className="font-bold text-green-600">{startIndex + 1}-{Math.min(endIndex, filteredActivities.length)}</span> trong tổng số <span className="font-bold text-green-600">{filteredActivities.length}</span> hoạt động đã đăng ký
                </>
              ) : (
                <>Bạn đã đăng ký <span className="font-bold text-green-600">0</span> hoạt động</>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Activity Grid */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {loading ? (
             <div className="flex justify-center items-center py-20">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               >
                 <Sparkles className="w-12 h-12 text-green-500" />
               </motion.div>
             </div>
          ) : filteredActivities.length > 0 ? (
            <>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                key={currentPage}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {currentActivities.map((activity) => (
                  <motion.div
                    key={`${activity.id}-${currentPage}`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <ActivityListCard
                      activity={activity}
                      onViewDetails={handleViewDetails}
                      onRegister={() => {}}
                      onUnregister={handleUnregister}
                      isRegistered={true}
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
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border-2 border-gray-200 shadow-sm'
                    }`}
                    whileHover={currentPage !== 1 ? { scale: 1.05, y: -2 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                  >
                    Trước
                  </motion.button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 || 
                                   page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage && page === currentPage - 2) {
                      return <span key={page} className="px-2 text-gray-400 font-bold">...</span>;
                    }
                    if (!showPage && page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400 font-bold">...</span>;
                    }
                    if (!showPage) return null;
                    
                    return (
                      <motion.button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-linear-to-r from-green-600 to-teal-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border-2 border-gray-200 shadow-sm'
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
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border-2 border-gray-200 shadow-sm'
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Calendar className="w-20 h-20 text-green-300" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Chưa có hoạt động đã đăng ký
                </h3>
                <p className="text-gray-600 max-w-md">
                  Bạn chưa đăng ký hoạt động nào. 
                  Hãy khám phá các hoạt động mới và đăng ký tham gia!
                </p>
                <motion.div
                  className="mt-2 px-4 py-2 bg-linear-to-r from-green-100 to-teal-100 rounded-lg border border-green-200"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Tham gia hoạt động để nhận điểm thưởng!
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
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
          onRegister={() => {}}
          onUnregister={handleUnregister}
          isRegistered={true}
        />
      )}
    </div>
  );
}
