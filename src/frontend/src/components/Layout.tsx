/**
 * Layout.tsx - Layout chính cho ứng dụng HRMS
 * Bao gồm Header, Sidebar, và Main content area
 * Quản lý responsive design và navigation state
 */

import { useState } from 'react';
import Header from './common/Header';
import Sidebar from './common/Sidebar';
import type { Employee } from '../types/employee';
import { THEME_COLORS } from '../constants/app';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface LayoutProps {
  currentUser: Employee;
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onProfileClick: () => void;
  notificationCount?: number;
}

// ===========================================
// COMPONENT LAYOUT CHÍNH
// ===========================================
const Layout: React.FC<LayoutProps> = ({
  currentUser,
  children,
  activePath,
  onNavigate,
  onLogout,
  onProfileClick,
  notificationCount = 0
}) => {
  // State quản lý sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handlers
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
    // TODO: Implement notification panel
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        currentUser={currentUser}
        notificationCount={notificationCount}
        onToggleSidebar={handleToggleSidebar}
        onLogout={onLogout}
        onProfileClick={onProfileClick}
        onNotificationClick={handleNotificationClick}
      />

      {/* Container cho Sidebar và Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          activePath={activePath}
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <main 
          className="flex-1 min-h-screen transition-all duration-300"
          style={{ 
            backgroundColor: THEME_COLORS.secondary[50],
            marginLeft: window.innerWidth >= 1024 ? '0' : '0' // Responsive margin
          }}
        >
          <div className="lg:ml-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;