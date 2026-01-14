import { motion } from 'framer-motion';
import { ArrowLeftRight, Save, X } from 'lucide-react';

interface RuleFormProps {
    onClose: () => void;
}

export default function CreateExchangePointRule({ onClose }: RuleFormProps) {

    function handleSubmit() {
        onClose();
    }
    return (
        <motion.div 
            className='p-6 flex flex-col justify-between space-y-4 bg-white rounded-2xl'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
        >
            <div className='flex items-center gap-3 pb-4 border-b-2 border-purple-100'>
                <div className='w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                    <ArrowLeftRight className='w-6 h-6 text-white' />
                </div>
                <p className='text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Thêm quy tắc đổi điểm thưởng</p>
            </div>
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <label className='text-sm font-semibold text-gray-700 mb-2 block'>Số điểm <span className='text-red-500'>*</span></label>
                <input
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder='Nhập số điểm...'
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '.' || e.key === 'e') {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= 0) {
                            e.target.value = '';
                        }
                    }}
                    className='w-full px-4 py-3 border-2 border-purple-200 rounded-xl font-semibold text-base focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all'
                />
            </motion.div>
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <label className='text-sm font-semibold text-gray-700 mb-2 block'>Số tiền (VNĐ) <span className='text-red-500'>*</span></label>
                <input
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder='Nhập số tiền...'
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '.' || e.key === 'e') {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= 0) {
                            e.target.value = '';
                        }
                    }}
                    className='w-full px-4 py-3 border-2 border-purple-200 rounded-xl font-semibold text-base focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all'
                />
            </motion.div>
            <motion.div 
                className='flex justify-end gap-3 pt-4 border-t-2 border-purple-100'
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 flex items-center gap-2 font-semibold transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <X className='w-4 h-4' />
                    Hủy
                </motion.button>
                <motion.button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center gap-2 font-bold shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Save className='w-4 h-4' />
                    Lưu
                </motion.button>
            </motion.div>
        </motion.div>
    )
}