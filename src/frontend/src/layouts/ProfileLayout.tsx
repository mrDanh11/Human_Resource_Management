import type { ReactNode } from "react";
import { BACKGROUNDS } from "../types/styles";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="flex-1 flex flex-col items-center h-full" style={BACKGROUNDS.page}>
      {children}
    </div>
  );
}
