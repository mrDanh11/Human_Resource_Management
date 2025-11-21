/**
 * StatusFrom.tsx - Form chỉnh sửa trạng thái cua nhân viên( dành cho role quản lý)
 */

// Save/Cancel buttons với loading state

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import type { UpdateEmployeeRequest } from '../../types/employee';
import Modal from '../common/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import ConfirmStatusEmployee from './ConfirmStatusEmployee';

interface FromDataWorkingEmployee {
    department: string,
    position: string,
    status: 'active' | 'inactive' | 'terminated';
}

interface UpdateEmployeeWorkingInformationModalProps {
    employee: UpdateEmployeeRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FromDataWorkingEmployee) => Promise<void>;
    isSubmitting: boolean;
}

const UpdateEmployeeWorkingInformation = ({ employee, isOpen, onClose, onSubmit, isSubmitting }: UpdateEmployeeWorkingInformationModalProps) => {
    if (!employee) return null;

    const [isDeactivationConfirmOpen, setIsDeactivationConfirmOpen] = useState(false);
    const [formDataToSubmit, setFormDataToSubmit] = useState<FromDataWorkingEmployee | null>(null);

    // Sử dụng React Hook Form
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FromDataWorkingEmployee>({
        // Thêm mode để validate khi thay đổi
        mode: "onChange"
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    useEffect(() => {
        if (employee) {
            reset({
                department: employee.department || '',
                position: employee.position || '',
                status: employee.status || '',
            });
        } else {
            reset();
        }
    }, [employee, reset]);

    const handleSubmitForm = async (data: FromDataWorkingEmployee) => {
        if (data.status === 'terminated' && employee?.status !== 'terminated') {
            setFormDataToSubmit(data);
            setIsDeactivationConfirmOpen(true);
        } else {
            await onSubmit(data);
            onClose();
        }
    };

    const handleConfirmDeactivation = async () => {
        if (!formDataToSubmit) return;

        // Bổ sung terminationDate vào payload chính
        const finalPayload: FromDataWorkingEmployee = {
            ...formDataToSubmit,
        };

        // Gọi hàm submit API
        await onSubmit(finalPayload);

        // Đóng cả hai modal và reset state
        setIsDeactivationConfirmOpen(false);
        setFormDataToSubmit(null);
        onClose();
    };

    const handleClose = () => {
        onClose();
        reset(); // Reset form khi đóng
    };

    const handleCancelDeactivation = () => {
        setIsDeactivationConfirmOpen(false);
        setFormDataToSubmit(null);
        // Quan trọng: Set lại trường status về giá trị cũ (hoặc giá trị hợp lệ khác)
        setValue('status', employee.status || 'active');
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Chỉnh sửa thông tin làm việc của nhân viên"
                titleIcon={<DocumentTextIcon className="w-7 h-7" />}
                size="lg"
            >
                <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">

                    <p className="text-gray-500">Cập nhật phòng ban, chức vụ và trạng hái làm việc của nhân viên</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Ho và tên
                            </label>
                            <input
                                type="text"
                                value={employee.fullName}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Mã nhân viên
                            </label>
                            <input
                                type="text"
                                value={employee.employeeCode}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>
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
                                Ngày vào làm
                            </label>
                            <input
                                type="text"
                                value={formatDate(employee.joinDate!.toISOString())}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>
                    </div>
                    <p className="text-gray-500">Thông tin làm việc</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phòng ban */}
                        <Controller
                            name="department"
                            defaultValue={employee.department}
                            control={control}
                            rules={{ required: 'Nhân viên phải có bộ phận' }}
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Bộ phận (*)</label>
                                    <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                                </div>
                            )}
                        />

                        {/* Chức vụ */}
                        <Controller
                            name="position"
                            defaultValue={employee.position}
                            control={control}
                            rules={{ required: 'Nhân viên phải có chức vụ' }}
                            render={({ field }) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Chức vụ (*)</label>
                                    <input {...field} type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                    {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                                </div>
                            )}
                        />
                    </div>
                    {/* Trạng thái */}
                    <Controller
                        name="status"
                        defaultValue={employee.status}
                        control={control}
                        rules={{ required: 'Nhân viên phải có trạng hái làm việc', pattern: { value: /^(active|inactive|terminated)$/, message: 'Trạng thái không hợp lệ' } }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Trạng thái (*)</label>
                                <select {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none">
                                    <option value="active">Đang làm việc</option>
                                    <option value="inactive">Tạm nghỉ</option>
                                    <option value="terminated">Đã thôi việc (Vô hiệu hóa)</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                            </div>
                        )}
                    />
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
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
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Modal Xác nhận Vô hiệu hóa (Deactivation Confirmation Modal) */}
            {employee && (
                <ConfirmStatusEmployee
                    employeeName={employee.fullName!}
                    isOpen={isDeactivationConfirmOpen}
                    onClose={handleCancelDeactivation} // Nếu hủy, quay lại form chính
                    onSubmit={handleConfirmDeactivation}
                    isSubmitting={isSubmitting}
                />
            )}
        </>
    );
};

export default UpdateEmployeeWorkingInformation;

