import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const menuItems = [
    { label: "Dashboard", to: "/admin/dashboard" },
    { 
      label: "Quản lý nhân viên", 
      key: "employees",
      submenu: [
        { label: "Danh sách nhân viên", to: "/admin/employee/list" },
        { label: "Thêm nhân viên", to: "/admin/employee/create" },
      ]
    },
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
      ]
    },
    { label: "Bảng công", to: "/admin/timesheet" },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col py-10 px-6 fixed h-full overflow-y-auto">
      <div className="mb-10 text-3xl font-extrabold text-blue-600 tracking-wide">
        HRM Admin
      </div>

      <nav className="space-y-3">
        {menuItems.map((item, i) => (
          <div key={i}>
            {item.submenu ? (
              // Menu with submenu
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key || null)}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-lg font-medium transition-all ${
                    item.submenu.some(sub => location.pathname === sub.to)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <span>{item.label}</span>
                  <div className={`transition-transform duration-300 ${openDropdown === item.key ? 'rotate-0' : '-rotate-90'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                {/* Submenu */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === item.key 
                      ? 'max-h-60 opacity-100 mt-2' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-4 space-y-2">
                    {item.submenu.map((subItem, j) => (
                      <button
                        key={j}
                        onClick={() => navigate(subItem.to)}
                        className={`w-full text-left block py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                          location.pathname === subItem.to
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Regular menu item
              <button
                onClick={() => navigate(item.to!)}
                className={`w-full text-left block py-2.5 px-4 rounded-lg font-medium transition-all ${
                  location.pathname === item.to
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;