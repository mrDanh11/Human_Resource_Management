import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployeeStatistics, fetchActivityStatistics } from '../../store/employeeSlice';
import { Users, FileText, Activity, UserPlus, Plus, Shield, TrendingUp, Loader2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { statistics, statisticsLoading, activityStatistics, activityStatisticsLoading } = useAppSelector((state) => state.employee);

  useEffect(() => {
    dispatch(fetchEmployeeStatistics());
    dispatch(fetchActivityStatistics());
  }, [dispatch]);

  console.log('Activity Statistics:', activityStatistics);

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
                <Shield className="text-white w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight">
                Dashboard Quản trị
              </h1>
            </div>
            <p className="text-white/90 text-xl font-light">
              Quản lý và giám sát toàn bộ hệ thống
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
                  TOTAL
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
                  {statistics?.totalEmployees || 0}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-600 font-medium">
                👥 Tổng số nhân viên hệ thống
              </div>
            </div>
          </motion.div>

          {/* Card 2: Yêu cầu nghỉ phép */}
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
                Yêu cầu nghỉ phép chờ duyệt
              </div>
              <div className="text-5xl font-bold bg-linear-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                8
              </div>
              <div className="mt-3 text-xs text-gray-600 font-medium">
                ⏳ Đơn cần xem xét
              </div>
            </div>
          </motion.div>

          {/* Card 3: Hoạt động mở đăng ký */}
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
                  OPEN
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Hoạt động đang mở đăng ký
              </div>
              {activityStatisticsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                </div>
              ) : (
                <div className="text-5xl font-bold bg-linear-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {activityStatistics?.openRegistration || 0}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-600 font-medium">
                📝 Đang nhận đăng ký
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Pie Charts - Side by Side */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Pie Chart - Phân bổ chức vụ */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Phân bổ chức vụ nhân viên
              </h2>
            </div>
            {statisticsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : statistics?.roleDistribution && statistics.roleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={statistics.roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent = 0, payload }) => `${payload.roleName}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="roleName"
                  >
                    {statistics.roleDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | undefined) => value !== undefined ? [`${value} nhân viên`, 'Số lượng'] : ['', 'Số lượng']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Không có dữ liệu</p>
              </div>
            )}
          </motion.div>

          {/* Pie Chart - Phân bố hoạt động */}
          <motion.div 
            className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Activity className="text-white w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Phân bố trạng thái hoạt động
              </h2>
            </div>
            {activityStatisticsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
                <p className="text-gray-500">Đang tải dữ liệu...</p>
              </div>
            ) : activityStatistics?.statusDistribution && activityStatistics.statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={activityStatistics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent = 0, payload }) => `${payload.status}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                  >
                    {activityStatistics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number | undefined) => value !== undefined ? [`${value} hoạt động`, 'Số lượng'] : ['', 'Số lượng']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Không có dữ liệu</p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Thao tác nhanh
            </h2>
            <p className="text-gray-600">Truy cập nhanh các chức năng quản trị</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.button
              onClick={() => navigate("/admin/employee/create")}
              className="group relative bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-lg font-bold mb-1">Thêm nhân viên mới</div>
                  <div className="text-sm text-blue-100">Tạo tài khoản nhân viên</div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate("/admin/activities/create")}
              className="group relative bg-linear-to-r from-green-600 to-green-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-lg font-bold mb-1">Tạo hoạt động mới</div>
                  <div className="text-sm text-green-100">Tạo sự kiện, cuộc thi</div>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
