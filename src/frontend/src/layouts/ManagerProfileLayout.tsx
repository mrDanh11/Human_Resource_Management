import type { ReactNode } from "react";
import Header from "../components/common/Header";
import { BACKGROUNDS } from "../types/styles";
import ManagerSidebar from "../components/common/ManagerSideBar";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ManagerProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex" style={BACKGROUNDS.page}>
        <ManagerSidebar />
        <div className="flex-1 flex flex-col items-center ml-64" style={BACKGROUNDS.page}>
          {children}
        </div>
      </div>
    </>
  );
}
