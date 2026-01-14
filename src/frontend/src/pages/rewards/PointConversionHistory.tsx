import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import ConversionHistoryTab from '../../components/rewards/ConversionHistoryTab';

export default function PointConversionHistory() {
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
                                <Clock className="w-7 h-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold">Lịch sử đổi điểm</h1>
                                <p className="text-white/90 text-lg font-light">Theo dõi các giao dịch đổi điểm đã được duyệt</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <ConversionHistoryTab />
            </div>
        </motion.div>
    );
}
