import React, { useState } from "react";
import { Home, User, FileText, Activity, Award, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const userId = localStorage.getItem('userId');

const HRSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    { label: "Trang chủ", icon: Home, to: "/landing" },
    { label: "Dashboard", icon: FileText, to: "/hr/dashboard" },
    { label: "Hồ sơ cá nhân", icon: User, to: `/employee/profile/${userId}` },
    { label: "Yêu cầu", icon: FileText, to: "/requests" },
    {
      label: "Hoạt động",
      icon: Activity,
      key: "activities",
      submenu: [
        { label: "Đang mở", to: "/activities" },
        { label: "Tạo hoạt động", to: "/activities/create" },
        { label: "Hủy hoạt động", to: "/activities/cancel" },
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

        { label: "Thưởng điểm HR", to: "/rewards/hr-reward" },
        { label: "Lịch sử giao dịch", to: "/rewards/history" },
        { label: "Đổi thưởng", to: "/rewards/exchange" },

      ]
    },
  ];

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-[#E6E6E6] flex flex-col pt-8 pb-4 px-2">

      <div className="mb-6 px-4">
        <div className="text-xl font-bold text-blue-600">HR Portal</div>
        <div className="text-xs text-gray-500">Human Resources</div>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={i}>
              {item.submenu ? (
                // Menu with submenu
                <div>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.key ? null : item.key || null)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${item.submenu.some(sub => location.pathname === sub.to)
                      ? "bg-[#EDF4FF] text-[#0066FF] shadow"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${openDropdown === item.key ? "rotate-0" : "-rotate-90"
                        }`}
                    />
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.key
                      ? "max-h-60 opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem, j) => (
                        <button
                          key={j}
                          onClick={() => navigate(subItem.to)}
                          className={`w-full text-left block py-2 px-4 rounded-lg text-sm font-medium transition-all ${location.pathname === subItem.to
                            ? "bg-[#EDF4FF] text-[#0066FF]"
                            : "text-gray-700 hover:bg-gray-100"
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
                  className={`w-full text-left flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.to
                    ? "bg-[#EDF4FF] text-[#0066FF] shadow"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default HRSidebar;
