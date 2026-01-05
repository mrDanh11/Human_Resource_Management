import React, { useState } from "react";
import { Home, User, FileText, Award, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const userId = localStorage.getItem('userId');

const ManagerSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems = [
    { label: "Trang chủ", icon: Home, to: "/landing" },
    { label: "Thông tin cá nhân", icon: User, to: `/employee/profile/${userId}` },
    { label: "Yêu cầu", icon: FileText, to: "/manager/requests" },
    { 
      label: "Điểm thưởng", 
      icon: Award, 
      key: "rewards",
      submenu: [
        { label: "Tổng quan", to: "/manager/rewards/points" },
        { label: "Lịch sử giao dịch", to: "/manager/rewards/history" },
        { label: "Đổi thưởng", to: "/manager/rewards/exchange" },
      ]
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col py-10 px-6 fixed h-full overflow-y-auto">
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${item.submenu.some(sub => location.pathname === sub.to)
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
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${location.pathname === item.to
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

export default ManagerSidebar;
