import { UserRoundPen, User, Code, Hash, Building2, MapPin, Wallet, UserCircle, IdCard, Calendar, Mail, Phone, Activity } from 'lucide-react';
import Modal from '../common/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import ConfirmStatusEmployee from './ConfirmStatusEmployee';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployeeDetail, clearSelectedEmployee } from '../../store/employeeSlice';

interface WorkingInformationProps {
    employeeId: number;
    fullname: string;
    phone: string;
    email: string;
    address: string;
    birthday: string;
    gender: string;
    bankAccount: string;
    departmentId: number;
    status: string;
}

interface UpdateEmployeeWorkingInformationModalProps {
    employeeId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: WorkingInformationProps) => Promise<void>;
    isSubmitting: boolean;
}

const departments = [
    { id: 1, name: "Phòng Kỹ thuật (1)" },
    { id: 2, name: "Phòng Nhân sự (2)" },
    { id: 3, name: "Phòng Kinh doanh (3)" },
    { id: 4, name: "Phòng Marketing (4)" },
    { id: 5, name: "Phòng Kế toán (5)" },
];


const UpdateEmployeeWorkingInformation = ({ employeeId, isOpen, onClose, onSubmit, isSubmitting }: UpdateEmployeeWorkingInformationModalProps) => {
    const dispatch = useAppDispatch();
    const { selectedEmployee: employeeData, detailLoading: loading, detailError: error } = useAppSelector(
        (state) => state.employee
    );

    const [isDeactivationConfirmOpen, setIsDeactivationConfirmOpen] = useState(false);
    const [formDataToSubmit, setFormDataToSubmit] = useState<WorkingInformationProps | null>(null);

    // Sử dụng React Hook Form
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<WorkingInformationProps>({
        mode: "onChange"
    });


    // Fetch employee detail khi modal mở
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


    // Reset form khi employeeData thay đổi
    useEffect(() => {
        if (employeeData && isOpen) {
            reset({
                fullname: employeeData.fullname || '',
                phone: employeeData.phone || '',
                email: employeeData.email || '',
                address: employeeData.address || '',
                birthday: employeeData.birthday || '',
                gender: employeeData.gender || '',
                bankAccount: employeeData.bankAccount || '',
                employeeId: employeeData.id,
                departmentId: employeeData.departmentId || 0,
                status: employeeData.status || 'active',
            });
        }
    }, [employeeData, isOpen, reset]);

    // Early return sau khi tất cả hooks đã được gọi
    if (!employeeId) return null;
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleSubmitForm = async (data: Omit<WorkingInformationProps, 'employeeId'>) => {
        if (!employeeId) return;

        const payload: WorkingInformationProps = {
            ...data,
            employeeId: employeeId,
        };

        console.log('Form data to submit:', payload);

        if (data.status === 'suspended' && employeeData?.status !== 'suspended') {
            setFormDataToSubmit(payload);
            setIsDeactivationConfirmOpen(true);
        } else {
            await onSubmit(payload);
            onClose();
        }
    };

    const handleConfirmDeactivation = async () => {
        if (!formDataToSubmit || !employeeId) return;

        const finalPayload: WorkingInformationProps = {
            ...formDataToSubmit,
            employeeId: employeeId,
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
        setValue('status', employeeData?.status || 'suspended');
        setValue('departmentId', employeeData?.departmentId || 0);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Chỉnh sửa thông tin làm việc của nhân viên"
                titleIcon={<UserRoundPen className="w-7 h-7" />}
                size="xl"
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
                    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">

                        <p className="text-gray-500">Thông tin cá nhân( chỉ đọc)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <User className="w-4 h-4" />
                                    Họ và Tên
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.fullname}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Code className="w-4 h-4" />
                                    Mã nhân viên
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.id}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.email}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.phone}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.address}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Ngày sinh
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.birthday ? formatDate(employeeData.birthday) : 'Chưa cập nhật'}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <UserCircle className="w-4 h-4" />
                                    Giới tính
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.gender}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                <Wallet className="w-4 h-4" />
                                Tài khoản ngân hàng
                            </label>
                            <input
                                type="text"
                                value={employeeData?.bankAccount || 'Chưa cập nhật'}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>

                            {/* Phòng ban */}
                        <Controller
                            name="departmentId"
                            defaultValue={employeeData?.departmentId || 0}
                            control={control}
                            rules={{
                                required: 'Nhân viên phải có bộ phận',
                                validate: (value) => value > 0 || 'Vui lòng chọn bộ phận hợp lệ'
                            }}
                            render={({ field }) => (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                        <Building2 className="w-4 h-4" />
                                        Bộ phận (*)
                                        {employeeData?.departmentName && (
                                            <span className="text-gray-500 text-xs ml-2">
                                                    {employeeData.departmentName}
                                            </span>
                                        )}
                                    </label>

                                    <select
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Chọn bộ phận --</option>

                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                            ))}
                                    </select>

                                    {errors.departmentId && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.departmentId.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                            {/* Trạng thái */}
                        <Controller
                            name="status"
                            defaultValue={employeeData?.status}
                            control={control}
                            rules={{ required: 'Nhân viên phải có trạng thái làm việc', pattern: { value: /^(active|inactive|suspended)$/, message: 'Trạng thái không hợp lệ' } }}
                            render={({ field }) => (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                        <Activity className="w-4 h-4" />
                                            Trạng thái (*)
                                    </label>
                                    <select {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none">
                                        <option value="active">Đang làm việc</option>
                                        <option value="inactive">Tạm nghỉ</option>
                                        <option value="suspended">Đã thôi việc (Vô hiệu hóa)</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                                </div>
                            )}
                        />
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
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
            ) : null}
        </Modal>
            {/* Modal Xác nhận Vô hiệu hóa (Deactivation Confirmation Modal) */}
            {employeeId && (
                <ConfirmStatusEmployee
                    employeeName={employeeData?.fullname!}
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

