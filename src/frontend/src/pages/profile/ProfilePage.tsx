/**
 * ProfilePage.tsx - Trang xem và chỉnh sửa hồ sơ cá nhân
 * Hiển thị thông tin nhân viên với quyền truy cập phù hợp theo role
 * Tuân thủ business rules về bảo mật thông tin nhạy cảm
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Calendar, 
  Building, 
  Phone, 
  MapPin, 
  CreditCard, 
  Hash,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import type { Employee } from '../../types/employee';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface ProfilePageProps {
  currentUser: Employee;
  onNavigate?: (path: string) => void;
}

// ===========================================
// UTILS - BẢO MẬT THÔNG TIN NHẠY CẢM
// ===========================================
const maskSensitiveInfo = (value: string, showLength: number = 4): string => {
  if (!value || value.length <= showLength) return value;
  const visiblePart = value.slice(-showLength);
  const maskedPart = '*'.repeat(Math.max(0, value.length - showLength));
  return maskedPart + visiblePart;
};

// Format ngày tháng
const formatDate = (date: Date | string): string => {
  if (!date) return 'Không có thông tin';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
};

// ===========================================
// COMPONENT PROFILE PAGE CHÍNH
// ===========================================
const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  // State quản lý
  const [employee, setEmployee] = useState<Employee>(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState<Record<string, boolean>>({});
  const [editForm, setEditForm] = useState<Partial<Employee>>({});

  // Load thông tin nhân viên
  useEffect(() => {
    loadEmployeeProfile();
  }, [currentUser.id]);

  const loadEmployeeProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call với delay dưới 3 giây
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Trong thực tế sẽ call API: const response = await employeeService.getProfile(currentUser.id);
      const profileData = currentUser; // Mock data từ currentUser
      
      if (!profileData) {
        throw new Error('Không tìm thấy hồ sơ nhân viên. Vui lòng liên hệ quản trị viên.');
      }
      
      setEmployee(profileData);
      setEditForm(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle hiển thị thông tin nhạy cảm
  const toggleSensitiveInfo = (field: string) => {
    setShowSensitiveInfo(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...employee });
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ ...employee });
    setError(null);
  };

  // Lưu thay đổi
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate dữ liệu
      if (!editForm.fullName?.trim()) {
        throw new Error('Họ tên không được để trống');
      }
      if (!editForm.phone?.trim()) {
        throw new Error('Số điện thoại không được để trống');
      }
      if (!editForm.email?.trim()) {
        throw new Error('Email không được để trống');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trong thực tế: await employeeService.updateProfile(employee.id, editForm);
      const updatedEmployee = { ...employee, ...editForm, updatedAt: new Date() };
      
      setEmployee(updatedEmployee);
      setIsEditing(false);
      
      // Show success message (có thể dùng toast notification)
      console.log('Cập nhật hồ sơ thành công');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thay đổi form
  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Loading state
  if (isLoading && !employee.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !employee.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải hồ sơ</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadEmployeeProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar 
                src={employee.avatar}
                name={employee.fullName}
                size="lg"
                showBorder={false}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{employee.fullName}</h1>
                <p className="text-gray-600">{employee.position} - {employee.department}</p>
                <div className="flex items-center mt-1">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.status === 'active' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đang làm việc
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Ngừng làm việc
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Chỉnh sửa thông tin
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Thông tin cá nhân */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Thông tin cá nhân
            </h2>
            
            <div className="space-y-4">
              
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.fullName || ''}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employee.fullName}</p>
                )}
              </div>

              {/* Mã nhân viên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
                <p className="text-gray-900 py-2 font-mono bg-gray-50 px-3 rounded">{employee.employeeCode}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập email"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employee.email}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employee.phone}</p>
                )}
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <textarea
                    value={editForm.address || ''}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{employee.address}</p>
                )}
              </div>

            </div>
          </div>

          {/* Thông tin nhạy cảm và công việc */}
          <div className="space-y-6">
            
            {/* Thông tin nhạy cảm */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                Thông tin bảo mật
              </h2>
              
              <div className="space-y-4">
                
                {/* CCCD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 py-2 flex-1 font-mono">
                      {showSensitiveInfo.citizenId ? employee.citizenId : maskSensitiveInfo(employee.citizenId)}
                    </p>
                    <button
                      onClick={() => toggleSensitiveInfo('citizenId')}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {showSensitiveInfo.citizenId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Mã số thuế */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Mã số thuế
                  </label>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-900 py-2 flex-1 font-mono">
                      {showSensitiveInfo.taxCode ? employee.taxCode : maskSensitiveInfo(employee.taxCode)}
                    </p>
                    <button
                      onClick={() => toggleSensitiveInfo('taxCode')}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      {showSensitiveInfo.taxCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Tài khoản ngân hàng */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tài khoản ngân hàng</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-gray-900 flex-1 font-mono">
                        {showSensitiveInfo.bankAccount 
                          ? employee.bankAccount?.accountNumber 
                          : maskSensitiveInfo(employee.bankAccount?.accountNumber || '', 4)}
                      </p>
                      <button
                        onClick={() => toggleSensitiveInfo('bankAccount')}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        {showSensitiveInfo.bankAccount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{employee.bankAccount?.bankName}</p>
                    <p className="text-sm text-gray-600">{employee.bankAccount?.accountHolder}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Thông tin công việc */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-green-600" />
                Thông tin công việc
              </h2>
              
              <div className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                  <p className="text-gray-900 py-2">{employee.department}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                  <p className="text-gray-900 py-2">{employee.position}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Ngày vào làm
                  </label>
                  <p className="text-gray-900 py-2">{formatDate(employee.joinDate)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái làm việc</label>
                  <span 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      employee.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.status === 'active' ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đang làm việc
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-1" />
                        Ngừng làm việc
                      </>
                    )}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Cập nhật lần cuối: {formatDate(employee.updatedAt)} | 
            Tham gia từ: {formatDate(employee.createdAt)}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;