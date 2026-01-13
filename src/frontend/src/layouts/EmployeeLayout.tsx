import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const EmployeeLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 bg-gray-100 ml-64">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;
