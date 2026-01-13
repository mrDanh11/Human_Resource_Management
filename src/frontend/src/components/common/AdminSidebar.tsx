import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, ChevronLeft, Home } from "lucide-react";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const userName = localStorage.getItem('name') || 'Nguyễn Văn A';
  const userRole = localStorage.getItem('role');
  
  const menuItems = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Yêu cầu nghỉ phép", to: "/admin/requests" },
    { label: "Quản lý điểm thưởng", to: "/admin/point" },
    { 
      label: "Quản lý Hoạt động", 
      key: "activities",
      submenu: [
        { label: "Danh sách hoạt động", to: "/admin/activities" },
        { label: "Thống kê hoạt động", to: "/admin/activities/statistics" },
        { label: "Thêm hoạt động", to: "/admin/activities/create" },
        { label: "Hủy hoạt động", to: "/admin/activities/cancel" },
        { label: "Ghi nhận kết quả", to: "/admin/activities/record-result" },
        { label: "Quản lý điểm danh", to: "/admin/activities/attendance" },
      ]
    },
    { label: "Bảng công", to: "/admin/timesheet" },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white shadow-xl border-r border-gray-200 flex flex-col fixed h-full transition-width duration-200`}>
      <div className="px-3 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            aria-label="Admin home"
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-md text-blue-600">
              <Home size={18} />
            </div>
            {!collapsed && <span className="text-2xl font-extrabold text-blue-600 tracking-wide">HRM Admin</span>}
          </button>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Mở sidebar' : 'Thu sidebar'}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className={`space-y-3 flex-1 overflow-y-auto ${collapsed ? 'pt-2' : 'pt-4'}`}>
        {menuItems.map((item, i) => (
          <div key={i}>
            {item.submenu ? (
              // Menu with submenu
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key || null)}
                  className={`w-full flex items-center ${collapsed ? 'py-2.5 px-2 justify-center' : 'py-2.5 px-4 justify-between'} rounded-lg font-medium transition-all ${
                    item.submenu.some(sub => location.pathname === sub.to)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && (
                    <div className={`transition-transform duration-300 ${openDropdown === item.key ? 'rotate-0' : '-rotate-90'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </button>
                
                {/* Submenu */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === item.key 
                      ? 'max-h-60 opacity-100 mt-2' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`${collapsed ? 'ml-0' : 'ml-4'} space-y-2`}>
                    {item.submenu.map((subItem, j) => (
                      <button
                        key={j}
                        onClick={() => navigate(subItem.to)}
                        title={subItem.label}
                        className={`w-full text-left block ${collapsed ? 'py-2.5 px-2 text-sm' : 'py-2 px-4 rounded-lg text-sm font-medium'} transition-all ${
                          location.pathname === subItem.to
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {!collapsed ? subItem.label : <span className="sr-only">{subItem.label}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Regular menu item
              <button
                onClick={() => navigate(item.to!)}
                className={`w-full text-left block ${collapsed ? 'py-2.5 px-2 justify-center' : 'py-2.5 px-4'} rounded-lg font-medium transition-all ${
                  location.pathname === item.to
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {!collapsed && item.label}
                {collapsed && <span className="sr-only">{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* USER INFO – BOTTOM */}
      <div className={`border-t border-gray-200 ${collapsed ? 'px-3 py-3' : 'px-6 py-4'} bg-white sticky bottom-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="font-semibold text-sm">{userName}</div>
              <div className="text-xs text-gray-500 capitalize">{userRole}</div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;