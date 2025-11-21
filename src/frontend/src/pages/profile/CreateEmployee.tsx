import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { employee } from "../../services/employeeService";

const CreateEmployee = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        birthday: "",
        phone: "",
        citizenId: "",
        taxCode: "",
        address: "",
        email: "",
        joinDate: "",
        gender: "",
        departmentId: "",
        bankAccount: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Build payload đúng với API
    const buildPayload = () => {
        return {
            fullname: formData.fullName,
            birthday: formData.birthday,
            phone: formData.phone,
            cccd: formData.citizenId,
            taxCode: formData.taxCode,
            address: formData.address,
            email: formData.email,
            joinDate: formData.joinDate,
            gender: formData.gender,
            departmentId: Number(formData.departmentId),
            bankAccount: formData.bankAccount,
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = buildPayload();
        console.log("Payload gửi API:", payload);

        try {
            await employee.createEmployee(payload);
            alert("Tạo nhân viên thành công!");
            navigate("/employee/list");
        } catch (error) {
            console.error("Lỗi tạo nhân viên:", error);
            alert("Không thể tạo nhân viên");
        }
    };

    const handleReset = () => {
        setFormData({
            fullName: "",
            birthday: "",
            phone: "",
            citizenId: "",
            taxCode: "",
            address: "",
            email: "",
            joinDate: "",
            gender: "",
            departmentId: "",
            bankAccount: "",
        });
    };

    return (
        <div className="min-h-screen p-6">
            <div className="min-w-6xl mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* HEADER */}
                    <div className="p-6 bg-linear-to-r from-blue-600 to-blue-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <UserPlusIcon className="w-8 h-8 text-white" />
                                <div className="text-2xl font-bold text-white">
                                    Thêm Hồ sơ Nhân viên Mới
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/employee/list")}
                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2"
                            >
                                <span>←</span>
                                <span>Quay lại</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* -------- THÔNG TIN CÁ NHÂN -------- */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-blue-500">
                                👤
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Thông tin cá nhân
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Họ tên */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Birthday */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày sinh *
                                    </label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* CCCD */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CCCD *
                                    </label>
                                    <input
                                        type="text"
                                        name="citizenId"
                                        value={formData.citizenId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Tax Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã số thuế
                                    </label>
                                    <input
                                        type="text"
                                        name="taxCode"
                                        value={formData.taxCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giới tính *
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        {/* -------- THÔNG TIN CÔNG VIỆC -------- */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-blue-500">
                                💼
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Thông tin công việc
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email công ty *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Join Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày vào làm *
                                    </label>
                                    <input
                                        type="date"
                                        name="joinDate"
                                        value={formData.joinDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phòng ban *
                                    </label>
                                    <select
                                        name="departmentId"
                                        value={formData.departmentId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        <option value="">Chọn phòng ban</option>
                                        <option value="1">Công nghệ</option>
                                        <option value="2">Nhân sự</option>
                                        <option value="3">Kinh doanh</option>
                                        <option value="4">Marketing</option>
                                        <option value="5">Kế toán</option>
                                    </select>
                                </div>

                                {/* Bank Account */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số tài khoản *
                                    </label>
                                    <input
                                        name="bankAccount"
                                        value={formData.bankAccount}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* -------- BUTTONS -------- */}
                        <div className="flex justify-end space-x-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Đặt lại
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
