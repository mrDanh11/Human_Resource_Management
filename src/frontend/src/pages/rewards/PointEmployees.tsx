import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllEmployeePoints } from '../../store/pointSlice';

export default function PointEmployees() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const dispatch = useAppDispatch();
    const { employees, totalCount, loading: loadingEmployees } = useAppSelector((state) => state.point);

    useEffect(() => {
        dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 100 }));
    }, [dispatch]);

    const filteredEmployees = employees.filter(emp =>
        emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

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
                                <TrendingUp className="w-7 h-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold">Danh sách nhân viên</h1>
                                <p className="text-white/90 text-lg font-light">Quản lý điểm thưởng của từng nhân viên</p>
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
                    <motion.div 
                        className="mb-4 relative max-w-sm"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Search className="absolute left-3 top-2.5 text-purple-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="🔍 Tìm nhân viên..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all" 
                        />
                    </motion.div>
                    <div className="overflow-x-auto rounded-xl border-2 border-purple-100">
                        <table className="w-full">
                            <thead className="bg-linear-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nhân viên</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Điểm</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Cập nhật</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-purple-50 bg-white">
                                {currentEmployees.map((emp, index) => (
                                    <motion.tr 
                                        key={emp.id} 
                                        className="hover:bg-linear-to-r hover:from-purple-50 hover:to-blue-50 transition-all"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                                            <motion.div 
                                                className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center font-bold shadow-lg"
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                            >
                                                {emp.employeeName.charAt(0)}
                                            </motion.div>
                                            <span className="text-gray-900">{emp.employeeName}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-md">{emp.pointTotal}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-500">{new Date(emp.lastUpdate).toLocaleDateString('vi-VN')}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600 font-medium">
                            Hiển thị {startIdx + 1}-{Math.min(startIdx + itemsPerPage, filteredEmployees.length)} trên {filteredEmployees.length}
                        </span>
                        <div className="flex gap-2">
                            <motion.button 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(p => p - 1)} 
                                className="px-4 py-2 border-2 border-purple-200 rounded-xl disabled:opacity-50 hover:bg-purple-50 disabled:hover:bg-white font-medium"
                                whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                                whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                            >
                                Trước
                            </motion.button>
                            <motion.button 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(p => p + 1)} 
                                className="px-4 py-2 border-2 border-purple-200 rounded-xl disabled:opacity-50 hover:bg-purple-50 disabled:hover:bg-white font-medium"
                                whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                                whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                            >
                                Sau
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
