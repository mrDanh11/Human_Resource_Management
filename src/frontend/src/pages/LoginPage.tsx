/**
 * LoginPage.tsx - Trang đăng nhập cho ứng dụng HRMS
 * Hỗ trợ demo mode với các tài khoản mẫu
 */

import { useState } from 'react';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { APP_CONFIG, LABELS } from '../constants/app';
import { useAuth } from '../hooks/useAuth';
import type { Employee } from '../types/employee';
import Logo from '../components/common/Logo';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface LoginPageProps {
  onLogin: (user: Employee) => void;
  isLoading?: boolean;
}

// ===========================================
// COMPONENT LOGIN PAGE
// ============================================
// COMPONENT LOGIN PAGE
// ===========================================
const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        // Login thành công, useAuth sẽ tự động redirect
        if (result.user && onLogin) {
          const employeeUser: Employee = {
            id: result.user.id.toString(),
            employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
            fullName: result.user.fullName,
            email: result.user.email,
            phone: '0900000000',
            citizenId: '079000000000',
            taxCode: '0000000000000',
            address: 'N/A',
            bankAccount: {
              accountNumber: '0000000000',
              bankName: 'N/A',
              accountHolder: result.user.fullName.toUpperCase()
            },
            department: result.user.department,
            position: result.user.role,
            joinDate: new Date(),
            avatar: result.user.avatar,
            status: 'active',
            role: result.user.role as any,
            currentPoints: 0,
            totalPoints: 0,
            lastLoginAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          onLogin(employeeUser);
        }
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick login buttons for demo
  const handleQuickLogin = async (role: string) => {
    const credentials = {
      'admin': { email: 'admin@company.com', password: 'admin123' },
      'hr': { email: 'hr@company.com', password: 'hr123' },
      'manager': { email: 'manager@company.com', password: 'manager123' },
      'employee': { email: 'employee@company.com', password: 'employee123' }
    }[role];

    if (credentials) {
      setUsername(credentials.email);
      setPassword(credentials.password);
      
      // Tự động submit
      const result = await login(credentials.email, credentials.password);
      if (result.success && result.user && onLogin) {
        const employeeUser: Employee = {
          id: result.user.id.toString(),
          employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
          fullName: result.user.fullName,
          email: result.user.email,
          phone: '0900000000',
          citizenId: '079000000000',
          taxCode: '0000000000000',
          address: 'N/A',
          bankAccount: {
            accountNumber: '0000000000',
            bankName: 'N/A',
            accountHolder: result.user.fullName.toUpperCase()
          },
          department: result.user.department,
          position: result.user.role,
          joinDate: new Date(),
          avatar: result.user.avatar,
          status: 'active',
          role: result.user.role as any,
          currentPoints: 0,
          totalPoints: 0,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        onLogin(employeeUser);
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-8">
            <Logo size="lg" variant="full" className="justify-center" />
            <p className="mt-4 text-gray-600 text-lg">Đăng nhập vào hệ thống</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {LABELS.auth.username}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin, hr, manager, employee"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {LABELS.auth.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="demo123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {LABELS.auth.login}
                </>
              )}
            </button>
          </form>

          {/* Demo Mode Quick Login */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              📍 Demo Mode - Đăng nhập nhanh:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                🔧 Admin
              </button>
              <button
                onClick={() => handleQuickLogin('hr')}
                className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                👥 HR
              </button>
              <button
                onClick={() => handleQuickLogin('manager')}
                className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                📊 Manager
              </button>
              <button
                onClick={() => handleQuickLogin('employee')}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                👤 Employee
              </button>
              <button
                onClick={async () => {
                  const result = await login('sales@company.com', 'sales123');
                  if (result.success && result.user && onLogin) {
                    const employeeUser: Employee = {
                      id: result.user.id.toString(),
                      employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
                      fullName: result.user.fullName,
                      email: result.user.email,
                      phone: '0900000000',
                      citizenId: '079000000000',
                      taxCode: '0000000000000',
                      address: 'N/A',
                      bankAccount: {
                        accountNumber: '0000000000',
                        bankName: 'N/A',
                        accountHolder: result.user.fullName.toUpperCase()
                      },
                      department: result.user.department,
                      position: result.user.role,
                      joinDate: new Date(),
                      avatar: result.user.avatar,
                      status: 'active',
                      role: result.user.role as any,
                      currentPoints: 0,
                      totalPoints: 0,
                      lastLoginAt: new Date(),
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    onLogin(employeeUser);
                  } else {
                    setError(result.message || 'Đăng nhập thất bại');
                  }
                }}
                className="px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                💼 Sales
              </button>
              <button
                onClick={async () => {
                  const result = await login('accounting@company.com', 'acc123');
                  if (result.success && result.user && onLogin) {
                    const employeeUser: Employee = {
                      id: result.user.id.toString(),
                      employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
                      fullName: result.user.fullName,
                      email: result.user.email,
                      phone: '0900000000',
                      citizenId: '079000000000',
                      taxCode: '0000000000000',
                      address: 'N/A',
                      bankAccount: {
                        accountNumber: '0000000000',
                        bankName: 'N/A',
                        accountHolder: result.user.fullName.toUpperCase()
                      },
                      department: result.user.department,
                      position: result.user.role,
                      joinDate: new Date(),
                      avatar: result.user.avatar,
                      status: 'active',
                      role: result.user.role as any,
                      currentPoints: 0,
                      totalPoints: 0,
                      lastLoginAt: new Date(),
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    onLogin(employeeUser);
                  } else {
                    setError(result.message || 'Đăng nhập thất bại');
                  }
                }}
                className="px-3 py-2 text-xs bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                💰 Kế toán
              </button>
              <button
                onClick={async () => {
                  const result = await login('marketing@company.com', 'marketing123');
                  if (result.success && result.user && onLogin) {
                    const employeeUser: Employee = {
                      id: result.user.id.toString(),
                      employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
                      fullName: result.user.fullName,
                      email: result.user.email,
                      phone: '0900000000',
                      citizenId: '079000000000',
                      taxCode: '0000000000000',
                      address: 'N/A',
                      bankAccount: {
                        accountNumber: '0000000000',
                        bankName: 'N/A',
                        accountHolder: result.user.fullName.toUpperCase()
                      },
                      department: result.user.department,
                      position: result.user.role,
                      joinDate: new Date(),
                      avatar: result.user.avatar,
                      status: 'active',
                      role: result.user.role as any,
                      currentPoints: 0,
                      totalPoints: 0,
                      lastLoginAt: new Date(),
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    onLogin(employeeUser);
                  } else {
                    setError(result.message || 'Đăng nhập thất bại');
                  }
                }}
                className="px-3 py-2 text-xs bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
              >
                📢 Marketing
              </button>
              <button
                onClick={async () => {
                  const result = await login('team.leader@company.com', 'leader123');
                  if (result.success && result.user && onLogin) {
                    const employeeUser: Employee = {
                      id: result.user.id.toString(),
                      employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
                      fullName: result.user.fullName,
                      email: result.user.email,
                      phone: '0900000000',
                      citizenId: '079000000000',
                      taxCode: '0000000000000',
                      address: 'N/A',
                      bankAccount: {
                        accountNumber: '0000000000',
                        bankName: 'N/A',
                        accountHolder: result.user.fullName.toUpperCase()
                      },
                      department: result.user.department,
                      position: result.user.role,
                      joinDate: new Date(),
                      avatar: result.user.avatar,
                      status: 'active',
                      role: result.user.role as any,
                      currentPoints: 0,
                      totalPoints: 0,
                      lastLoginAt: new Date(),
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    onLogin(employeeUser);
                  } else {
                    setError(result.message || 'Đăng nhập thất bại');
                  }
                }}
                className="px-3 py-2 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                👑 Leader
              </button>
              <button
                onClick={async () => {
                  const result = await login('intern@company.com', 'intern123');
                  if (result.success && result.user && onLogin) {
                    const employeeUser: Employee = {
                      id: result.user.id.toString(),
                      employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
                      fullName: result.user.fullName,
                      email: result.user.email,
                      phone: '0900000000',
                      citizenId: '079000000000',
                      taxCode: '0000000000000',
                      address: 'N/A',
                      bankAccount: {
                        accountNumber: '0000000000',
                        bankName: 'N/A',
                        accountHolder: result.user.fullName.toUpperCase()
                      },
                      department: result.user.department,
                      position: result.user.role,
                      joinDate: new Date(),
                      avatar: result.user.avatar,
                      status: 'active',
                      role: result.user.role as any,
                      currentPoints: 0,
                      totalPoints: 0,
                      lastLoginAt: new Date(),
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    onLogin(employeeUser);
                  } else {
                    setError(result.message || 'Đăng nhập thất bại');
                  }
                }}
                className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                🎓 Intern
              </button>
              <button
                onClick={async () => {
                  const result = await login('cs@company.com', 'cs123');
                  if (result.success && result.user && onLogin) {
                    const employeeUser: Employee = {
                      id: result.user.id.toString(),
                      employeeCode: `EMP${String(result.user.id).padStart(3, '0')}`,
                      fullName: result.user.fullName,
                      email: result.user.email,
                      phone: '0900000000',
                      citizenId: '079000000000',
                      taxCode: '0000000000000',
                      address: 'N/A',
                      bankAccount: {
                        accountNumber: '0000000000',
                        bankName: 'N/A',
                        accountHolder: result.user.fullName.toUpperCase()
                      },
                      department: result.user.department,
                      position: result.user.role,
                      joinDate: new Date(),
                      avatar: result.user.avatar,
                      status: 'active',
                      role: result.user.role as any,
                      currentPoints: 0,
                      totalPoints: 0,
                      lastLoginAt: new Date(),
                      createdAt: new Date(),
                      updatedAt: new Date()
                    };
                    onLogin(employeeUser);
                  } else {
                    setError(result.message || 'Đăng nhập thất bại');
                  }
                }}
                className="px-3 py-2 text-xs bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors"
              >
                📞 CS
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>{APP_CONFIG.course}</p>
          <p className="mt-1">{APP_CONFIG.university}</p>
          <p className="mt-1">© 2025 {APP_CONFIG.group}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;