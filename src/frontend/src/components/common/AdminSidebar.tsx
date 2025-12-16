import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { label: "Quản lý nhân viên", to: "/admin/employee/list" },
    { label: "Thêm nhân viên", to: "/admin/employee/create" },
    { label: "Yêu cầu nghỉ phép", to: "/admin/requests" },
    { label: "Quản lý điểm thưởng", to: "/admin/point" },
    { label: "Hoạt động/Campaign", to: "/admin/activities" },
    { label: "Bảng công", to: "/admin/timesheet" },
  ];

  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col py-10 px-6">
      <div className="mb-10 text-3xl font-extrabold text-blue-600 tracking-wide">
        HRM Admin
      </div>

      <nav className="space-y-3">
        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className={`block py-2.5 px-4 rounded-lg font-medium transition-all ${
              location.pathname === item.to
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
