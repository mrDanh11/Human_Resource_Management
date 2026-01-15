import React, { useState, useEffect } from "react";
import { 
  Home, 
  UserRoundCog, 
  User, 
  FileText, 
  Activity, 
  Award, 
  ChevronDown, 
  LayoutDashboard, 
  Menu, 
  ChevronLeft,
  ClipboardList,
  BarChart,
  CheckCircle,
  ArrowLeftRight,
  DollarSign,
  Calendar as CalendarIcon
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";

const BaseSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role') || 'employee';
  
  useEffect(() => {
    if (collapsed) {
      setOpenDropdown(null);
    }
  }, [collapsed]);

  // Build menu items based on role
  const getMenuItems = () => {
    const items: any[] = [];

    // Trang chủ - Tất cả đều có
    items.push({ label: "Trang chủ", icon: Home, to: "/landing" });

    // Dashboard - Admin, HR và Manager có
    if (userRole === 'admin') {
      items.push({ 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        to: "/admin/dashboard" 
      });
    } else if (userRole === 'hr') {
      items.push({ 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        to: "/hr/dashboard" 
      });
    } else if (userRole === 'manager') {
      items.push({ 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        to: "/manager/dashboard" 
      });
    }

    // Thông tin cá nhân - Tất cả đều có
    if (userRole === 'admin') {
      items.push({ 
        label: "Hồ sơ cá nhân", 
        icon: User, 
        to: `/admin/employee/profile/${userId}` 
      });
    } else if (userRole === 'hr') {
      items.push({ 
        label: "Hồ sơ cá nhân", 
        icon: User, 
        to: `/hr/employee/profile/${userId}` 
      });
    } else if (userRole === 'manager') {
      items.push({ 
        label: "Hồ sơ cá nhân", 
        icon: User, 
        to: `/manager/employee/profile/${userId}` 
      });
    } else {
      items.push({ 
        label: "Thông tin cá nhân", 
        icon: User, 
        to: `/employee/profile/${userId}` 
      });
    }

    // Bảng công - Employee, HR và Manager có, Admin không
    if (userRole === 'hr') {
      items.push({
        label: "Bảng công",
        icon: ClipboardList,
        key: "attendance",
        submenu: [
          { label: "Bảng công", to: "/hr/attendance" },
          { label: "Quản lý Timesheet", to: "/hr/timesheet/manage" },
        ]
      });
    } else if (userRole === 'manager') {
      items.push({ 
        label: "Bảng công", 
        icon: ClipboardList, 
        to: "/manager/attendance" 
      });
    } else if (userRole === 'employee') {
      items.push({ 
        label: "Bảng công", 
        icon: ClipboardList, 
        to: "/attendance" 
      });
    }

    // Quản lý nhân viên - HR và Manager có
    if (userRole === 'hr') {
      items.push({
        label: "Quản lý nhân viên",
        icon: UserRoundCog,
        key: "employees",
        submenu: [
          { label: "Danh sách", to: "/hr/employee/list" },
          { label: "Thêm nhân viên", to: "/hr/employee/create" },
        ]
      });
    } else if (userRole === 'manager') {
      items.push({
        label: "Quản lý nhân viên",
        icon: UserRoundCog,
        key: "employees",
        submenu: [
          { label: "Danh sách", to: "/manager/employee/list" },
        ]
      });
    }

    // Yêu cầu - HR, Manager và Employee có, Admin không có
    if (userRole === 'hr') {
      items.push({
        label: "Yêu cầu",
        icon: FileText,
        key: "requests",
        submenu: [
          { label: "Tạo yêu cầu mới", to: "/hr/requests/create" },
          { label: "Yêu cầu của tôi", to: "/hr/requests/my-requests" },
          { label: "Danh sách yêu cầu", to: "/hr/requests" },
        ]
      });
    } else if (userRole === 'manager') {
      items.push({
        label: "Yêu cầu",
        icon: FileText,
        key: "requests",
        submenu: [
          { label: "Tạo yêu cầu mới", to: "/manager/requests/create" },
          { label: "Yêu cầu của tôi", to: "/manager/requests/my-requests" },
          { label: "Danh sách yêu cầu", to: "/manager/requests" },
          { label: "Duyệt yêu cầu", to: "/manager/approval" },
        ]
      });
    } else if (userRole === 'employee') {
      items.push({
        label: "Yêu cầu",
        icon: FileText,
        key: "requests",
        submenu: [
          { label: "Tạo yêu cầu mới", to: "/requests/create" },
          { label: "Yêu cầu của tôi", to: "/requests/my-requests" },
        ]
      });
    }

    // Hoạt động
    if (userRole === 'admin') {
      items.push({
        label: "Hoạt động",
        icon: Activity,
        key: "activities",
        submenu: [
          { label: "Danh sách hoạt động", to: "/admin/activities" },
          { label: "Thống kê hoạt động", to: "/admin/activities/statistics" },
          { label: "Đã đăng ký", to: "/admin/activities/history" },
          { label: "Kết quả", to: "/admin/activities/result" },
        ]
      });
    } else if (userRole === 'hr') {
      items.push({
        label: "Hoạt động",
        icon: Activity,
        key: "activities",
        submenu: [
          { label: "Danh sách hoạt động", to: "/hr/activities" },
          { label: "Quản lý hoạt động", to: "/hr/activities/manage" },
          { label: "Tạo hoạt động", to: "/hr/activities/create" },
          { label: "Hủy hoạt động", to: "/hr/activities/cancel" },
          { label: "Thống kê hoạt động", to: "/hr/activities/statistics" },
          { label: "Đã đăng ký", to: "/hr/activities/history" },
          { label: "Kết quả", to: "/hr/activities/result" },
          { label: "Quản lý điểm danh", to: "/hr/activities/attendance" },
          { label: "Ghi nhận kết quả", to: "/hr/activities/record-result" }
        ]
      });
    } else if (userRole === 'manager') {
      items.push({
        label: "Hoạt động",
        icon: Activity,
        key: "activities",
        submenu: [
          { label: "Danh sách hoạt động", to: "/manager/activities" },
          { label: "Đã đăng ký", to: "/manager/activities/history" },
          { label: "Kết quả", to: "/manager/activities/result" }
        ]
      });
    } else {
      items.push({
        label: "Hoạt động",
        icon: Activity,
        key: "activities",
        submenu: [
          { label: "Danh sách hoạt động", to: "/activities" },
          { label: "Đã đăng ký", to: "/activities/history" },
          { label: "Kết quả", to: "/activities/result" }
        ]
      });
    }

    // Điểm thưởng
    if (userRole === 'admin') {
      items.push({
        label: "Quản lý điểm thưởng",
        icon: Award,
        key: "rewards",
        submenu: [
          { label: "Bảng quy đổi", to: "/admin/point/conversion" },
          { label: "Lịch sử quy đổi", to: "/admin/point/conversion-history" },
          { label: "Duyệt yêu cầu", to: "/admin/point/requests" },
          { label: "Quản lý vai trò", to: "/admin/point/roles" },
          { label: "Lịch sử điểm", to: "/admin/point/history" },
        ]
      });
    } else if (userRole === 'hr') {
      items.push({
        label: "Điểm thưởng",
        icon: Award,
        key: "rewards",
        submenu: [
          { label: "Tổng quan", to: "/hr/rewards/points" },
          { label: "Thưởng Điểm", to: "/hr/rewards/hr-reward" },
          { label: "Lịch sử giao dịch", to: "/hr/rewards/history" },
          { label: "Đổi thưởng", to: "/hr/rewards/exchange" },
        ]
      });
    } else if (userRole === 'manager') {
      items.push({
        label: "Điểm thưởng",
        icon: Award,
        key: "rewards",
        submenu: [
          { label: "Tổng quan", to: "/manager/rewards/points" },
          { label: "Thưởng Điểm", to: "/manager/rewards/hr-reward" },
          { label: "Quản lý nhân viên", to: "/manager/rewards/employees" },
          { label: "Lịch sử giao dịch", to: "/manager/rewards/history" },
          { label: "Đổi thưởng", to: "/manager/rewards/exchange" },
        ]
      });
    } else {
      items.push({
        label: "Điểm thưởng",
        icon: Award,
        key: "rewards",
        submenu: [
          { label: "Tổng quan", to: "/rewards/points" },
          { label: "Lịch sử giao dịch", to: "/rewards/history" },
          { label: "Đổi thưởng", to: "/rewards/exchange" }
        ]
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-[#E6E6E6] flex flex-col pb-4 px-2 fixed h-full transition-width duration-200 z-50`}>
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
                    className={`w-full flex items-center ${collapsed ? 'justify-center px-3 py-2' : 'gap-3 px-4 py-2'} rounded-lg text-sm font-medium transition-all ${
                      item.submenu.some((sub: any) => location.pathname === sub.to)
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
                          className={`transition-transform duration-300 ${
                            openDropdown === item.key ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      </>
                    )}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openDropdown === item.key
                        ? "max-h-96 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className={`${collapsed ? 'ml-0' : 'ml-4'} space-y-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}>
                      {item.submenu.map((subItem: any, j: number) => (
                        <button
                          key={j}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.scrollTo(0, 0);
                            navigate(subItem.to);
                          }}
                          title={collapsed ? subItem.label : undefined}
                          className={`w-full text-left ${
                            collapsed 
                              ? 'flex justify-center py-2 px-3' 
                              : 'flex items-center gap-2 py-2 px-4'
                          } rounded-lg text-sm font-medium transition-all ${
                            location.pathname === subItem.to
                              ? "bg-[#EDF4FF] text-[#0066FF]"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {subItem.icon && <subItem.icon size={16} />}
                          {collapsed ? (
                            <span className="sr-only">{subItem.label}</span>
                          ) : (
                            <span>{subItem.label}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular menu item
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(item.to!);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full text-left flex items-center ${
                    collapsed ? 'justify-center px-3 py-2' : 'gap-3 px-4 py-2'
                  } rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.to
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

export default BaseSidebar;
