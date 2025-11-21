/**
 * App.tsx - Component chính của ứng dụng HRMS
 * Quản lý routing, authentication và state toàn cục
 * Entry point cho toàn bộ ứng dụng
 */

import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RoleSwitcher from './components/common/RoleSwitcher';
import type { Employee } from './types/employee';
import { USER_ROLES, APP_CONFIG } from './constants/app';

// ===========================================
// MOCK DATA CHO DEMO
// ===========================================
const mockCurrentUser: Employee = {
  id: '1',
  employeeCode: 'EMP001',
  fullName: 'Nguyễn Chí Danh',
  email: 'danh.nguyen@company.com',
  phone: '0901234567',
  citizenId: '079123456789',
  taxCode: '0123456789001',
  address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
  bankAccount: {
    accountNumber: '1234567890',
    bankName: 'Vietcombank',
    accountHolder: 'NGUYEN CHI DANH'
  },
  department: 'Công nghệ thông tin',
  position: 'Senior Developer',
  joinDate: new Date('2023-01-15'),
  avatar: undefined,
  status: 'active',
  role: USER_ROLES.EMPLOYEE, // Mặc định là Employee, có thể đổi bằng RoleSwitcher
  currentPoints: 2580,
  totalPoints: 15240,
  lastLoginAt: new Date(),
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date()
};

// ===========================================
// COMPONENT APP CHÍNH
// ===========================================
function App() {
  // State quản lý authentication
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [notificationCount] = useState(5);

  // Effect khởi tạo app
  useEffect(() => {
    // Simulate authentication check
    setTimeout(() => {
      setCurrentUser(mockCurrentUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);

    // Set document title
    document.title = APP_CONFIG.name;
  }, []);

  // Handlers
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPath('/login');
    console.log('User logged out');
  };

  const handleProfileClick = () => {
    setCurrentPath('/profile');
    console.log('Profile clicked');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    console.log('Navigating to:', path);
  };

  // Handler để đổi role (demo mode)
  const handleRoleChange = (newRole: string) => {
    if (currentUser) {
      const updatedUser: Employee = {
        ...currentUser,
        role: newRole as typeof USER_ROLES[keyof typeof USER_ROLES],
        // Cập nhật điểm theo role
        currentPoints: newRole === USER_ROLES.ADMIN ? 10000 : 
                      newRole === USER_ROLES.HR ? 7500 :
                      newRole === USER_ROLES.MANAGER ? 5000 : 2580
      };
      setCurrentUser(updatedUser);
      console.log('Role changed to:', newRole);
    }
  };

  // Render content dựa trên route hiện tại
  const renderContent = () => {
    if (!currentUser) return <div>No user data</div>;

    switch (currentPath) {
      case '/dashboard':
        return (
          <>
            <RoleSwitcher currentUser={currentUser} onRoleChange={handleRoleChange} />
            <Dashboard currentUser={currentUser} onNavigate={handleNavigate} />
          </>
        );
      
      case '/profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hồ sơ cá nhân</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang profile sẽ được phát triển ở đây...</p>
            </div>
          </div>
        );
      
      case '/employees':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý nhân viên</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang quản lý nhân viên sẽ được phát triển ở đây...</p>
            </div>
          </div>
        );
      
      case '/hr':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý nhân sự</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang quản lý nhân sự - Tuyển dụng, đào tạo, báo cáo...</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Tuyển dụng</h3>
                  <p className="text-sm text-blue-600">Quản lý quy trình tuyển dụng</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">Nhân viên</h3>
                  <p className="text-sm text-green-600">Thông tin và hồ sơ nhân viên</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800">Báo cáo</h3>
                  <p className="text-sm text-purple-600">Thống kê và phân tích</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case '/requests':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý yêu cầu</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang quản lý yêu cầu sẽ được phát triển ở đây...</p>
            </div>
          </div>
        );
      
      case '/activities':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hoạt động</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang hoạt động sẽ được phát triển ở đây...</p>
            </div>
          </div>
        );
      
      case '/rewards':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hệ thống khen thưởng</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang khen thưởng sẽ được phát triển ở đây...</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Trang không tìm thấy</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Trang bạn đang tìm không tồn tại.</p>
              <button 
                onClick={() => handleNavigate('/dashboard')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{APP_CONFIG.shortName}</h2>
          <p className="text-gray-500">Đang khởi tạo ứng dụng...</p>
        </div>
      </div>
    );
  }

  // Render login form nếu chưa authenticate
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{APP_CONFIG.shortName}</h1>
            <p className="text-gray-600">{APP_CONFIG.course}</p>
          </div>
          
          <button
            onClick={() => {
              setCurrentUser(mockCurrentUser);
              setIsAuthenticated(true);
            }}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Đăng nhập Demo
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            {APP_CONFIG.group} - {APP_CONFIG.university}
          </p>
        </div>
      </div>
    );
  }

  // Render main app với Layout
  return (
    <Layout
      currentUser={currentUser}
      activePath={currentPath}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      onProfileClick={handleProfileClick}
      notificationCount={notificationCount}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
