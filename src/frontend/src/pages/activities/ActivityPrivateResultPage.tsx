import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CircleStar, AlertCircle, Trophy, Award, Sparkles } from 'lucide-react';
import ActivityListResultCard from '../../components/activities/ActivityListResultCard';
import ActivityResultModal from '../../components/activities/ActivityResultModal';
import { fetchActivityEmployeeAttended } from '../../store/participationSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { ParticipationData } from '../../types/activity';

export default function ActivityPrivateResultPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedActivity, setSelectedActivity] = useState<ParticipationData | null>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    const currentEmployeeId = parseInt(localStorage.getItem('userId') || '1');

    const dispatch = useAppDispatch();
    const { participation, loading: loadingParticipation, error: participationError } = useAppSelector((state) => state.participation);

    useEffect(() => {
        dispatch(fetchActivityEmployeeAttended(currentEmployeeId));
    }, [dispatch]);


    const handleViewResult = (activityId: number) => {
        const activity = participation.find(a => a.activityId === activityId);
        if (activity) {
            setSelectedActivity(activity);
            setIsResultModalOpen(true);
        }
    }

    const myActivities = participation.filter(activity => {
        // Search filter
        const matchesSearch = searchQuery === '' || 
                             activity.activityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             activity.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header and Filters Combined */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header Section */}
                    <motion.div 
                        className="relative bg-blue-600 text-white px-8 py-8 overflow-hidden"
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
                                    <Trophy className="w-8 h-8" />
                                </motion.div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        Thành tích của bạn
                                    </h1>
                                    <p className="text-white/90 mt-1 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Ghi nhận kết quả của bạn trong các hoạt động
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
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </motion.div>
                        </div>
                        {/* Activity Grid */}
                        <motion.div 
                            className="mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {loadingParticipation ? (

                                <motion.div 
                                    className="flex justify-center items-center py-20"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="h-12 w-12 text-blue-600" />
                                    </motion.div>
                                    <span className="ml-3 text-gray-600 font-medium">Đang tải dữ liệu...</span>
                                </motion.div>

                            ) : participationError ? (

                                <motion.div 
                                    className="flex flex-col items-center text-red-600 py-12"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <AlertCircle className="h-16 w-16 mb-4" />
                                    </motion.div>
                                    <p className="font-bold text-lg">Có lỗi xảy ra</p>
                                    <p className="text-sm mt-2 bg-red-50 px-4 py-2 rounded-lg">{participationError}</p>
                                </motion.div>

                            ) : myActivities.length > 0 ? (
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {myActivities.map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.5 }}
                                        >
                                            <ActivityListResultCard
                                                activity={activity}
                                                onViewResult={handleViewResult}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/50"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <motion.div
                                            animate={{ 
                                                y: [0, -10, 0],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ 
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <CircleStar className="w-20 h-20 text-purple-300" />
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
                                            }}
                                            className="mt-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 40px rgba(37, 99, 235, 0.4)" }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            🔄 Đặt lại bộ lọc
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            {selectedActivity && (
                <ActivityResultModal
                    participation={selectedActivity}
                    isOpen={isResultModalOpen}
                    onClose={() => {
                        setIsResultModalOpen(false);
                        setSelectedActivity(null);
                    }}
                />
            )}
        </div>
    )
}