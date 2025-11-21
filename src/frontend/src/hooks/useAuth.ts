/**
 * useAuth.ts - Custom hook quản lý authentication
 * Login, logout, check auth status, get user info
 * Store auth state trong localStorage hoặc context
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  department: string;
  avatar?: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Demo mode - enable for quick login
  const DEMO_MODE = true;

  // Kiểm tra authentication state từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    if (DEMO_MODE) {
      // Demo users cho đăng nhập nhanh
      const demoUsers: { [key: string]: User } = {
        'admin@company.com:admin123': {
          id: 1,
          email: 'admin@company.com',
          fullName: 'Nguyễn Quản Trị',
          role: 'admin',
          department: 'Ban giám đốc',
          avatar: '/api/placeholder/100/100'
        },
        'hr@company.com:hr123': {
          id: 2,
          email: 'hr@company.com',
          fullName: 'Trần Nhân Sự',
          role: 'hr',
          department: 'Nhân sự',
          avatar: '/api/placeholder/100/100'
        },
        'manager@company.com:manager123': {
          id: 3,
          email: 'manager@company.com',
          fullName: 'Lê Quản Lý',
          role: 'manager',
          department: 'Công nghệ thông tin',
          avatar: '/api/placeholder/100/100'
        },
        'employee@company.com:employee123': {
          id: 4,
          email: 'employee@company.com',
          fullName: 'Nguyễn Nhân Viên',
          role: 'employee',
          department: 'Công nghệ thông tin',
          avatar: '/api/placeholder/100/100'
        },
        'sales@company.com:sales123': {
          id: 5,
          email: 'sales@company.com',
          fullName: 'Phạm Thu Hương',
          role: 'manager',
          department: 'Kinh doanh',
          avatar: '/api/placeholder/100/100'
        },
        'accounting@company.com:acc123': {
          id: 6,
          email: 'accounting@company.com',
          fullName: 'Vũ Minh Hải',
          role: 'employee',
          department: 'Kế toán',
          avatar: '/api/placeholder/100/100'
        },
        'marketing@company.com:marketing123': {
          id: 7,
          email: 'marketing@company.com',
          fullName: 'Lê Thị Mai',
          role: 'employee',
          department: 'Marketing',
          avatar: '/api/placeholder/100/100'
        },
        'team.leader@company.com:leader123': {
          id: 8,
          email: 'team.leader@company.com',
          fullName: 'Hoàng Văn Nam',
          role: 'manager',
          department: 'Công nghệ thông tin',
          avatar: '/api/placeholder/100/100'
        },
        'intern@company.com:intern123': {
          id: 9,
          email: 'intern@company.com',
          fullName: 'Đỗ Thị Lan',
          role: 'employee',
          department: 'Công nghệ thông tin',
          avatar: '/api/placeholder/100/100'
        },
        'cs@company.com:cs123': {
          id: 10,
          email: 'cs@company.com',
          fullName: 'Nguyễn Thành Đạt',
          role: 'employee',
          department: 'Chăm sóc khách hàng',
          avatar: '/api/placeholder/100/100'
        }
      };

      const key = `${email}:${password}`;
      const userData = demoUsers[key];

      setIsLoading(false);

      if (userData) {
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', `demo-token-${userData.id}`);
        
        // Cập nhật state
        setUser(userData);
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: userData,
          token: `demo-token-${userData.id}`
        };
      } else {
        return {
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        };
      }
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { user: userData, token } = response.data;
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        // Cập nhật state
        setUser(userData);
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: userData,
          token
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Đăng nhập thất bại'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole
  };
};
