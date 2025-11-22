// src/pages/TestStatusForm.tsx

import { useState } from 'react';
import UpdateEmployeeWorkingInformation from '../../components/profile/StatusForm'
import type { UpdateEmployeeRequest } from '../../types/employee';

// --- 1. Dữ liệu giả định (Đã sửa lỗi thiếu trường) ---
const MockEmployee: UpdateEmployeeRequest = {
    id: '1',
    fullName: 'Test User Ả',
    email: 'test@example.com',
    phone: '0901234567',
    citizenId: '012345678910',
    taxCode: '1234567890',
    address: '123 Đường Test, Khu Phố Mới',
    gender: 'male', // Hoặc 'Nam' nếu Employee type dùng tiếng Việt
    joinDate: new Date('2020-01-01'),
    employeeCode: 'NV001',
    department: 'Phát triển',
    position: 'Kỹ sư phần mềm',
    status: 'active',
    role: 'employee',
    currentPoints: 10,
    totalPoints: 50,
    avatar: 'https://via.placeholder.com/96',
    bankAccount: {
        accountNumber: '998877665544',
        bankName: 'Ngân hàng Test',
        accountHolder: 'TEST USER A'
    },
};

const TestStatusForm = () => {
    // --- 2. Quản lý trạng thái Modal ---
    const [isOpen, setIsOpen] = useState(true); // Mở Modal mặc định để dễ xem
    const [isSaving, setIsSaving] = useState(false);

    const handleClose = () => setIsOpen(false);

    // --- 3. Hàm giả định onSubmit ---
    const handleSubmit = async (data: any) => {
        setIsSaving(true);
        console.log("Dữ liệu gửi đi:", data);

        // Giả lập thời gian gọi API
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Giả lập submit thành công!");
        setIsSaving(false);
        setIsOpen(false); // Đóng modal sau khi submit
    };

    return (
        <div className="p-10 min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Trang Test Giao Diện Form</h1>
            <p className="mb-6">Component `UpdateEmployeeInformationWorking` đang được render.</p>

            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Mở Form Chỉnh Sửa
            </button>

            {/* --- 4. Render Component --- */}
            <UpdateEmployeeWorkingInformation
                employee={MockEmployee as UpdateEmployeeRequest}
                isOpen={isOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                isSubmitting={isSaving}
            />
        </div>
    );
};

export default TestStatusForm;