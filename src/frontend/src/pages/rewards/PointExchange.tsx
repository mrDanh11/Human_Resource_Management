import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PointExchangeLayout from "../../layouts/PointExchangeLayout";
import HalfCircleProgress from "../../components/rewards/HalfCircleProgress";
import ConversionRateInfo from "../../components/rewards/ConversionRateInfo";
import TickSelector from "../../components/rewards/TickSelector";
import { Loader2, Clock, Sparkles } from "lucide-react";
import { pointService } from "../../services/pointService";
import type { PointToMoneyHistoryDto, PointConversionRuleDto } from "../../services/pointService";
import ConfirmExchangeModal from "../../components/rewards/ConfirmExchangeModal";
import ExchangePointSuccessToast from "../../components/rewards/ExchangePointSuccessToast";

export default function PointExchange() {
  const employeeId = parseInt(localStorage.getItem("userId") || "1");
  
  const [currentPoints, setCurrentPoints] = useState(0);
  const [conversionRules, setConversionRules] = useState<PointConversionRuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [percent, setPercent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [selectedMoney, setSelectedMoney] = useState(0);
  const [exchanging, setExchanging] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PointToMoneyHistoryDto[]>([]);
  const [toast, setToast] = useState(false);

  const calculateMoney = (points: number) => {
    if (!conversionRules || conversionRules.length === 0) return 0;
    if (points === 0) return 0;
    
    const applicableRule = conversionRules
      .filter(r => r.pointValue <= points)
      .sort((a, b) => b.pointValue - a.pointValue)[0];

    if (!applicableRule) {
      const minRule = conversionRules.sort((a, b) => a.pointValue - b.pointValue)[0];
      return minRule ? Math.floor((points / minRule.pointValue) * minRule.moneyValue) : 0;
    }

    return Math.floor((points / applicableRule.pointValue) * applicableRule.moneyValue);
  };

  const currentAppliedRule = conversionRules.length > 0 
    ? (conversionRules.find(r => r.pointValue <= Math.round(currentPoints * percent / 100)) 
       || conversionRules[0]) 
    : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pointData, pendingData, rulesData] = await Promise.all([
        pointService.getEmployeePoint(employeeId),
        pointService.getPointToMoneyHistory(1, 100, employeeId, 'pending'),
        pointService.getActiveConversionRule()
      ]);

      setCurrentPoints(pointData.pointTotal);
      setPendingRequests(pendingData.items);

      if (Array.isArray(rulesData)) {
        setConversionRules(rulesData.sort((a, b) => a.pointValue - b.pointValue));
      } else if (rulesData) {
        setConversionRules([rulesData]);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (points: number) => {
    if (hasPendingRequest) {
      alert('Bạn đã có yêu cầu quy đổi đang chờ xử lý. Vui lòng đợi admin duyệt trước khi gửi yêu cầu mới.');
      return;
    }
    
    if (points % 100 !== 0) {
      alert('Số điểm quy đổi phải là bội số của 100');
      return;
    }

    const money = calculateMoney(points);
    setSelectedPoints(points);
    setSelectedMoney(money);
    setShowModal(true);
  };

  const handleConfirmExchange = async () => {
    if (hasPendingRequest) {
      setShowModal(false);
      return;
    }
    
    setExchanging(true);
    try {
      await pointService.requestPointToMoneyConversion(employeeId, selectedPoints);
      setShowModal(false);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      
      await fetchData();
      setPercent(0);
      
    } catch (error: any) {
      setShowModal(false);
      const errorMessage = error.message || 'Lỗi khi gửi yêu cầu quy đổi. Vui lòng thử lại!';
      alert(errorMessage);
    } finally {
      setExchanging(false);
    }
  };

  const hasPendingRequest = pendingRequests.length > 0;

  const handleChangePercent = useCallback((p: number) => {
    setPercent(p);
  }, []);

  if (loading) {
    return (
      <PointExchangeLayout>
        <div className="w-full min-h-screen flex items-center justify-center bg-[#f4f7fb]">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      </PointExchangeLayout>
    );
  }

  return (
    <PointExchangeLayout>
      <motion.div 
        className="w-full p-6 md:p-10 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Decorative background blobs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
        <motion.div 
          className="mb-6 relative max-w-6xl mx-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="relative rounded-2xl p-6 bg-white/90 backdrop-blur-sm overflow-hidden shadow-2xl border-2 border-purple-100">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 opacity-10 rounded-full blur-2xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-2xl -ml-16 -mb-16"></div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <motion.div 
                  className="w-14 h-14 bg-linear-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent tracking-tight">
                  Quy đổi điểm thưởng
                </h1>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                Chuyển đổi điểm thưởng của bạn thành tiền mặt
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {hasPendingRequest && (
            <motion.div 
              className="bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 max-w-6xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Clock className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-800 text-xl mb-2">
                    Yêu cầu đang chờ xử lý
                  </h3>
                  <p className="text-base text-yellow-700 mb-4 font-medium">
                    Bạn có {pendingRequests.length} yêu cầu quy đổi đang chờ admin duyệt. 
                    Vui lòng đợi trước khi gửi yêu cầu mới.
                  </p>
                  <div className="space-y-3">
                    {pendingRequests.map((req, index) => (
                      <motion.div 
                        key={req.id} 
                        className="bg-white rounded-xl px-4 py-3 text-base shadow-sm border border-yellow-200"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(234, 179, 8, 0.15)" }}
                      >
                        <span className="font-bold text-yellow-800">{req.pointRequested} điểm</span> 
                        <span className="text-yellow-600 mx-2">→</span> 
                        <span className="font-bold text-green-600">{req.moneyReceived.toLocaleString('vi-VN')}đ</span>
                        <span className="text-gray-600 ml-3 text-sm">
                          ({new Date(req.createdAt).toLocaleDateString('vi-VN')})
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 relative">
          <motion.div 
            className="lg:w-1/3 flex"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div 
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-100 w-full flex flex-col hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <HalfCircleProgress
                percent={percent}
                totalPoints={currentPoints}
                totalMoney={calculateMoney(Math.round(currentPoints * percent / 100))}
              />

              <div className="relative w-full my-8 flex justify-center">
                <div
                  className="w-full h-1 rounded-full"
                  style={{
                    background: `linear-linear(90deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.3) 50%, rgba(236,72,153,0.1) 100%)`,
                    boxShadow: "0 0 15px rgba(147, 51, 234, 0.3)",
                  }}
                ></div>
              </div>

              {currentAppliedRule ? (
                <div className="text-center p-5 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-sm">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Tỷ giá đang áp dụng</p>
                  <p className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentAppliedRule.pointValue} điểm = {currentAppliedRule.moneyValue.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              ) : (
                <ConversionRateInfo rate={+conversionRules[0]} />
              )}
            </motion.div>
          </motion.div>

          <motion.div 
            className="lg:w-2/3 flex"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.div 
              className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border-2 border-purple-100 w-full flex flex-col hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <TickSelector
                max={currentPoints}
                rate={conversionRules[0]?.moneyValue || 100}
                onChangePercent={handleChangePercent}
                onSelect={(points) => handleOpenModal(points)}
              />
            </motion.div>
          </motion.div>
        </div>

        <ConfirmExchangeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmExchange}
          points={selectedPoints}
          money={selectedMoney}
          loading={exchanging}
        />
        
        <ExchangePointSuccessToast show={toast} />

        <AnimatePresence>
          {exchanging && (
            <motion.div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border-2 border-purple-100"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-800 font-bold text-lg">Đang gửi yêu cầu quy đổi...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PointExchangeLayout>
  );
}