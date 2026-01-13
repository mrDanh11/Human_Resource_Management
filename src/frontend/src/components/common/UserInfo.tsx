import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { employeeService } from "../../services/employeeService";

interface UserInfoProps {
  collapsed?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ collapsed = false }) => {
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (userId) {
        setLoading(true);
        try {
          const userDetail = await employeeService.getEmployeeDetail(Number(userId));
          setCurrentUserName(userDetail.fullname);
        } catch (error) {
          console.error('Failed to fetch current user info:', error);
          setCurrentUserName(localStorage.getItem('name') || 'Người dùng');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCurrentUser();
  }, [userId]);

  const displayName = currentUserName || localStorage.getItem('name') || 'Người dùng';

  return (
    <div className={`border-t border-gray-200 ${collapsed ? 'px-3 py-3' : 'px-6 py-4'} bg-white sticky bottom-0`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md relative">
          <User size={20} />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        {!collapsed && (
          <div className="flex-1">
            <div className="font-semibold text-sm">
              {loading ? 'Đang tải...' : displayName}
            </div>
            <div className="text-xs text-gray-500 capitalize">{userRole}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
