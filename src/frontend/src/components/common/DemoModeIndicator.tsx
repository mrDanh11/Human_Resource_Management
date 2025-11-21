/**
 * DemoModeIndicator.tsx - Component hiển thị thông báo demo mode
 * Hiển thị trong header để user biết đang ở chế độ demo
 */

import { AlertCircle, Info } from 'lucide-react';
import { THEME_COLORS } from '../../constants/app';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface DemoModeIndicatorProps {
  currentUserRole?: string;
  className?: string;
}

// ===========================================
// COMPONENT DEMO MODE INDICATOR
// ===========================================
const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({
  currentUserRole,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300 ${className}`}>
      <Info className="h-4 w-4 text-yellow-600" />
      <span className="text-sm font-medium text-yellow-800">
        Demo Mode
      </span>
      {currentUserRole && (
        <span className="text-xs text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">
          {currentUserRole.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default DemoModeIndicator;