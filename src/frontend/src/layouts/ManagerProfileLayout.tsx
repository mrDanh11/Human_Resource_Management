import type { ReactNode } from "react";
import { BACKGROUNDS } from "../types/styles";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ManagerProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="flex-1 flex flex-col items-center" style={BACKGROUNDS.page}>
      {children}
    </div>
  );
}
