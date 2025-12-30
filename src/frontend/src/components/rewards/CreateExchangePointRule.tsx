import { useState, useEffect } from 'react';

interface RuleFormProps {
    onClose: () => void;
}

export default function CreateExchangePointRule({ onClose }: RuleFormProps) {

    function handleSubmit() {
        onClose();
    }
    return (
        <div className='p-2 flex flex-col justify-between space-y-3'>
            <p className='text-blue-600 text-xl font-semibold self-center'>Thêm quy tác đổi điểm thưởng</p>
            <>
                <div className='text-sm'>Số điểm: </div>
                <input
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
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
                    className='max-w-full px-3 py-1 border-2 border-blue-300 rounded-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </>
            <>
                <div className='text-sm'>Số tiền(VND): </div>
                <input
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
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
                    className='max-w-full px-3 py-1 border-2 border-blue-300 rounded-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </>
            <div className='flex justify-items-end gap-2 self-end'>
                <button
                    onClick={handleSubmit}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Lưu
                </button>
                <button
                    onClick={handleSubmit}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Hủy
                </button>
            </div>
        </div>
    )
}