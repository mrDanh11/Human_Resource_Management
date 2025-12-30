import type { ReactNode } from "react";
import Header from "../components/LandingPage/Header";
import Sidebar from "../components/common/Sidebar";
import { BACKGROUNDS } from "../constants/styles";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex" style={BACKGROUNDS.page}>
        <Sidebar />
        <div className="flex-1 flex flex-col items-center ml-64" style={BACKGROUNDS.page}>
          {children}
        </div>
      </div>
    </>
  );
}
