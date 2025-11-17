import { DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Employee } from '../../types/employee';
import Modal from '../common/Modal';

interface EmployeeDetailModalProps {
    employee: Employee | null;
    isOpen: boolean;
    onClose: () => void;
}

const EmployeeDetailModal = ({ employee, isOpen, onClose }: EmployeeDetailModalProps) => {
    if (!employee) return null;

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
            <div className="space-y-4">
                {/* Họ và Tên */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                        Họ và Tên
                    </label>
                    <input
                        type="text"
                        value={employee.fullName}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                    />
                </div>

                {/* Mã Số Thuế và Chức Vụ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Mã Số Thuế
                        </label>
                        <input
                        type="text"
                        value={employee.taxCode}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Chức Vụ
                        </label>
                        <input
                        type="text"
                        value={employee.position}
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
                        value={employee.address}
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
                        value={employee.bankAccount.accountNumber}
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
                        value={getGenderText(employee.gender)}
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
                        value={formatDate(employee.joinDate)}
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
                        value={formatDate(employee.birthDate)}
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
                        value={employee.email}
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
                        value={employee.phone}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>
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
        </Modal>
    );
};

export default EmployeeDetailModal;
