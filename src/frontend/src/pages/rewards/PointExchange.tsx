import { useState, useEffect } from "react";
import PointExchangeLayout from "../../components/rewards/PointExchangeLayout";
import HalfCircleProgress from "../../components/rewards/HalfCircleProgress";
import ConversionRateInfo from "../../components/rewards/ConversionRateInfo";
import TickSelector from "../../components/rewards/TickSelector";
import { usePointExchange } from "../../hooks/usePointExchange";
import { calculateMoneyFromPoints } from "../../utils/pointCalculations";
import { Loader2, Clock } from "lucide-react";
import { pointService } from "../../services/pointService";
import type { PointToMoneyHistoryDto } from "../../services/pointService";
import ConfirmExchangeModal from "../../components/rewards/ConfirmExchangeModal";
import ExchangePointSuccessToast from "../../components/rewards/ExchangePointSuccessToast";

/* -------------------------------------------------------------------------- */
/*                                MAIN SCREEN                                 */
/* -------------------------------------------------------------------------- */

export default function PointExchange() {
  const employeeId = parseInt(localStorage.getItem("userId") || "1");
  const { currentPoints, conversionRate, loading } = usePointExchange(employeeId);
  const [percent, setPercent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [selectedMoney, setSelectedMoney] = useState(0);
  const [exchanging, setExchanging] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PointToMoneyHistoryDto[]>([]);
  const [toast, setToast] = useState(false);

  const totalMoney = calculateMoneyFromPoints(currentPoints, conversionRate);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const pendingData = await pointService.getPointToMoneyHistory(1, 100, employeeId, 'pending');
      setPendingRequests(pendingData.items);
    } catch (err: any) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const handleOpenModal = (points: number, money: number) => {
    // Kiểm tra nếu đã có yêu cầu pending
    if (hasPendingRequest) {
      alert('Bạn đã có yêu cầu quy đổi đang chờ xử lý. Vui lòng đợi admin duyệt trước khi gửi yêu cầu mới.');
      return;
    }
    
    setSelectedPoints(points);
    setSelectedMoney(money);
    setShowModal(true);
  };

  const handleConfirmExchange = async () => {
    // Kiểm tra lại trước khi gửi request
    if (hasPendingRequest) {
      setShowModal(false);
      alert('Bạn đã có yêu cầu quy đổi đang chờ xử lý. Vui lòng đợi admin duyệt trước khi gửi yêu cầu mới.');
      return;
    }
    
    setExchanging(true);
    try {
      await pointService.requestPointToMoneyConversion(employeeId, selectedPoints);
      setShowModal(false);
      
      // Hiển thị toast thành công
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      
      // Refresh dữ liệu
      await fetchPendingRequests();
      
      // Không chuyển trang, chỉ reload dữ liệu và hiển thị toast
    } catch (error: any) {
      setShowModal(false);
      // Hiển thị thông báo lỗi chi tiết hơn
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
      <div className="w-full p-6 md:p-10" style={{ background: '#fafdff' }}>
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Quy đổi điểm thưởng
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Chuyển đổi điểm thưởng của bạn thành tiền mặt
          </p>
        </div>

        {/* ---------------------------------------------------------------------- */}
        {/*                        BỐ CỤC 1/3 - 2/3                                */}
        {/* ---------------------------------------------------------------------- */}

        {/* Pending Request Alert */}
        {hasPendingRequest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-6 max-w-6xl mx-auto">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 text-lg sm:text-xl mb-2">
                  Yêu cầu đang chờ xử lý
                </h3>
                <p className="text-base text-yellow-700 mb-3">
                  Bạn có {pendingRequests.length} yêu cầu quy đổi đang chờ admin duyệt. 
                  Vui lòng đợi trước khi gửi yêu cầu mới.
                </p>
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-yellow-100 rounded-lg px-3 py-2 text-base">
                      <span className="font-medium">{req.pointRequested} điểm</span> → {req.moneyReceived.toLocaleString('vi-VN')}đ
                      <span className="text-gray-600 ml-2">
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
          {/* Vertical divider only between boxes */}
          {/* <div className="hidden lg:block absolute" style={{left: '33.3333%', top: 0, bottom: 0, width: '0', height: '100%', borderLeft: '1px solid #E6E6E6', zIndex: 1}}></div> */}

          {/* LEFT — 1/3 */}
          <div className="lg:w-1/3 flex">
            <div className="p-6 rounded-2xl bg-white shadow border border-[#E6E6E6] w-full flex flex-col" style={{ boxShadow: '0 1px 4px rgba(0,102,255,0.08)' }}>

              {/* HALF CIRCLE */}
              <HalfCircleProgress
                percent={percent}
                totalPoints={currentPoints}
                totalMoney={totalMoney}
              />

              {/* BEAUTIFUL DIVIDER */}
              <div className="relative w-full my-8 flex justify-center">
                <div
                  className="w-full h-0.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: `
                      linear-gradient(
                        90deg,
                        rgba(255,255,255,0) 0%,
                        rgba(153,180,255,0.4) 50%,
                        rgba(255,255,255,0) 100%
                      )
                    `,
                    boxShadow: "0 0 10px rgba(30, 90, 255, 0.25)",
                  }}
                ></div>
              </div>

              {/* INFO BOX */}
              <ConversionRateInfo rate={conversionRate} />
            </div>
          </div>

          {/* RIGHT — 2/3 */}
          <div className="lg:w-2/3 flex">
            <div className="p-6 rounded-2xl bg-white shadow border border-[#E6E6E6] w-full flex flex-col" style={{ boxShadow: '0 1px 4px rgba(0,102,255,0.08)' }}>
              <TickSelector
                max={currentPoints}
                rate={conversionRate}
                onChangePercent={(p: number) => setPercent(p)}
                onSelect={handleOpenModal}
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
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-700 font-medium">Đang gửi yêu cầu quy đổi...</p>
            </div>
          </div>
        )}
      </div>
    </PointExchangeLayout>
  );
}