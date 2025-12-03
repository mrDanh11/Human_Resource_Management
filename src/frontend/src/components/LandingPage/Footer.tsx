// src/pages/landing/components/Footer.tsx
import { THEME_COLORS } from "../common/THEME_COLORS";

export default function Footer() {
  return (
    <footer className="w-full border-t" style={{ borderColor: THEME_COLORS.secondary[100] }}>
      <div className="max-w-6xl mx-auto py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">© {new Date().getFullYear()} Human Resource Management System — Group 07</div>
        <div className="text-sm text-gray-600">Contact: admin@company.com</div>
      </div>
    </footer>
  );
}
