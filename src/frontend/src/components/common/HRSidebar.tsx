import React, { useState, useEffect } from "react";
import { Home, UserRoundCog, User, FileText, Activity, Award, ChevronDown, LayoutDashboard, Menu, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";

const userId = localStorage.getItem('userId');
console.log("User ID in HRSidebar:", userId);

const HRSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  useEffect(() => {
    if (collapsed) {
      setOpenDropdown(null);
    }
  }, [collapsed]);

  const menuItems = [
    { label: "Trang chủ", icon: Home, to: "/landing" },
    { label: "Dashboard", icon: LayoutDashboard, to: "/hr/dashboard" },
    { label: "Hồ sơ cá nhân", icon: User, to: `/hr/employee/profile/${userId}` },
    {
      label: "Quản lý nhân viên",
      icon: UserRoundCog,
      key: "employees",
      submenu: [
        { label: "Danh sách", to: "/hr/employee/list" },
        { label: "Thêm nhân viên", to: "/hr/employee/create" },
      ]
    },
    { label: "Yêu cầu", icon: FileText, to: "/hr/requests" },
    {
      label: "Hoạt động",
      icon: Activity,
      key: "activities",
      submenu: [
        { label: "Đang mở", to: "/hr/activities" },
        { label: "Tạo hoạt động", to: "/hr/activities/create" },
        { label: "Hủy hoạt động", to: "/hr/activities/cancel" },
        { label: "Đã đăng ký", to: "/hr/activities/history" },
        { label: "Kết quả", to: "/hr/activities/result" }
      ]
    },
    { 
      label: "Điểm thưởng", 
      icon: Award, 
      key: "rewards",
      submenu: [
        { label: "Tổng quan", to: "/hr/rewards/points" },
        { label: "Thưởng điểm HR", to: "/hr/rewards/hr-reward" },
        { label: "Lịch sử giao dịch", to: "/hr/rewards/history" },
        { label: "Đổi thưởng", to: "/hr/rewards/exchange" },
      ]
    },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-[#E6E6E6] flex flex-col pb-4 px-2 fixed h-full transition-width duration-200`}>
      <div className={`px-1 py-3 border-b border-gray-200 flex items-center ${collapsed ? 'justify-center' : 'justify-end'} mb-4`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Mở sidebar' : 'Thu sidebar'}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {collapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={i}>
              {item.submenu ? (
                // Menu with submenu
                <div>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key || null)}
                    className={`w-full flex items-center ${collapsed ? 'justify-center px-3 py-2' : 'gap-3 px-4 py-2'} rounded-lg text-sm font-medium transition-all ${item.submenu.some(sub => location.pathname === sub.to)
                      ? "bg-[#EDF4FF] text-[#0066FF] shadow"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${openDropdown === item.key ? "rotate-0" : "-rotate-90"
                            }`}
                        />
                      </>
                    )}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.key
                      ? "max-h-60 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className={`${collapsed ? 'ml-0' : 'ml-4'} space-y-1`}>
                      {item.submenu.map((subItem, j) => (
                        <button
                          key={j}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(subItem.to);
                          }}
                          title={collapsed ? subItem.label : undefined}
                          className={`w-full text-left ${collapsed ? 'flex justify-center py-2 px-3' : 'block py-2 px-4'} rounded-lg text-sm font-medium transition-all ${location.pathname === subItem.to
                            ? "bg-[#EDF4FF] text-[#0066FF]"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {collapsed ? subItem.label.charAt(0) : subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular menu item
                <button
                  onClick={() => navigate(item.to!)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full text-left flex items-center ${collapsed ? 'justify-center px-3 py-2' : 'gap-3 px-4 py-2'} rounded-lg text-sm font-medium transition-all ${location.pathname === item.to
                    ? "bg-[#EDF4FF] text-[#0066FF] shadow"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={18} />
                  {!collapsed && item.label}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      <UserInfo collapsed={collapsed} />

    </aside>
  );
}

export default HRSidebar;
