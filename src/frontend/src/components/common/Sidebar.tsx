import React from "react";
import { Home, User, FileText, Activity, Award } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const userId = localStorage.getItem('userId');

const MENU = [
  { label: "Trang chủ", icon: Home, path: "/landing" },
  { label: "Hồ sơ cá nhân", icon: User, path: `/employee/profile/${userId}` },
  { label: "Yêu cầu", icon: FileText, path: "/requests" },
  { label: "Hoạt động", icon: Activity, path: "/activities" },
  { label: "Điểm thưởng", icon: Award, path: "/rewards" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-[#E6E6E6] flex flex-col pt-8 pb-4 px-2">
      <nav className="flex flex-col gap-2">
        {MENU.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-[#EDF4FF] text-[#0066FF] shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
