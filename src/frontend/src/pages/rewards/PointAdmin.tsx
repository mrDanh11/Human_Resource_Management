import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Save, X, Award, Calendar, Clock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllEmployeePoints } from '../../store/pointSlice';
import { pointService } from '../../services/pointService';
import type { MonthlyPointRuleDto, PointToMoneyHistoryDto } from '../../services/pointService';

interface RoleUI extends MonthlyPointRuleDto {
    color: string;
    description: string;
    employeeCount: number;
}

export default function PointsAdmin() {
    const [roles, setRoles] = useState<RoleUI[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [editingRole, setEditingRole] = useState<number | null>(null);
    const [editPointsValue, setEditPointsValue] = useState<number>(0);
    const [pendingRequests, setPendingRequests] = useState<PointToMoneyHistoryDto[]>([]);
    const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ 
        show: false, 
        message: '', 
        type: 'success' 
    });

    const dispatch = useAppDispatch();
    const { employees, totalCount } = useAppSelector((state) => state.point);

    useEffect(() => {
        dispatch(fetchAllEmployeePoints({ pageNumber: 1, pageSize: 1000 }));
        fetchRoles();
        fetchPendingRequests();
    }, [dispatch]);

    const fetchRoles = async () => {
        try {
            setLoadingRoles(true);
            const rulesData = await pointService.getMonthlyPointRules();
            const mappedRoles = rulesData.map(r => ({
                ...r,
                color: getRoleColor(r.roleName),
                description: getRoleDescription(r.roleName),
                employeeCount: 0 
            }));
            setRoles(mappedRoles);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingRoles(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await pointService.getPointToMoneyHistory(1, 100, undefined, 'pending');
            setPendingRequests(response.items);
        } catch (error) {
            console.error("Lỗi lấy danh sách yêu cầu:", error);
        }
    };

    useEffect(() => {
        if (employees.length > 0 && roles.length > 0) {
            setRoles(prev => prev.map(r => {
                let count = 0;
                if (r.roleName.toLowerCase().includes('employee') || r.roleName.toLowerCase() === 'user') {
                    count = totalCount > 0 ? totalCount : 0;
                }
                return { ...r, employeeCount: count };
            }));
        }
    }, [employees.length, roles.length, totalCount]);

    const totalMonthlyBudget = roles.reduce((sum, role) => sum + (role.pointValue * (role.employeeCount || 0)), 0);

    const handleUpdateRolePoints = async (roleId: number, roleDbId: number) => {
        try {
            await pointService.upsertMonthlyPointRule({ roleId: roleDbId, pointValue: editPointsValue });
            setRoles(roles.map(r => r.id === roleId ? { ...r, pointValue: editPointsValue } : r));
            setEditingRole(null);
            showNotification("Cập nhật thành công", 'success');
        } catch (error) {
            showNotification("Lỗi cập nhật", 'error');
        }
    };

    const handleDistributePoints = async () => {
        try {
            await pointService.allocateMonthlyPoints();
            showNotification(`Đã phân phối thành công`, 'success');
        } catch (error: any) {
            showNotification(error.message, 'error');
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setShowToast({ show: true, message, type });
        setTimeout(() => setShowToast(prev => ({ ...prev, show: false })), 3000);
    };

    const getRoleColor = (name: string) => { 
        const n = name?.toLowerCase() || '';
        if (n.includes('admin')) return 'blue';
        if (n.includes('manager')) return 'green';
        if (n.includes('hr')) return 'yellow';
        return 'purple';
    };

    const getRoleDescription = (name: string) => { 
        const n = name?.toLowerCase() || '';
        if (n.includes('admin')) return 'Quản trị hệ thống';
        if (n.includes('manager')) return 'Quản lý bộ phận';
        if (n.includes('hr')) return 'Nhân sự & Hành chính';
        return 'Nhân viên chính thức';
    };

    const getColorClasses = (color: string) => {
        const map: any = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
            green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
            yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
        };
        return map[color] || map.purple;
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
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                                    <motion.div
                                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Award className="w-7 h-7" />
                                    </motion.div>
                                    Quản lý điểm thưởng
                                </h1>
                                <p className="text-white/90 text-lg font-light ml-16">Hệ thống quản lý và phân phối điểm thưởng</p>
                            </div>
                            <motion.button 
                                onClick={handleDistributePoints} 
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Calendar className="w-5 h-5" /> Phân phối ngay
                            </motion.button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <motion.div 
                            className="bg-white rounded-xl p-5 shadow-lg border-2 border-blue-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <div className="text-xs text-blue-600 uppercase font-bold mb-2">Ngân sách/tháng</div>
                            <div className="text-3xl font-bold text-gray-900">{totalMonthlyBudget.toLocaleString()}</div>
                            <div className="text-sm text-gray-500 mt-1">điểm/tháng</div>
                        </motion.div>
                        <motion.div 
                            className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <div className="text-xs text-green-600 uppercase font-bold mb-2">Tổng nhân viên</div>
                            <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
                            <div className="text-sm text-gray-500 mt-1">người</div>
                        </motion.div>
                        <motion.div 
                            className="bg-white rounded-xl p-5 shadow-lg border-2 border-purple-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <div className="text-xs text-purple-600 uppercase font-bold mb-2">Trung bình/người</div>
                            <div className="text-3xl font-bold text-gray-900">
                                {totalCount > 0 ? Math.round(totalMonthlyBudget / totalCount).toLocaleString() : 0}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">điểm/người</div>
                        </motion.div>
                        <motion.div 
                            className="bg-linear-to-br from-orange-500 to-amber-600 rounded-xl p-5 shadow-lg relative overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <div className="absolute top-0 right-0 p-2 opacity-20">
                                <Clock size={48} color="white"/>
                            </div>
                            <div className="text-xs text-orange-100 uppercase font-bold mb-2 relative z-10">Yêu cầu chờ duyệt</div>
                            <div className="text-3xl font-bold text-white relative z-10">{pendingRequests.length}</div>
                            <div className="text-sm text-orange-100 mt-1 relative z-10">yêu cầu</div>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div 
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-purple-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {loadingRoles ? 
                    <motion.div 
                        className="text-center py-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Loader2 className="animate-spin inline text-blue-600 w-8 h-8"/>
                        <p className="mt-3 text-gray-600">Đang tải...</p>
                    </motion.div> : 
                    <div className="grid md:grid-cols-2 gap-4">
                        {roles.map((role, index) => {
                            const colors = getColorClasses(role.color);
                            const isEditing = editingRole === role.id;
                            return (
                                <motion.div 
                                    key={role.id} 
                                    className={`border-2 ${colors.border} rounded-xl p-5 ${colors.bg} shadow-lg`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${colors.border} ${colors.text} bg-white`}>
                                                {role.roleName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{role.roleName}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Định mức hiện tại: <span className="font-bold">{role.pointValue}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <input 
                                                        type="number" 
                                                        value={editPointsValue} 
                                                        onChange={(e) => setEditPointsValue(Number(e.target.value))} 
                                                        className="w-20 px-3 py-2 border-2 border-purple-200 rounded-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none" 
                                                        autoFocus 
                                                    />
                                                    <motion.button 
                                                        onClick={() => handleUpdateRolePoints(role.id, role.roleId)} 
                                                        className="p-2 bg-green-500 text-white rounded-lg shadow-lg"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button 
                                                        onClick={() => setEditingRole(null)} 
                                                        className="p-2 bg-gray-400 text-white rounded-lg shadow-lg"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </motion.button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={`text-3xl font-bold ${colors.text}`}>{role.pointValue}</div>
                                                    <motion.button 
                                                        onClick={() => { setEditingRole(role.id); setEditPointsValue(role.pointValue); }} 
                                                        className="p-2 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 shadow-sm"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </motion.button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>}
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
