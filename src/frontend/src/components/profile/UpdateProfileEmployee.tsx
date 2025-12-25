import { UserRoundPen, User, Code, Hash, Building2, MapPin, Wallet, UserCircle, Calendar, Mail, Phone, Activity, IdCard } from 'lucide-react';
import Modal from '../common/Modal';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployeeDetail, clearSelectedEmployee } from '../../store/employeeSlice';

interface PersonalInfomationProps {
    employeeId: number;
    fullname: string;
    phone: string;
    email: string;
    address: string;
    birthday: string;
    gender: string;
}

interface UpdateEmployeePersonalInformationModalProps {
    employeeId: number | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PersonalInfomationProps) => Promise<void>;
    isSubmitting: boolean;
}


const UpdateEmployeePersonalInformation = ({ employeeId, isOpen, onClose, onSubmit, isSubmitting }: UpdateEmployeePersonalInformationModalProps) => {
    const dispatch = useAppDispatch();
    const { selectedEmployee: employeeData, detailLoading: loading, detailError: error } = useAppSelector(
        (state) => state.employee
    );

    // Sử dụng React Hook Form
    const { control, handleSubmit, reset, formState: { errors } } = useForm<PersonalInfomationProps>({
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
                employeeId: employeeData.id,  
                fullname: employeeData.fullname || '',
                phone: employeeData.phone || '',
                email: employeeData.email || '',
                address: employeeData.address || '',
                birthday: employeeData.birthday || '',
                gender: employeeData.gender || '',
            });
        }
    }, [employeeData, isOpen, reset]);

    const handleSubmitForm = async (data: Omit<PersonalInfomationProps, 'employeeId'>) => {
        if (!employeeId) return;

        const payload: PersonalInfomationProps = {
            ...data,
            employeeId: employeeId,
        };

        await onSubmit(payload);
        onClose();
    };

    const handleClose = () => {
        onClose();
        reset(); // Reset form khi đóng
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Chỉnh sửa thông tin cá nhân của nhân viên"
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

                        <p className="text-gray-500">Thông tin làm việc( chỉ đọc)</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <IdCard className="w-4 h-4" />
                                    Căn cước công dân
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.cccd}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Hash className="w-4 h-4" />
                                    Mã số thuế
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.taxCode}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Wallet className="w-4 h-4" />
                                    Số tài khoản ngân hàng
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.bankAccount}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Ngày vào làm
                                </label>
                                <input
                                    type="date"
                                    value={employeeData?.joinDate ? new Date(employeeData.joinDate).toISOString().split('T')[0] : 'Chưa cập nhật'}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                    <Building2 className="w-4 h-4" />
                                    Bộ phận
                                </label>
                                <input
                                    type="text"
                                    value={employeeData?.departmentName || 'Chưa cập nhật'}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                                />
                            </div>
                        </div>
                       
                            
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                <Activity className="w-4 h-4" />
                                Trạng thái
                            </label>
                            <input
                                type="text"
                                value={employeeData?.status}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none"
                            />
                        </div>

                        <p className="text-gray-500">Thông tin cá nhân</p>
                            {/*Họ tên*/}
                            <Controller
                                name="fullname"
                                defaultValue={employeeData?.fullname || ''}
                                control={control}
                                rules={{
                                    required: 'Nhân viên phải có họ tên',
                                    validate: (value) => value.length >= 0 || 'Vui lòng chọn họ tên hợp lệ'
                                }}
                                render={({ field }) => (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                            <User className="w-4 h-4" />
                                            Họ tên (*)
                                            {employeeData?.fullname && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    {employeeData.fullname}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            {...field}
                                            type="string"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.fullname && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.fullname.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/*Địa chỉ*/}
                            <Controller
                                name="address"
                                defaultValue={employeeData?.address || ''}
                                control={control}
                                rules={{
                                    required: 'Nhân viên phải có địa chỉ',
                                    validate: (value) => value.length >= 0 || 'Vui lòng chọn địa chỉ hợp lệ'
                                }}
                                render={({ field }) => (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            Địa chỉ (*)
                                            {employeeData?.address && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    {employeeData.address}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            {...field}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.address.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/*Số điện thoại*/}
                            <Controller
                                name="phone"
                                defaultValue={employeeData.phone || ''}
                                control={control}
                                rules={{
                                    required: 'Nhân viên phải có số điện thoại',
                                    validate: (value) =>
                                                /^([0-9]{10})$/.test(value)
                                                || 'Vui lòng nhập số điện thoại hợp lệ'
                                }}
                                render={({ field }) => (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                            <Phone className="w-4 h-4" />
                                            Số điện thoại (*)
                                            {employeeData?.phone && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    {employeeData.phone}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            {...field}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Email */}
                            <Controller
                                name="email"
                                defaultValue={employeeData?.email || ''}
                                control={control}
                                rules={{
                                    required: 'Nhân viên phải có email',
                                    validate: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'Email không hợp lệ'
                                }}
                                render={({ field }) => (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                            <Mail className="w-4 h-4" />
                                            Email (*)
                                            {employeeData?.email && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    {employeeData.email}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            {...field}
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Ngày sinh */}
                            <Controller
                                name="birthday"
                                defaultValue={employeeData?.birthday || ''}
                                control={control}
                                rules={{
                                    required: 'Nhân viên phải có ngày sinh',
                                    validate: (value) => value && new Date(value) <= new Date() || 'Vui lòng chọn ngày sinh hợp lệ'
                                }}
                                render={({ field }) => (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            Ngày sinh (*)
                                            {employeeData?.birthday && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                    {new Date(employeeData.birthday).toLocaleDateString()}
                                                </span>
                                            )}
                                        </label>

                                        <input
                                            {...field}
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        {errors.birthday && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.birthday.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Giới tính */}
                            <Controller
                                name="gender"
                                defaultValue={employeeData?.gender || ''}
                                control={control}
                                rules={{ required: 'Nhân viên phải có giới tính', pattern: { value: /^(male|female)$/, message: 'Giới tính không hợp lệ' } }}
                                render={({ field }) => (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                                            <UserCircle className="w-4 h-4" />
                                            Giới tính (*)
                                        </label>
                                        <select {...field} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none">
                                            <option value="male">Nam</option>
                                            <option value="female">Nữ</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
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
        </>
    );
};

export default UpdateEmployeePersonalInformation;

