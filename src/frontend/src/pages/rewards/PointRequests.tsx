import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Clock, Check, Ban, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { fetchAllEmployeePoints } from '../../store/pointSlice';
import { pointService } from '../../services/pointService';
import type { PointToMoneyHistoryDto } from '../../services/pointService';

export default function PointRequests() {
    const [pendingRequests, setPendingRequests] = useState<PointToMoneyHistoryDto[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ 
        show: false, 
        message: '', 
        type: 'success' 
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            setLoadingRequests(true);
            const response = await pointService.getPointToMoneyHistory(1, 100, undefined, 'pending');
            setPendingRequests(response.items);
        } catch (error) {
            console.error("Lỗi lấy danh sách yêu cầu:", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleProcessRequest = async (requestId: number, status: 'approved' | 'rejected') => {
        if (!window.confirm(`Bạn có chắc chắn muốn ${status === 'approved' ? 'DUYỆT' : 'TỪ CHỐI'} yêu cầu này?`)) return;

        try {
            setProcessingId(requestId);
            await pointService.processConversionRequest(requestId, status);
            showNotification(`Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} yêu cầu thành công`, 'success');
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 1000 }));
        } catch (error: any) {
            showNotification(error.message || "Lỗi xử lý", 'error');
        } finally {
            setProcessingId(null);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setShowToast({ show: true, message, type });
        setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
    };

    return (
        <motion.div 
            className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-10 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 text-white shadow-2xl overflow-hidden border border-white/20"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24" />
                        <div className="flex items-center gap-3 relative z-10">
                            <motion.div
                                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <CheckCircle className="w-7 h-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold">Duyệt yêu cầu đổi điểm</h1>
                                <p className="text-white/90 text-lg font-light">Xử lý các yêu cầu đổi điểm thưởng sang tiền mặt</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-purple-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Yêu cầu đổi điểm chờ duyệt</h2>
                            <p className="text-sm text-gray-500">Danh sách nhân viên yêu cầu đổi điểm sang tiền mặt</p>
                        </div>
                        <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                            Tổng: {pendingRequests.length} yêu cầu
                        </div>
                    </div>

                    {loadingRequests ? (
                        <motion.div 
                            className="flex justify-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Loader2 className="animate-spin text-blue-600 w-8 h-8"/>
                            <p className="ml-3 text-gray-600">Đang tải...</p>
                        </motion.div>
                    ) : pendingRequests.length === 0 ? (
                        <motion.div 
                            className="text-center py-16 flex flex-col items-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="bg-green-100 p-4 rounded-full mb-3">
                                <CheckCircle className="w-8 h-8 text-green-500"/>
                            </div>
                            <p className="text-gray-500 font-medium">Hiện tại không có yêu cầu nào cần duyệt.</p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-4">
                            {pendingRequests.map((req, index) => (
                                <motion.div 
                                    key={req.id} 
                                    className="border-2 border-purple-100 rounded-xl p-5 bg-white shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row justify-between items-center gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <motion.div 
                                            className="w-14 h-14 bg-linear-to-br from-blue-400 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                        >
                                            {req.employeeName.charAt(0)}
                                        </motion.div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{req.employeeName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock className="w-4 h-4"/>
                                                {new Date(req.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center md:items-end w-full md:w-auto bg-purple-50 p-3 rounded-lg md:bg-transparent md:p-0">
                                        <div className="text-xs text-gray-500 uppercase font-semibold">Yêu cầu đổi</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-blue-600">{req.pointRequested} điểm</span>
                                            <ArrowLeftRight className="w-5 h-5 text-gray-400"/>
                                            <span className="text-xl font-bold text-green-600">{req.moneyReceived.toLocaleString('vi-VN')} đ</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto justify-end">
                                        {processingId === req.id ? (
                                            <button disabled className="px-6 py-2 bg-gray-100 text-gray-400 rounded-lg flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin"/> Đang xử lý...
                                            </button>
                                        ) : (
                                            <>
                                                <motion.button 
                                                    onClick={() => handleProcessRequest(req.id, 'rejected')} 
                                                    className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 flex items-center gap-2 font-medium shadow-sm"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Ban className="w-4 h-4"/> Từ chối
                                                </motion.button>
                                                <motion.button 
                                                    onClick={() => handleProcessRequest(req.id, 'approved')} 
                                                    className="px-6 py-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center gap-2 font-bold shadow-lg"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Check className="w-5 h-5"/> Duyệt
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
            {showToast.show && (
                <motion.div 
                    className={`fixed bottom-5 right-5 px-4 py-3 rounded-xl shadow-2xl text-white flex items-center gap-2 ${showToast.type === 'success' ? 'bg-linear-to-r from-green-500 to-emerald-600' : 'bg-linear-to-r from-red-500 to-pink-600'}`}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {showToast.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
                    {showToast.message}
                </motion.div>
            )}
            </AnimatePresence>
        </motion.div>
    );
}
