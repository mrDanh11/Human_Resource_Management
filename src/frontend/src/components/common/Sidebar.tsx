/**
 * Sidebar.tsx - Component sidebar navigation cho HRMS
 * Menu điều hướng chính, hiển thị khác nhau theo role user
 * Responsive design với Tailwind CSS và màu xanh dương
 */

import { 
  Home, User, Users, FileText, Activity, Award, 
  Users2, BarChart3, Settings, ChevronLeft, UserCheck
} from 'lucide-react';
import { 
  MENU_ITEMS, ROLE_LABELS, THEME_COLORS, LABELS 
} from '../../constants/app';
import type { Employee } from '../../types/employee';

// ===========================================
// MAPPING ICON COMPONENTS
// ===========================================
const IconMap = {
  Home, User, Users, FileText, Activity, Award, Users2, BarChart3, Settings, UserCheck
} as const;

// ===========================================
// INTERFACE PROPS
// ===========================================
interface SidebarProps {
  currentUser: Employee;
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
  onNavigate: (path: string) => void;
}

// ===========================================
// COMPONENT SIDEBAR CHÍNH
// ===========================================
const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  isOpen,
  onClose,
  activePath,
  onNavigate
}) => {
  // Lọc menu items theo role của user hiện tại
  const filteredMenuItems = MENU_ITEMS.filter(item => 
    item.roles.includes(currentUser.role)
  );

  // Xử lý navigation khi click menu item
  const handleNavigation = (path: string) => {
    onNavigate(path);
    if (window.innerWidth < 1024) { // Đóng sidebar trên mobile
      onClose();
    }
  };

  return (
    <>
      {/* Overlay cho mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto
          w-64 bg-white shadow-xl border-r-2
        `}
        style={{ borderRightColor: THEME_COLORS.primary[200] }}
      >
        {/* Header sidebar */}
        <div 
          className="flex items-center justify-between p-4 border-b-2"
          style={{ 
            backgroundColor: THEME_COLORS.primary[50],
            borderBottomColor: THEME_COLORS.primary[200] 
          }}
        >
          <div>
            <h2 
              className="text-lg font-semibold"
              style={{ color: THEME_COLORS.primary[800] }}
            >
              {LABELS.dashboard}
            </h2>
            <p className="text-sm text-gray-600">
              {ROLE_LABELS[currentUser.role]}
            </p>
          </div>

          {/* Nút đóng cho mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-blue-100 transition-colors"
            style={{ color: THEME_COLORS.primary[600] }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="mt-4 px-2">
          {filteredMenuItems.map((item) => {
            const IconComponent = IconMap[item.icon as keyof typeof IconMap];
            const isActive = activePath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'shadow-md transform translate-x-1' 
                    : 'hover:translate-x-1 hover:shadow-sm'
                  }
                `}
                style={{
                  backgroundColor: isActive 
                    ? THEME_COLORS.primary[100] 
                    : 'transparent',
                  color: isActive 
                    ? THEME_COLORS.primary[800] 
                    : THEME_COLORS.secondary[600]
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = THEME_COLORS.primary[50];
                    e.currentTarget.style.color = THEME_COLORS.primary[700];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = THEME_COLORS.secondary[600];
                  }
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                    style={{ backgroundColor: THEME_COLORS.primary[500] }}
                  />
                )}

                {/* Icon */}
                <IconComponent 
                  size={20} 
                  className={`transition-colors duration-200 ${isActive ? 'text-blue-600' : ''}`}
                />

                {/* Label */}
                <span className="font-medium text-sm">
                  {item.label}
                </span>

                {/* Badge nếu có */}
                {item.badge && item.badge > 0 && (
                  <span 
                    className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div 
            className="p-3 rounded-lg text-center"
            style={{ backgroundColor: THEME_COLORS.primary[50] }}
          >
            <p 
              className="text-xs font-medium mb-1"
              style={{ color: THEME_COLORS.primary[700] }}
            >
              Điểm hiện tại
            </p>
            <p 
              className="text-lg font-bold"
              style={{ color: THEME_COLORS.primary[600] }}
            >
              {currentUser.currentPoints.toLocaleString()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
