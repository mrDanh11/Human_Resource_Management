import { useState, useEffect } from "react";
import PointExchangeLayout from "../../layouts/PointExchangeLayout";
import HalfCircleProgress from "../../components/rewards/HalfCircleProgress";
import ConversionRateInfo from "../../components/rewards/ConversionRateInfo";
import TickSelector from "../../components/rewards/TickSelector";
import { Loader2, Clock } from "lucide-react";
import { pointService } from "../../services/pointService";
import type { PointToMoneyHistoryDto, PointConversionRuleDto } from "../../services/pointService";
import ConfirmExchangeModal from "../../components/rewards/ConfirmExchangeModal";
import ExchangePointSuccessToast from "../../components/rewards/ExchangePointSuccessToast";

export default function PointExchange() {
  const employeeId = parseInt(localStorage.getItem("userId") || "1");
  
  // Custom states thay vì dùng hook cũ để kiểm soát tốt hơn việc API trả về List
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

  // [FIX] Hàm tính tiền dựa trên Tiered Rewards
  const calculateMoney = (points: number) => {
    if (!conversionRules || conversionRules.length === 0) return 0;
    
    // Tìm rule có mốc điểm cao nhất mà <= points
    const applicableRule = conversionRules
      .filter(r => r.pointValue <= points)
      .sort((a, b) => b.pointValue - a.pointValue)[0]; // Sắp xếp giảm dần lấy cái đầu

    if (!applicableRule) {
      // Trường hợp chưa đủ mốc tối thiểu, lấy tỷ giá thấp nhất để ước tính (hoặc trả về 0)
      const minRule = conversionRules.sort((a, b) => a.pointValue - b.pointValue)[0];
      return minRule ? (points / minRule.pointValue) * minRule.moneyValue : 0;
    }

    return (points / applicableRule.pointValue) * applicableRule.moneyValue;
  };

  // Rule hiện tại đang áp dụng (để hiển thị Info Box)
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

      // [FIX] Xử lý dữ liệu rules trả về là Array
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
    
    // Validate bội số 100
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
      
      // Refresh dữ liệu
      await fetchData();
      setPercent(0); // Reset thanh kéo về 0
      
    } catch (error: any) {
      setShowModal(false);
      const errorMessage = error.message || 'Lỗi khi gửi yêu cầu quy đổi. Vui lòng thử lại!';
      alert(errorMessage);
    } finally {
      setExchanging(false);
    }
  };

  const hasPendingRequest = pendingRequests.length > 0;

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
      <div className="w-full p-6 md:p-10 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        {/* HEADER */}
        <div className="mb-8 relative">
          <div className="relative rounded-2xl p-8 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-4xl">💰</span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Quy đổi điểm thưởng
                </h1>
              </div>
              <p className="text-white/90 text-lg font-light">
                Chuyển đổi điểm thưởng của bạn thành tiền mặt
              </p>
            </div>
          </div>
        </div>

        {/* Pending Request Alert */}
        {hasPendingRequest && (
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8 max-w-6xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-800 text-xl mb-2">
                  Yêu cầu đang chờ xử lý
                </h3>
                <p className="text-base text-yellow-700 mb-4 font-medium">
                  Bạn có {pendingRequests.length} yêu cầu quy đổi đang chờ admin duyệt. 
                  Vui lòng đợi trước khi gửi yêu cầu mới.
                </p>
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-white rounded-xl px-4 py-3 text-base shadow-sm border border-yellow-200">
                      <span className="font-bold text-yellow-800">{req.pointRequested} điểm</span> 
                      <span className="text-yellow-600 mx-2">→</span> 
                      <span className="font-bold text-green-600">{req.moneyReceived.toLocaleString('vi-VN')}đ</span>
                      <span className="text-gray-600 ml-3 text-sm">
                        ({new Date(req.createdAt).toLocaleDateString('vi-VN')})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 relative">
          
          {/* LEFT — 1/3 */}
          <div className="lg:w-1/3 flex">
            <div className="p-6 rounded-2xl bg-white shadow-lg border-2 border-gray-100 w-full flex flex-col hover:shadow-xl transition-shadow duration-300">

              {/* HALF CIRCLE */}
              <HalfCircleProgress
                percent={percent}
                totalPoints={currentPoints}
                // Tính tiền động dựa trên % điểm đang chọn thay vì tổng tiền tĩnh
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

              {/* INFO BOX: Hiển thị tỷ giá đang áp dụng */}
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
            </div>
          </div>

          {/* RIGHT — 2/3 */}
          <div className="lg:w-2/3 flex">
            <div className="p-6 rounded-2xl bg-white shadow-lg border-2 border-gray-100 w-full flex flex-col hover:shadow-xl transition-shadow duration-300">
              <TickSelector
                max={currentPoints}
                rate ={+conversionRules[0]} // Truyền rate mặc định để tránh lỗi component con
                onChangePercent={(p: number) => setPercent(p)}
                onSelect={(points) => handleOpenModal(points)} // Chỉ cần truyền points, money sẽ tính lại trong hàm handleOpen
              />
            </div>
          </div>
        </div>

        {/* CONFIRMATION MODAL */}
        <ConfirmExchangeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmExchange}
          points={selectedPoints}
          money={selectedMoney}
          loading={exchanging}
        />
        
        <ExchangePointSuccessToast show={toast} />

        {exchanging && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border-2 border-gray-100">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-800 font-bold text-lg">Đang gửi yêu cầu quy đổi...</p>
            </div>
          </div>
        )}
      </div>
    </PointExchangeLayout>
  );
}