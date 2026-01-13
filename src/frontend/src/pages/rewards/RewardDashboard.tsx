import React, { useState, useEffect } from 'react';
import { pointService } from '../../services/pointService';
import type { 
  EmployeePointDto, 
  PointTransactionDto,
  PointConversionRuleDto 
} from '../../services/pointService';
import { Loader2, AlertCircle, Target, Gift, TrendingUp, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RewardDashboard: React.FC = () => {
  // States cho dữ liệu
  const [employeePoint, setEmployeePoint] = useState<EmployeePointDto | null>(null);
  const [transactions, setTransactions] = useState<PointTransactionDto[]>([]);
  
  // [CẬP NHẬT] Đổi thành mảng để chứa danh sách các quy tắc
  const [conversionRules, setConversionRules] = useState<PointConversionRuleDto[]>([]);
  
  // States cho loading và error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const employeeId = parseInt(localStorage.getItem('userId') || '1');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pointData, transactionsData, ruleData] = await Promise.all([
        pointService.getEmployeePoint(employeeId),
        pointService.getEmployeeTransactionHistory(employeeId, 20),
        pointService.getActiveConversionRule(), // API này giờ trả về List
      ]);

      setEmployeePoint(pointData);
      setTransactions(transactionsData);

      // [CẬP NHẬT] Xử lý dữ liệu trả về là Array
      if (Array.isArray(ruleData)) {
        // Sắp xếp quy tắc từ bé đến lớn để dễ tính toán progress
        const sortedRules = ruleData.sort((a, b) => a.pointValue - b.pointValue);
        setConversionRules(sortedRules);
      } else if (ruleData) {
        // Fallback nếu backend trả về object đơn
        setConversionRules([ruleData]);
      } else {
        setConversionRules([]);
      }

    } catch (err: any) {
      console.error('Error fetching reward data:', err);
      setError(err.message || 'Không thể tải dữ liệu điểm thưởng');
    } finally {
      setLoading(false);
    }
  };

  // Tính toán stats
  const currentPoints = employeePoint?.pointTotal || 0;
  const stats = {
    currentPoints: currentPoints,
    totalAccumulatedPoints: transactions
      .filter(t => t.type === 'earn')
      .reduce((sum, t) => sum + t.value, 0),
    redeemedPoints: Math.abs(
      transactions
        .filter(t => t.type === 'redeem')
        .reduce((sum, t) => sum + t.value, 0)
    ),
  };

  // [CẬP NHẬT] Logic tính toán "Phần thưởng tiếp theo" (Next Reward)
  // Tìm mốc quy đổi gần nhất mà user CHƯA đạt được
  const nextTargetRule = conversionRules.find(r => r.pointValue > currentPoints);
  
  // Nếu đã vượt qua tất cả mốc, lấy mốc cao nhất để hiển thị (hoặc null)
  const maxRule = conversionRules.length > 0 ? conversionRules[conversionRules.length - 1] : null;
  const displayTarget = nextTargetRule || maxRule;

  // Tính % tiến độ
  let progressPercentage = 0;
  let progressText = "";

  if (displayTarget) {
    if (currentPoints >= displayTarget.pointValue) {
      // Đã đạt mốc cao nhất
      progressPercentage = 100;
      progressText = "Bạn đã chinh phục mốc cao nhất!";
    } else {
      // Đang chạy tới mốc tiếp theo
      progressPercentage = Math.min((currentPoints / displayTarget.pointValue) * 100, 100);
      progressText = `${currentPoints} / ${displayTarget.pointValue} điểm`;
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20" />
        <motion.div 
          className="flex flex-col items-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-12 w-12 text-blue-600" />
          </motion.div>
          <motion.span 
            className="text-gray-600 mt-4 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Đang tải dữ liệu...
          </motion.span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-400 rounded-full blur-3xl opacity-10" />
        <motion.div 
          className="flex flex-col items-center relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertCircle className="h-16 w-16 text-red-500" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <p className="font-semibold text-gray-900 text-lg mb-2">Có lỗi xảy ra</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button 
            onClick={fetchData} 
            className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            Thử lại
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-5 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* Page Header */}
        <motion.div 
          className="text-center sm:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            Trung Tâm Điểm Thưởng
          </h1>
          <p className="text-gray-600">
            Xin chào <span className="font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{employeePoint?.employeeName}</span>, hãy xem thành quả của bạn!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.2)" }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div 
                className="p-3 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Gift className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Điểm hiện có</p>
                <motion.p 
                  className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  {stats.currentPoints}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-200 hover:border-green-300 transition-all duration-300 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(34, 197, 94, 0.2)" }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div 
                className="p-3 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <TrendingUp className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Tổng tích lũy</p>
                <motion.p 
                  className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.4 }}
                >
                  {stats.totalAccumulatedPoints}
                </motion.p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-200 hover:border-orange-300 transition-all duration-300 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(249, 115, 22, 0.2)" }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div 
                className="p-3 bg-linear-to-br from-orange-500 to-amber-600 text-white rounded-xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Award className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Đã đổi thưởng</p>
                <motion.p 
                  className="text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.5 }}
                >
                  {stats.redeemedPoints}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* [CẬP NHẬT] Next Reward / Goal Section */}
        {displayTarget && (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-200 overflow-hidden relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(168, 85, 247, 0.2)" }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 opacity-50" />
            <div className="p-6 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    {nextTargetRule ? 'Mục tiêu tiếp theo' : 'Đã đạt mốc tối đa'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {nextTargetRule 
                      ? `Tích lũy thêm ${nextTargetRule.pointValue - currentPoints} điểm để đổi gói ${nextTargetRule.moneyValue.toLocaleString('vi-VN')}đ`
                      : `Bạn đang ở mốc đổi thưởng cao nhất! (${displayTarget.moneyValue.toLocaleString('vi-VN')}đ)`}
                  </p>
                </div>
                {currentPoints >= (conversionRules[0]?.pointValue || 0) && (
                  <motion.button
                    onClick={() => window.location.href = '/rewards/exchange'}
                    className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg flex items-center gap-2"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Đổi điểm ngay
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-xs font-bold inline-block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase">
                    Tiến độ
                  </span>
                  <motion.span 
                    className="text-xs font-bold inline-block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6 }}
                  >
                    {Math.round(progressPercentage)}%
                  </motion.span>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-linear-to-r from-blue-100 to-purple-100 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                </div>
                <div className="text-xs text-gray-500 text-center font-medium">
                  {progressText}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Conversion Rules */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            {/* linear overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-100/50 via-purple-50/30 to-pink-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold bg-linear-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Bảng tỷ giá quy đổi hiện tại
                </h4>
              </div>
              
              {conversionRules.length === 0 ? (
                <p className="text-gray-600 italic">Chưa có quy tắc quy đổi nào.</p>
              ) : (
                <ul className="space-y-3">
                  {conversionRules.map((rule, index) => (
                    <motion.li 
                      key={rule.id} 
                      className="flex items-center justify-between bg-white/90 backdrop-blur-sm p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg group/item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                    >
                      <span className="font-semibold text-gray-700 flex items-center gap-3">
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-linear-to-r from-blue-500 to-purple-500 shadow-md"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                        <span className="group-hover/item:text-blue-700 transition-colors">
                          Mốc {rule.pointValue} điểm
                        </span>
                      </span>
                      <span className="font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 text-lg">
                        = {rule.moneyValue.toLocaleString('vi-VN')} VNĐ
                        {currentPoints >= rule.pointValue && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-500 drop-shadow-md" />
                          </motion.div>
                        )}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
              
              <div className="mt-4 pt-4 border-t-2 border-blue-200/50">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm">💡</span>
                  <span>
                    <span className="font-semibold text-blue-700">Lưu ý:</span> Khi đổi điểm, hệ thống sẽ tự động chọn gói có lợi nhất cho bạn (ưu tiên mốc cao).
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardDashboard;