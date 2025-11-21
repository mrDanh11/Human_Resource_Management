/**
 * Header.tsx - Component header chính của ứng dụng HRMS
 * Hiển thị logo, thông tin user, notification, logout button
 * Sử dụng Tailwind CSS với màu xanh dương chủ đạo
 */

import { Bell, LogOut, Menu } from 'lucide-react';
import { APP_CONFIG, LABELS, ASSET_PATHS, THEME_COLORS } from '../../constants/app';
import type { Employee } from '../../types/employee';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface HeaderProps {
  currentUser: Employee;
  notificationCount?: number;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onNotificationClick: () => void;
}

// ===========================================
// COMPONENT HEADER CHÍNH
// ===========================================
const Header: React.FC<HeaderProps> = ({
  currentUser,
  notificationCount = 0,
  onToggleSidebar,
  onLogout,
  onProfileClick,
  onNotificationClick
}) => {
  return (
    <header 
      className="bg-white shadow-lg border-b-2 border-blue-500 sticky top-0 z-50"
      style={{ borderBottomColor: THEME_COLORS.primary[500] }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        
        {/* PHẦN BÊN TRÁI - LOGO VÀ MENU TOGGLE */}
        <div className="flex items-center space-x-4">
          {/* Nút toggle sidebar cho mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-blue-50 transition-colors"
            style={{ 
              color: THEME_COLORS.primary[600],
              backgroundColor: 'transparent'
            }}
          >
            <Menu size={24} />
          </button>

          {/* Logo và tên ứng dụng */}
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: THEME_COLORS.primary[600] }}
            >
              {/* Icon placeholder - thêm logo tại đây */}
              <img 
                src={ASSET_PATHS.logo} 
                alt="HRMS Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback nếu không có logo
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentNode?.querySelector('span');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <span 
                className="hidden w-8 h-8 rounded items-center justify-center text-sm font-bold"
                style={{ backgroundColor: THEME_COLORS.primary[600] }}
              >
                HR
              </span>
            </div>
            
            <div className="hidden sm:block">
              <h1 
                className="text-lg font-semibold"
                style={{ color: THEME_COLORS.primary[700] }}
              >
                {APP_CONFIG.shortName}
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                {APP_CONFIG.course}
              </p>
            </div>
          </div>
        </div>

        {/* PHẦN BÊN PHẢI - USER INFO VÀ ACTIONS */}
        <div className="flex items-center space-x-4">
          
          {/* Nút thông báo */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-md hover:bg-blue-50 transition-colors"
            style={{ color: THEME_COLORS.primary[600] }}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>

          {/* Thông tin user */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              {/* Avatar user */}
              <div className="relative">
                <img
                  src={currentUser.avatar || ASSET_PATHS.defaultAvatar}
                  alt={`Avatar ${currentUser.fullName}`}
                  className="w-8 h-8 rounded-full object-cover border-2"
                  style={{ borderColor: THEME_COLORS.primary[300] }}
                  onError={(e) => {
                    // Fallback nếu không có avatar
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentNode?.querySelector('div');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
                <div 
                  className="hidden w-8 h-8 rounded-full items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: THEME_COLORS.primary[500] }}
                >
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Tên user - ẩn trên mobile */}
              <div className="hidden md:block text-left">
                <p 
                  className="text-sm font-medium"
                  style={{ color: THEME_COLORS.secondary[800] }}
                >
                  {currentUser.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {currentUser.position}
                </p>
              </div>
            </button>
          </div>

          {/* Nút đăng xuất */}
          <button
            onClick={onLogout}
            className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title={LABELS.logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
