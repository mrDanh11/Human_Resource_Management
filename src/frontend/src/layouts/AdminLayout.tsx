import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header.tsx";
import AdminSidebar from "../components/common/AdminSidebar.tsx";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 bg-gray-100 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
