import React, { useState } from "react";
import {
  Home,
  User,
  FileText,
  Activity,
  Award,
  ChevronDown,
  Menu,
  ChevronLeft
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const userName = localStorage.getItem("name") || "Nguyễn Văn A";

  const menuItems = [
    { label: "Thông tin cá nhân", icon: User, to: `/employee/profile/${userId}` },
    {
      label: "Yêu cầu",
      icon: FileText,
      key: "requests",
      submenu: [
        { label: "Tạo yêu cầu mới", to: "/requests/create" },
        { label: "Yêu cầu của tôi", to: "/requests/my-requests" },
        { label: "Danh sách yêu cầu", to: "/requests" },
        { label: "Quản lý timesheet", to: "/timesheet/manage" }
      ]
    },
    {
      label: "Hoạt động",
      icon: Activity,
      key: "activities",
      submenu: [
        { label: "Đang mở", to: "/activities" },
        ...(userRole === "hr"
          ? [
              { label: "Tạo hoạt động", to: "/activities/create" },
              { label: "Hủy hoạt động", to: "/activities/cancel" }
            ]
          : []),
        { label: "Đã đăng ký", to: "/activities/history" },
        { label: "Kết quả", to: "/activities/result" }
      ]
    },
    {
      label: "Điểm thưởng",
      icon: Award,
      key: "rewards",
      submenu: [
        { label: "Tổng quan", to: "/rewards/points" },
        ...(userRole === "hr"
          ? [{ label: "Thưởng điểm HR", to: "/rewards/hr-reward" }]
          : []),
        { label: "Lịch sử giao dịch", to: "/rewards/history" },
        { label: "Đổi thưởng", to: "/rewards/exchange" }
      ]
    }
  ];

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-white border-r border-gray-200 flex flex-col fixed h-full transition-width duration-200`}>
      {/* TOGGLE */}
      <div className="px-3 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/landing")}
            aria-label="Trang chủ"
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-md text-[#0066FF]">
              <Home size={18} />
            </div>
            {!collapsed && <span className="font-semibold text-[#0066FF]">Trang chủ</span>}
          </button>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Mở sidebar" : "Thu sidebar"}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      {/* MENU */}
      <nav className={`flex-1 py-4 ${collapsed ? 'px-2' : 'px-6'} overflow-y-auto`}>
        <div className="flex flex-col gap-2">
          {menuItems.map((item, i) => {
            const Icon = item.icon;

            return (
              <div key={i}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === item.key ? null : item.key || null
                        )
                      }
                      className={`w-full flex items-center gap-3 ${collapsed ? 'px-2 py-2.5 justify-center' : 'px-4 py-2.5'} rounded-lg font-medium transition-all ${
                        item.submenu.some(
                          (sub) => location.pathname === sub.to
                        )
                          ? "bg-[#EDF4FF] text-[#0066FF]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} />
                      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                      {!collapsed && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            openDropdown === item.key ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                      )}
                    </button>

                    <div
                      className={`overflow-hidden transition-all ${
                        openDropdown === item.key
                          ? "max-h-60 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className={`${collapsed ? 'ml-0' : 'ml-4'} space-y-1`}>
                        {item.submenu.map((sub, j) => (
                          <button
                            key={j}
                            onClick={() => navigate(sub.to)}
                            title={sub.label}
                                    className={`w-full text-left ${collapsed ? 'py-2.5 px-2 text-sm' : 'py-2.5 px-4 rounded-lg text-sm'} ${
                              location.pathname === sub.to
                                ? "bg-[#EDF4FF] text-[#0066FF]"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {!collapsed ? sub.label : <span className="sr-only">{sub.label}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(item.to!)}
                    className={`w-full flex items-center gap-3 ${collapsed ? 'px-2 py-2.5 justify-center' : 'px-4 py-2.5'} rounded-lg font-medium transition-all ${
                      location.pathname === item.to
                        ? "bg-[#EDF4FF] text-[#0066FF]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {!collapsed && item.label}
                    {collapsed && <span className="sr-only">{item.label}</span>}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* USER INFO – BOTTOM */}
      <div className={`border-t border-gray-200 ${collapsed ? 'px-3 py-3' : 'px-6 py-4'} bg-white sticky bottom-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md relative">
            <User size={20} />
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

export default Sidebar;
