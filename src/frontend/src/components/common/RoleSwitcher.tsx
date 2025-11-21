/**
 * RoleSwitcher.tsx - Component để đổi role demo
 * Chỉ dùng cho testing và development
 */

import { USER_ROLES, ROLE_LABELS } from '../../constants/app';
import type { Employee } from '../../types/employee';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface RoleSwitcherProps {
  currentUser: Employee;
  onRoleChange: (role: string) => void;
}

// ===========================================
// COMPONENT ROLE SWITCHER
// ===========================================
const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  onRoleChange
}) => {
  // Danh sách tất cả roles
  const roles = Object.values(USER_ROLES);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        🔄 Đổi Role (Demo Mode)
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${currentUser.role === role
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }
            `}
          >
            {ROLE_LABELS[role]}
            {currentUser.role === role && (
              <span className="ml-1 text-blue-200">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Role hiện tại: <span className="font-medium">{ROLE_LABELS[currentUser.role]}</span>
      </div>
    </div>
  );
};

export default RoleSwitcher;