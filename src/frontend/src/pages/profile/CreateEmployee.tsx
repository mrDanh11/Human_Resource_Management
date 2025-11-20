import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        phone: '',
        citizenId: '',
        taxCode: '',
        address: '',
        email: '',
        joinDate: '',
        department: '',
        position: '',
        status: '',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        createAccount: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Xử lý submit form khi có API
        console.log('Form data:', formData);
        alert('Chức năng sẽ được kết nối với API sau!');
    };

    const handleReset = () => {
        setFormData({
        fullName: '',
        birthDate: '',
        phone: '',
        citizenId: '',
        taxCode: '',
        address: '',
        email: '',
        joinDate: '',
        department: '',
        position: '',
        status: '',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
        createAccount: false,
        });
    };

    return (
        <div className="min-h-screen p-6">
        <div className="min-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-linear-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <UserPlusIcon className="w-8 h-8 text-white" />
                            <div className="text-2xl font-bold text-white">Thêm Hồ sơ Nhân viên Mới</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/employee/list')}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2"
                            style={{
                            transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span>←</span>
                            <span>Quay lại</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Thông tin cá nhân */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-blue-500">
                            <span className="text-blue-600">👤</span>
                            <h2 className="text-lg font-semibold text-gray-800">Thông tin cá nhân</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ và tên"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0901234567"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Số CCCD <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="citizenId"
                                    value={formData.citizenId}
                                    onChange={handleChange}
                                    placeholder="Nhập số căn cước công dân"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Mã số thuế
                                </label>
                                <input
                                    type="text"
                                    name="taxCode"
                                    value={formData.taxCode}
                                    onChange={handleChange}
                                    placeholder="Nhập mã số thuế (nếu có)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ đầy đủ"
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Thông tin công việc */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-blue-500">
                            <span className="text-blue-600">💼</span>
                            <h2 className="text-lg font-semibold text-gray-800">Thông tin công việc</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Email công ty <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ten@company.com"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Ngày bắt đầu làm việc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="joinDate"
                                    value={formData.joinDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Phòng ban <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none appearance-none bg-white cursor-pointer"
                                    style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="">Chọn phòng ban</option>
                                    <option value="Công nghệ">Công nghệ</option>
                                    <option value="Nhân sự">Nhân sự</option>
                                    <option value="Kinh doanh">Kinh doanh</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Kế toán">Kế toán</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Chức vụ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none appearance-none bg-white cursor-pointer"
                                    style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="">Chọn chức vụ</option>
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Trưởng phòng">Trưởng phòng</option>
                                    <option value="Phó phòng">Phó phòng</option>
                                    <option value="Giám đốc">Giám đốc</option>
                                    <option value="Thực tập sinh">Thực tập sinh</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Trạng thái <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none appearance-none bg-white cursor-pointer"
                                    style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value="active">Đang làm việc</option>
                                    <option value="inactive">Tạm nghỉ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin ngân hàng */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-blue-500">
                            <span className="text-blue-600">🏦</span>
                            <h2 className="text-lg font-semibold text-gray-800">Thông tin ngân hàng</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Tên ngân hàng <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none appearance-none bg-white cursor-pointer"
                                    style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                    }}
                                >
                                    <option value="">Chọn ngân hàng</option>
                                    <option value="Vietcombank">Vietcombank</option>
                                    <option value="VietinBank">VietinBank</option>
                                    <option value="BIDV">BIDV</option>
                                    <option value="Techcombank">Techcombank</option>
                                    <option value="MB Bank">MB Bank</option>
                                    <option value="ACB">ACB</option>
                                    <option value="VPBank">VPBank</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Số tài khoản <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="Nhập số tài khoản"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Tên chủ tài khoản <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="accountHolder"
                                    value={formData.accountHolder}
                                    onChange={handleChange}
                                    placeholder="Nhập tên chủ tài khoản"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cấp tài khoản hệ thống */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-blue-500">
                            <span className="text-blue-600">🔑</span>
                            <h2 className="text-lg font-semibold text-gray-800">Cấp tài khoản hệ thống</h2>
                        </div>

                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="createAccount"
                                    checked={formData.createAccount}
                                    onChange={(e) => setFormData(prev => ({ ...prev, createAccount: e.target.checked }))}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="createAccount" className="flex-1 text-left">
                                    <div className="font-medium text-gray-800 mb-1">Tạo tài khoản đăng nhập cho nhân viên mới</div>
                                    <div className="text-sm text-gray-600">
                                    Nếu chọn, hệ thống sẽ tự động tạo tài khoản và gửi thông tin đăng nhập qua email
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                            style={{
                            transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 20px rgba(107, 114, 128, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Đặt lại
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
                        >
                            ✓ Lưu hồ sơ
                        </button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    );
};

export default CreateEmployee;
