import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Loader2, Clock, Filter, RefreshCcw, ArrowLeftRight, AlertCircle, CheckCircle } from 'lucide-react';
import { pointService } from '../../services/pointService';
import type { PointTransactionDto } from '../../services/pointService';

export default function PointHistory() {
    const [history, setHistory] = useState<PointTransactionDto[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const [historyTotalCount, setHistoryTotalCount] = useState(0);
    const [historyFilter, setHistoryFilter] = useState<string>('');
    const historyItemsPerPage = 5;
    const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ 
        show: false, 
        message: '', 
        type: 'success' 
    });

    useEffect(() => {
        fetchHistory();
    }, [historyPage, historyFilter]);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await pointService.getPointTransactions(
                historyPage, 
                historyItemsPerPage, 
                undefined, 
                historyFilter || undefined
            ); 
            setHistory(response.items);
            setHistoryTotalCount(response.totalCount);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const getTransactionStyle = (type: string) => {
        switch(type) {
            case 'earn':
                return { color: 'text-green-600', bg: 'bg-green-100', sign: '+', label: 'Cộng điểm' };
            case 'redeem':
                return { color: 'text-orange-600', bg: 'bg-orange-100', sign: '-', label: 'Đổi thưởng/Bị phạt' };
            case 'adjustment':
                return { color: 'text-blue-600', bg: 'bg-blue-100', sign: '~', label: 'Điều chỉnh' };
            case 'transfer':
                return { color: 'text-purple-600', bg: 'bg-purple-100', sign: '->', label: 'Chuyển điểm' };
            default:
                return { color: 'text-gray-600', bg: 'bg-gray-100', sign: '', label: type };
        }
    };

    const totalHistoryPages = Math.ceil(historyTotalCount / historyItemsPerPage);
    const startHistoryIdx = (historyPage - 1) * historyItemsPerPage;

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
                                <Calendar className="w-7 h-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold">Lịch sử giao dịch điểm</h1>
                                <p className="text-white/90 text-lg font-light">Nhật ký biến động điểm thưởng trong hệ thống</p>
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Nhật ký giao dịch điểm</h2>
                            <p className="text-sm text-gray-500">Lịch sử biến động điểm thưởng trong hệ thống</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <motion.div 
                                className="relative"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-4 h-4" />
                                <select 
                                    value={historyFilter} 
                                    onChange={(e) => { setHistoryFilter(e.target.value); setHistoryPage(1); }}
                                    className="pl-9 pr-4 py-2 border-2 border-purple-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 cursor-pointer hover:border-purple-300 transition-all"
                                >
                                    <option value="">Tất cả giao dịch</option>
                                    <option value="earn">Cộng điểm (Earn)</option>
                                    <option value="redeem">Đổi thưởng/Bị phạt (Redeem)</option>
                                    <option value="adjustment">Điều chỉnh (Adjustment)</option>
                                    <option value="transfer">Chuyển điểm (Transfer)</option>
                                </select>
                            </motion.div>
                            <motion.button 
                                onClick={() => fetchHistory()} 
                                className="p-2 border-2 border-purple-200 rounded-xl hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-all" 
                                title="Làm mới"
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <RefreshCcw className="w-4 h-4"/>
                            </motion.button>
                        </div>
                    </div>

                    {loadingHistory ? (
                        <motion.div 
                            className="flex justify-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Loader2 className="animate-spin text-blue-600 w-8 h-8"/>
                            <p className="ml-3 text-gray-600 font-medium">Đang tải...</p>
                        </motion.div>
                    ) : history.length === 0 ? (
                        <motion.div 
                            className="text-center py-16 text-gray-500 flex flex-col items-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="bg-purple-100 p-4 rounded-full mb-3">
                                <Clock className="w-10 h-10 text-purple-400"/>
                            </div>
                            <p className="font-medium text-gray-700">Không tìm thấy lịch sử giao dịch nào.</p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="space-y-0 divide-y divide-purple-50 border-2 border-purple-100 rounded-xl overflow-hidden">
                                {history.map((item, index) => {
                                    const style = getTransactionStyle(item.type);
                                    return (
                                        <motion.div 
                                            key={item.id} 
                                            className="p-4 flex items-center justify-between bg-white hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 transition-all"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <motion.div 
                                                    className={`w-12 h-12 ${style.bg} ${style.color} rounded-xl flex items-center justify-center font-bold text-lg shadow-md`}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    {style.sign === '->' ? <ArrowLeftRight className="w-5 h-5"/> : <span className="text-xl">{style.sign}</span>}
                                                </motion.div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{item.employeeName}</div>
                                                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${style.bg} ${style.color} border-current opacity-80`}>
                                                            {style.label}
                                                        </span>
                                                        <span>{new Date(item.createdAt).toLocaleString('vi-VN')}</span>
                                                        <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                                                        <span className="text-gray-400 italic truncate max-w-50 sm:max-w-md">{item.description}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-bold ${style.color} text-xl whitespace-nowrap`}>
                                                {['earn', 'redeem'].includes(item.type) 
                                                    ? `${style.sign}${Math.abs(item.value)}` 
                                                    : `${style.sign} ${item.value}`}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            {totalHistoryPages > 1 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">
                                        Hiển thị {startHistoryIdx + 1}-{Math.min(startHistoryIdx + historyItemsPerPage, historyTotalCount)} trên {historyTotalCount}
                                    </span>
                                    <div className="flex gap-2 items-center">
                                        <motion.button 
                                            disabled={historyPage === 1} 
                                            onClick={() => setHistoryPage(p => p - 1)} 
                                            className="px-4 py-2 border-2 border-purple-200 rounded-xl disabled:opacity-50 hover:bg-purple-50 disabled:hover:bg-white font-medium transition-all"
                                            whileHover={historyPage !== 1 ? { scale: 1.05 } : {}}
                                            whileTap={historyPage !== 1 ? { scale: 0.95 } : {}}
                                        >
                                            Trước
                                        </motion.button>
                                        <span className="px-3 py-2 text-gray-700 font-semibold bg-purple-50 rounded-xl">
                                            Trang {historyPage} / {totalHistoryPages}
                                        </span>
                                        <motion.button 
                                            disabled={historyPage === totalHistoryPages} 
                                            onClick={() => setHistoryPage(p => p + 1)} 
                                            className="px-4 py-2 border-2 border-purple-200 rounded-xl disabled:opacity-50 hover:bg-purple-50 disabled:hover:bg-white font-medium transition-all"
                                            whileHover={historyPage !== totalHistoryPages ? { scale: 1.05 } : {}}
                                            whileTap={historyPage !== totalHistoryPages ? { scale: 0.95 } : {}}
                                        >
                                            Sau
                                        </motion.button>
                                    </div>
                                </div>
                            )}
                        </>
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
