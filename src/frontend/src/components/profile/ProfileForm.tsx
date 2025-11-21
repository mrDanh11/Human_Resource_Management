/**
 * ProfileForm.tsx - Form chỉnh sửa thông tin cá nhân
 * Sử dụng React Hook Form để validate và submit
 * Các field: họ tên, CCCD, mã thuế, địa chỉ, SĐT, tài khoản ngân hàng
 */

// Form với validation rules
// Upload avatar functionality  
// Bank account information fields
// Save/Cancel buttons với loading state

import { DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import type { UpdateEmployeeRequest } from '../../types/employee';
import Modal from '../common/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { fileToBase64 } from '../../utils/imgconverter';

interface FromDataEmployee {
    fullName: string;
    phone: string;
    email: string;
    citizenId: string; // Căn cước công dân
    taxCode: string; // Mã số thuế
    address: string;
    gender: string;
    bankAccount: {
        accountNumber: string;
        bankName: string;
        accountHolder: string;
    };
    avatar: string;
}

interface UpdateEmployeeInformationModalProps {
    employee: UpdateEmployeeRequest | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FromDataEmployee) => Promise<void>;
    isSubmitting: boolean;
}

const UpdateEmployeeInformation = ({ employee, isOpen, onClose, onSubmit, isSubmitting }: UpdateEmployeeInformationModalProps) => {
    if (!employee) return null;

    // Sử dụng React Hook Form
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FromDataEmployee>();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    useEffect(() => {
        if (employee) {
            reset({
                fullName: employee.fullName || '',
                taxCode: employee.taxCode || '',
                citizenId: employee.citizenId || '',
                address: employee.address || '',
                phone: employee.phone || '',
                email: employee.email || '',
                gender: employee.gender || '',
                bankAccount: {
                    accountNumber: employee.bankAccount?.accountNumber || '',
                    bankName: employee.bankAccount?.bankName || '',
                    accountHolder: employee.bankAccount?.accountHolder || '',
                }
            });
            // Khởi tạo avatar preview từ dữ liệu entity nếu có
            setAvatarPreview(employee.avatar || null);
        } else {
            // Đảm bảo form sạch nếu không có nhân viên
            reset();
            setAvatarPreview(null);
        }
    }, [employee, reset]);

    const handleAvatarChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file); // <--- Cập nhật state file

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null); // <--- Đặt lại file
            setAvatarPreview(employee?.avatar || null);
        }
    }

    const handleSubmitForm = async (data: FromDataEmployee) => {
        let finalAvatarString: string | undefined;

        if (selectedFile) {
            // Nếu người dùng chọn file mới, chuyển đổi nó sang Base64
            finalAvatarString = await fileToBase64(selectedFile) as string;
        } else if (employee?.avatar && !selectedFile) {
            // Nếu không có file mới được chọn, nhưng có avatar cũ, giữ lại avatar cũ
            finalAvatarString = employee.avatar;
        } else {
            finalAvatarString = undefined; // Hoặc null nếu API yêu cầu
        }

        // Tạo payload cuối cùng
        const payloadToSend = {
            id: employee.id,
            ...data,
            gender: employee.gender,
            avatar: finalAvatarString,
        };

        // Gọi hàm onSubmit đã được truyền từ component cha
        await onSubmit(payloadToSend as FromDataEmployee);
        onClose();
    };

    const handleClose = () => {
        onClose();
        reset(); // Reset form khi đóng
        setAvatarPreview(employee?.avatar || null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Chỉnh sửa thông tin nhân viên"
            titleIcon={<DocumentTextIcon className="w-7 h-7" />}
            size="lg"
        >
            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">

                <div className="flex items-center gap-6 pb-4 border-b">
                    <div className="shrink-0">
                        <img
                            className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                            src={avatarPreview || 'https://via.placeholder.com/96'}
                            alt="Avatar Preview"
                        />
                    </div>

                    {/* Input Upload Avatar */}
                    <Controller
                        name="avatar" // Tên này sẽ không được RHF sử dụng trực tiếp, nhưng cần thiết cho Controller
                        control={control}
                        defaultValue={employee.avatar || ''} // Giữ lại avatar cũ
                        render={({ field: { onChange, ...field } }) => (
                            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                <CloudArrowUpIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Tải ảnh mới
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    {...field}
                                    value={undefined} // Để RHF không kiểm soát giá trị file, chỉ kiểm soát change
                                    onChange={(e) => {
                                        // Chúng ta không cần gọi onChange của RHF vì chúng ta tự quản lý file
                                        handleAvatarChange(e.target.files);
                                    }}
                                />
                            </label>
                        )}
                    />
                </div>

                <p className="text-gray-500">Những thông tin không thể chỉnh sửa</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Phòng ban
                        </label>
                        <input
                            type="text"
                            value={employee.department}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Trạng thái
                        </label>
                        <input
                            type="text"
                            value={employee.status}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Vai trò
                        </label>
                        <input
                            type="text"
                            value={employee.role}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Điểm thưởng hiện có
                        </label>
                        <input
                            type="text"
                            value={employee.currentPoints}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            Tổng điểm thưởng
                        </label>
                        <input
                            type="text"
                            value={employee.totalPoints}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                        />
                    </div>
                </div>
                <p className="text-gray-500">Những thông tin có thể chỉnh sửa</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Họ tên */}
                    <Controller
                        name="fullName"
                        defaultValue={employee.fullName}
                        control={control}
                        rules={{ required: 'Họ tên là bắt buộc.' }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Họ và Tên (*)</label>
                                <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                            </div>
                        )}
                    />

                    {/* SĐT */}
                    <Controller
                        name="phone"
                        defaultValue={employee.phone}
                        control={control}
                        rules={{ required: 'SĐT là bắt buộc.', pattern: { value: /^\d{10,11}$/, message: 'SĐT không hợp lệ.' } }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Số Điện Thoại (*)</label>
                                <input {...field} type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>
                        )}
                    />

                    <Controller
                        name="email"
                        defaultValue={employee.email}
                        control={control}
                        rules={{ required: 'Email là bắt buộc.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email không hợp lệ.' } }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Email (*)</label>
                                <input {...field} type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                        )}
                    />

                    <Controller
                        name="gender"
                        defaultValue={getGenderText(employee.gender!)}
                        control={control}
                        rules={{ required: 'Giới tính là bắt buộc.' }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Giới tính (*)</label>
                                <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                            </div>
                        )}
                    />

                    {/* CCCD */}
                    <Controller
                        name="citizenId"
                        defaultValue={employee.citizenId}
                        control={control}
                        rules={{ required: 'CCCD là bắt buộc.', minLength: { value: 9, message: 'CCCD cần tối thiểu 9 ký tự.' } }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Số CCCD (*)</label>
                                <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.citizenId && <p className="text-red-500 text-sm mt-1">{errors.citizenId.message}</p>}
                            </div>
                        )}
                    />

                    {/* Mã Số Thuế */}
                    <Controller
                        name="taxCode"
                        defaultValue={employee.taxCode}
                        control={control}
                        rules={{ required: 'Mã thuế là bắt buộc.' }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Mã Số Thuế (*)</label>
                                <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.taxCode && <p className="text-red-500 text-sm mt-1">{errors.taxCode.message}</p>}
                            </div>
                        )}
                    />
                </div>

                {/* -------------------- ĐỊA CHỈ -------------------- */}
                <Controller
                    name="address"
                    defaultValue={employee.address}
                    control={control}
                    rules={{ required: 'Địa chỉ là bắt buộc.' }}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Địa Chỉ (*)</label>
                            <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tên Ngân hàng */}
                    <Controller
                        name="bankAccount.bankName"
                        defaultValue={employee.bankAccount?.bankName}
                        control={control}
                        rules={{ required: 'Tên ngân hàng là bắt buộc.' }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Tên Ngân Hàng (*)</label>
                                <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.bankAccount?.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankAccount.bankName.message}</p>}
                            </div>
                        )}
                    />

                    {/* Số TK Ngân Hàng */}
                    <Controller
                        name="bankAccount.accountNumber"
                        defaultValue={employee.bankAccount?.accountNumber}
                        control={control}
                        rules={{ required: 'Số tài khoản là bắt buộc.' }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Số Tài Khoản (*)</label>
                                <input {...field} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none" />
                                {errors.bankAccount?.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.bankAccount.accountNumber.message}</p>}
                            </div>
                        )}
                    />
                </div>

                {/* -------------------- HÀNH ĐỘNG -------------------- */}
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
    );
};

export default UpdateEmployeeInformation;

