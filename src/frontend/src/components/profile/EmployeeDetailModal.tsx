import { useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployeeDetail, clearSelectedEmployee } from '../../store/employeeSlice';

interface EmployeeDetailModalProps {
    employeeId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

const EmployeeDetailModal = ({ employeeId, isOpen, onClose }: EmployeeDetailModalProps) => {
    const dispatch = useAppDispatch();
    const { selectedEmployee: employeeData, detailLoading: loading, detailError: error } = useAppSelector(
        (state) => state.employee
    );

    useEffect(() => {
        if (isOpen && employeeId) {
            dispatch(fetchEmployeeDetail(employeeId));
        }
        
        // Cleanup khi đóng modal
        return () => {
            if (!isOpen) {
                dispatch(clearSelectedEmployee());
            }
        };
    }, [isOpen, employeeId, dispatch]);

    if (!employeeId) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
        });
    };

    const getGenderText = (gender: string) => {
        switch (gender) {
        case 'male':
            return 'Nam';
        case 'female':
            return 'Nữ';
        case 'other':
            return 'Khác';
        default:
            return '';
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Thông Tin Nhân Viên" 
            titleIcon={<DocumentTextIcon className="w-7 h-7" />}
            size="lg"
        >
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Đóng
                    </button>
                </div>
            ) : employeeData ? (
                <div className="space-y-4">
                    {/* Họ và Tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Họ và Tên
                        </label>
                        <input
                            type="text"
                            value={employeeData.fullname || ''}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* CCCD và Mã Số Thuế */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Căn cước công dân
                            </label>
                            <input
                                type="text"
                                value={employeeData.cccd || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Mã Số Thuế
                            </label>
                            <input
                                type="text"
                                value={employeeData.taxCode || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Chức Vụ và Phòng Ban */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Chức Vụ
                            </label>
                            <input
                                type="text"
                                value={employeeData.roleName || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Phòng Ban
                            </label>
                            <input
                                type="text"
                                value={employeeData.departmentName || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Địa Chỉ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Địa Chỉ
                        </label>
                        <input
                            type="text"
                            value={employeeData.address || 'Chưa cập nhật'}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* Tài Khoản Ngân Hàng và Giới Tính */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Tài Khoản Ngân Hàng
                            </label>
                            <input
                                type="text"
                                value={employeeData.bankAccount || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Giới Tính
                            </label>
                            <input
                                type="text"
                                value={getGenderText(employeeData.gender)}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Ngày Vào Làm và Ngày Sinh */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Ngày Vào Làm
                            </label>
                            <input
                                type="text"
                                value={employeeData.joinDate ? formatDate(employeeData.joinDate) : 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Ngày Sinh
                            </label>
                            <input
                                type="text"
                                value={employeeData.birthday ? formatDate(employeeData.birthday) : 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Email và Số Điện Thoại */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Email
                            </label>
                            <input
                                type="text"
                                value={employeeData.email || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Số Điện Thoại
                            </label>
                            <input
                                type="text"
                                value={employeeData.phone || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Trạng thái
                        </label>
                        <input
                            type="text"
                            value={employeeData.status || 'Chưa cập nhật'}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* Nút đóng */}
                    <div className="flex justify-end pt-4 mt-6">
                        <div className="border-t mx-4 w-full pt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                style={{
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
};

export default EmployeeDetailModal;
