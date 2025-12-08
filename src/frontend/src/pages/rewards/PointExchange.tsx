import { useState, useEffect } from "react";
import { THEME_COLORS } from "../../components/common/THEME_COLORS";
import { pointService } from "../../services/pointService";
import type { EmployeePointDto, PointConversionRuleDto, PointToMoneyHistoryDto } from "../../services/pointService";

import ExchangePointHeader from "../../components/rewards/ExchangePointHeader";
import ExchangePointCurrent from "../../components/rewards/ExchangePointCurrent";
import ExchangePointForm from "../../components/rewards/ExchangePointForm";
import ExchangePointConfirmModal from "../../components/rewards/ExchangePointConfirmModal";
import ExchangePointSuccessToast from "../../components/rewards/ExchangePointSuccessToast";
import { Loader2, AlertCircle, Clock } from "lucide-react";

export default function PointExchange() {
  const employeeId = parseInt(localStorage.getItem('userId') || '1');

  // States cho dữ liệu
  const [employeePoint, setEmployeePoint] = useState<EmployeePointDto | null>(null);
  const [conversionRule, setConversionRule] = useState<PointConversionRuleDto | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PointToMoneyHistoryDto[]>([]);
  
  // States cho UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [pendingPoints, setPendingPoints] = useState(0);
  const [pendingMoney, setPendingMoney] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pointData, ruleData, pendingData] = await Promise.all([
        pointService.getEmployeePoint(employeeId),
        pointService.getActiveConversionRule(),
        pointService.getPointToMoneyHistory(1, 100, employeeId, 'pending'),
      ]);

      setEmployeePoint(pointData);
      setConversionRule(ruleData);
      setPendingRequests(pendingData.items);
    } catch (err: any) {
      console.error('Error fetching exchange data:', err);
      setError(err.message || 'Không thể tải dữ liệu quy đổi');
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (points: number, money: number) => {
    setPendingPoints(points);
    setPendingMoney(money);
    setModalOpen(true);
  };

  const confirmExchange = async () => {
    try {
      setSubmitting(true);
      setModalOpen(false);

      // Gọi API quy đổi điểm
      await pointService.requestPointToMoneyConversion(employeeId, pendingPoints);

      // Hiển thị toast thành công
      setToast(true);
      setTimeout(() => setToast(false), 3000);

      // Refresh dữ liệu
      await fetchData();
    } catch (err: any) {
      console.error('Error requesting conversion:', err);
      alert(err.message || 'Có lỗi xảy ra khi gửi yêu cầu quy đổi');
    } finally {
      setSubmitting(false);
    }
  };

  const hasPendingRequest = pendingRequests.length > 0;

  if (loading) {
    return (
      <div
        className="w-full min-h-screen p-4 flex items-center justify-center"
        style={{ backgroundColor: THEME_COLORS.primary[50] }}
      >
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600 mt-4">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error || !employeePoint || !conversionRule) {
    return (
      <div
        className="w-full min-h-screen p-4 flex items-center justify-center"
        style={{ backgroundColor: THEME_COLORS.primary[50] }}
      >
        <div className="flex flex-col items-center text-red-600">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="font-medium">{error || 'Không thể tải dữ liệu'}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const CURRENT_POINTS = employeePoint.pointTotal;
  const EXCHANGE_RATE = conversionRule.moneyValue / conversionRule.pointValue * 100;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <h1 className="text-blue-600 text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3">
          Quy đổi điểm thưởng
        </h1>
        <p className="text-gray-600 text-sm sm:text-base px-4">
          Chuyển đổi điểm thưởng của bạn thành tiền mặt
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Pending Request Alert */}
        {hasPendingRequest && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 text-base sm:text-lg mb-2">
                  Yêu cầu đang chờ xử lý
                </h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Bạn có {pendingRequests.length} yêu cầu quy đổi đang chờ admin duyệt. 
                  Vui lòng đợi trước khi gửi yêu cầu mới.
                </p>
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-yellow-100 rounded-lg px-3 py-2 text-sm">
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

        {/* Current Points Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
          <h3 className="text-gray-600 text-sm mb-3">Điểm hiện có</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">{CURRENT_POINTS}</div>
              <div className="text-sm text-gray-500">điểm</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Tỷ lệ quy đổi:</span> 100 điểm = {EXCHANGE_RATE.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>

        {/* Exchange Form or Disabled Message */}
        {hasPendingRequest ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Không thể gửi yêu cầu mới
            </h3>
            <p className="text-sm text-gray-600">
              Vui lòng đợi admin xử lý yêu cầu hiện tại trước khi gửi yêu cầu mới
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-gray-800 font-semibold text-base sm:text-lg mb-4">
              Nhập số điểm cần quy đổi
            </h3>
            <ExchangePointForm
              current={CURRENT_POINTS}
              rate={EXCHANGE_RATE}
              openConfirm={openConfirm}
            />
          </div>
        )}

        <ExchangePointConfirmModal
          open={modalOpen}
          points={pendingPoints}
          money={pendingMoney}
          onConfirm={confirmExchange}
          onClose={() => setModalOpen(false)}
        />

        <ExchangePointSuccessToast show={toast} />

        {submitting && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-700 font-medium">Đang gửi yêu cầu quy đổi...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}