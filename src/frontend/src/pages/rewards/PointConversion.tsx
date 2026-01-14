import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Save, X, ArrowLeftRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllConversionRules } from '../../store/conversionRuleSlice';
import { pointService } from '../../services/pointService';
import CreateExchangePointRule from '../../components/rewards/CreateExchangePointRule';

export default function PointConversion() {
    const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
    const [editRuleData, setEditRuleData] = useState<{point: number, money: number, active: boolean}>({ 
        point: 0, 
        money: 0, 
        active: true 
    });
    const [isAddingRule, setIsAddingRule] = useState(false);
    const [showToast, setShowToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({ 
        show: false, 
        message: '', 
        type: 'success' 
    });

    const dispatch = useAppDispatch();
    const { rules } = useAppSelector((state) => state.conversionRule);

    useEffect(() => {
        dispatch(fetchAllConversionRules());
    }, [dispatch]);

    const handleUpdateConversionRule = async () => {
        if (!editingRuleId) return;
        try {
            await pointService.updateConversionRule(editingRuleId, {
                pointValue: editRuleData.point,
                moneyValue: editRuleData.money,
                isActive: editRuleData.active
            });
            dispatch(fetchAllConversionRules());
            setEditingRuleId(null);
            showNotification("Cập nhật thành công", 'success');
        } catch (error: any) {
            showNotification(error.message, 'error');
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
                                <ArrowLeftRight className="w-7 h-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold">Bảng quy đổi điểm</h1>
                                <p className="text-white/90 text-lg font-light">Quản lý tỷ giá quy đổi điểm sang tiền mặt</p>
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
                    <div className="flex justify-between mb-4">
                        <h2 className="font-bold text-lg text-gray-800">Quy tắc đổi điểm</h2>
                        <motion.button 
                            onClick={() => setIsAddingRule(true)} 
                            className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:from-blue-600 hover:to-purple-700 font-bold shadow-lg"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4"/> Thêm
                        </motion.button>
                    </div>
                    <div className="space-y-3">
                        {rules.map((rule, index) => {
                            const isEditing = editingRuleId === rule.id;
                            return (
                                <motion.div 
                                    key={rule.id} 
                                    className="border-2 border-purple-100 rounded-xl p-4 flex justify-between items-center hover:bg-purple-50 shadow-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-linear-to-br from-orange-400 to-amber-500 p-3 rounded-xl text-white shadow-lg">
                                            <ArrowLeftRight className="w-6 h-6"/>
                                        </div>
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center">
                                                <input 
                                                    type="number" 
                                                    value={editRuleData.point} 
                                                    onChange={e => setEditRuleData({...editRuleData, point: +e.target.value})} 
                                                    className="border-2 border-purple-200 rounded-lg px-3 py-1 w-20 focus:ring-2 focus:ring-purple-500" 
                                                />
                                                <span className="font-bold">=</span>
                                                <input 
                                                    type="number" 
                                                    value={editRuleData.money} 
                                                    onChange={e => setEditRuleData({...editRuleData, money: +e.target.value})} 
                                                    className="border-2 border-purple-200 rounded-lg px-3 py-1 w-28 focus:ring-2 focus:ring-purple-500" 
                                                />
                                                <select 
                                                    value={String(editRuleData.active)} 
                                                    onChange={e => setEditRuleData({...editRuleData, active: e.target.value === 'true'})} 
                                                    className="border-2 border-purple-200 rounded-lg p-1 focus:ring-2 focus:ring-purple-500"
                                                >
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-bold text-lg text-gray-900">
                                                    {rule.pointValue} điểm = {rule.moneyValue.toLocaleString()} VNĐ
                                                </div>
                                                <div className={`text-xs font-semibold ${rule.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                    {rule.isActive ? '✅ Đang hoạt động' : '🚫 Đã khóa'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {isEditing ? (
                                            <>
                                                <motion.button 
                                                    onClick={handleUpdateConversionRule} 
                                                    className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Save className="w-4 h-4"/>
                                                </motion.button>
                                                <motion.button 
                                                    onClick={() => setEditingRuleId(null)} 
                                                    className="p-2 bg-gray-200 rounded-lg shadow-lg"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <X className="w-4 h-4"/>
                                                </motion.button>
                                            </>
                                        ) : (
                                            <motion.button 
                                                onClick={() => { 
                                                    setEditingRuleId(rule.id); 
                                                    setEditRuleData({ 
                                                        point: rule.pointValue, 
                                                        money: rule.moneyValue, 
                                                        active: rule.isActive 
                                                    }) 
                                                }} 
                                                className="p-2 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-400"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Edit2 className="w-4 h-4 text-gray-600"/>
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {isAddingRule && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-125">
                        <CreateExchangePointRule onClose={() => setIsAddingRule(false)} />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
