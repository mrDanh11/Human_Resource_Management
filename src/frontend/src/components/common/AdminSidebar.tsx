import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, ChevronLeft, Home, LayoutDashboard, FileText, Award, Calendar, ClipboardList, BarChart, Plus, XCircle, CheckCircle, UserCheck, Users, TrendingUp, ArrowLeftRight, DollarSign } from "lucide-react";
import UserInfo from "./UserInfo";

const AdminSidebar: React.FC = () => {
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
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Yêu cầu nghỉ phép", to: "/admin/requests", icon: FileText },
    { 
      label: "Quản lý điểm thưởng",
      key: "rewards",
      icon: Award,
      submenu: [
        { label: "Vai trò & định mức", to: "/admin/point/roles", icon: Users },
        { label: "Danh sách nhân viên", to: "/admin/point/employees", icon: TrendingUp },
        { label: "Bảng quy đổi", to: "/admin/point/conversion", icon: ArrowLeftRight },
        { label: "Duyệt yêu cầu", to: "/admin/point/requests", icon: CheckCircle },
        { label: "Lịch sử đổi điểm", to: "/admin/point/conversion-history", icon: DollarSign },
        { label: "Lịch sử giao dịch", to: "/admin/point/history", icon: Calendar },
      ]
    },
    { 
      label: "Quản lý hoạt động", 
      key: "activities",
      icon: Calendar,
      submenu: [
        { label: "Quản lý điểm danh", to: "/admin/activities/attendance", icon: UserCheck },
        { label: "Danh sách hoạt động", to: "/admin/activities", icon: ClipboardList },
        { label: "Thống kê hoạt động", to: "/admin/activities/statistics", icon: BarChart },
        { label: "Thêm hoạt động", to: "/admin/activities/create", icon: Plus },
        { label: "Hủy hoạt động", to: "/admin/activities/cancel", icon: XCircle },
        { label: "Ghi nhận kết quả", to: "/admin/activities/record-result", icon: CheckCircle },
      ]
    },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-70'} bg-white shadow-xl border-r border-gray-200 flex flex-col fixed h-full transition-width duration-200`}>
      <div className={`px-3 py-3 border-b border-gray-200 flex items-center ${collapsed ? 'justify-center' : 'justify-end'}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Mở sidebar' : 'Thu sidebar'}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {collapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      <nav className={`space-y-3 flex-1 overflow-y-auto ${collapsed ? 'pt-2 px-2' : 'pt-4 px-3'}`}>
        {menuItems.map((item, i) => (
          <div key={i}>
            {item.submenu ? (
              // Menu with submenu
              <div>
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key || null)}
                  className={`w-full flex items-center ${collapsed ? 'py-2.5 px-3 justify-center' : 'py-2.5 px-5 justify-between'} rounded-lg font-medium transition-all ${
                    item.submenu.some(sub => location.pathname === sub.to)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  {collapsed && item.icon && <item.icon className="w-5 h-5" />}
                  {!collapsed && (
                    <>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                      <div className={`transition-transform duration-300 flex-shrink-0 ml-2 ${openDropdown === item.key ? 'rotate-0' : '-rotate-90'}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </>
                  )}
                </button>
                
                {/* Submenu */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdown === item.key 
                      ? 'max-h-96 opacity-100 mt-2' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`${collapsed ? 'ml-0' : 'ml-4'} space-y-2`}>
                    {item.submenu.map((subItem, j) => (
                      <button
                        key={j}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(subItem.to);
                        }}
                        title={subItem.label}
                        className={`w-full text-left ${collapsed ? 'flex justify-center py-2.5 px-3' : 'flex items-center gap-2 py-2 px-5 rounded-lg font-medium'} transition-all ${
                          location.pathname === subItem.to
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {subItem.icon && <subItem.icon className="w-4 h-4" />}
                        {!collapsed && <span>{subItem.label}</span>}
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
                className={`w-full text-left ${collapsed ? 'flex justify-center py-2.5 px-3' : 'flex items-center gap-2 py-2.5 px-4'} rounded-lg font-medium transition-all ${
                  location.pathname === item.to
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {!collapsed && <span>{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>

      <UserInfo collapsed={collapsed} />

    </aside>
  );
};

export default AdminSidebar;