import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchEmployeeStatistics, fetchActivityStatistics } from "../../store/employeeSlice";
import { Loader2, Users, Activity, FileText, Plus, Gift, XCircle, Calendar, TrendingUp } from "lucide-react";

const HRDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics, activityStatistics, statisticsLoading, activityStatisticsLoading } = useAppSelector((state) => state.employee);

  useEffect(() => {
    dispatch(fetchEmployeeStatistics());
    dispatch(fetchActivityStatistics());
  }, [dispatch]);

  const totalEmployees = statistics?.totalEmployees || 0;
  const ongoingActivities = activityStatistics?.statusDistribution.find(s => s.status.toLowerCase() === 'ongoing')?.count || 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="relative rounded-2xl p-8 mb-10 bg-blue-600 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Dashboard HR
              </h1>
            </div>
            <p className="text-white/90 text-xl font-light">
              Tổng quan và quản lý hệ thống nhân sự
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
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
          {/* Card 1: Tổng nhân viên */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white w-7 h-7" />
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  ACTIVE
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tổng nhân viên
              </div>
              {statisticsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                </div>
              ) : (
                <div className="text-5xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {totalEmployees}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-600 font-medium">
                👥 Nhân viên đang làm việc
              </div>
            </div>
          </motion.div>

          {/* Card 2: Hoạt động đang diễn ra */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25)" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Activity className="text-white w-7 h-7" />
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  ONGOING
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Hoạt động đang diễn ra
              </div>
              {activityStatisticsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                </div>
              ) : (
                <div className="text-5xl font-bold bg-linear-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {ongoingActivities}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-600 font-medium">
                🎯 Hoạt động đang hoạt động
              </div>
            </div>
          </motion.div>

          {/* Card 3: Yêu cầu chờ xử lý */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.25)" }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="text-white w-7 h-7" />
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                  PENDING
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Yêu cầu chờ xử lý
              </div>
              <div className="text-5xl font-bold bg-linear-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                8
              </div>
              <div className="mt-3 text-xs text-gray-600 font-medium">
                ⏳ Yêu cầu cần duyệt
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Thao tác nhanh
            </h2>
            <p className="text-gray-600">Truy cập nhanh các chức năng quan trọng</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link
              to="/hr/activities/create"
              className="block group relative bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-1">Tạo hoạt động mới</div>
                  <div className="text-sm text-blue-100">Tạo sự kiện, cuộc thi mới</div>
                </div>
              </div>
            </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link
              to="/hr/rewards/hr-reward"
              className="block group relative bg-linear-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-1">Thưởng điểm nhân viên</div>
                  <div className="text-sm text-green-100">Tặng điểm khích lệ</div>
                </div>
              </div>
            </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link
                to="/hr/activities/cancel"
              className="block group relative bg-linear-to-r from-orange-600 to-orange-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <XCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-1">Hủy hoạt động</div>
                  <div className="text-sm text-orange-100">Hủy sự kiện đã tạo</div>
                </div>
              </div>
            </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Link
                to="/hr/requests"
              className="block group relative bg-linear-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-1">Xem yêu cầu nghỉ phép</div>
                  <div className="text-sm text-purple-100">Duyệt đơn nghỉ phép</div>
                </div>
              </div>
            </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HRDashboard;
