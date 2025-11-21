/**
 * Dashboard.tsx - Trang dashboard chính cho HRMS
 * Overview stats, recent activities, quick actions
 * Different content theo role (employee/manager/admin)
 */

import { useState, useEffect } from 'react';
import { 
  Users, FileText, Activity, Award, TrendingUp,
  Clock, Target, CheckCircle, AlertCircle, Plus, ArrowRight
} from 'lucide-react';
import { 
  USER_ROLES, LABELS, THEME_COLORS, ROLE_LABELS 
} from '../constants/app';
import type { Employee, DashboardStats } from '../types/employee';

// ===========================================
// INTERFACE PROPS
// ===========================================
interface DashboardProps {
  currentUser: Employee;
  onNavigate: (path: string) => void;
}

// ===========================================
// COMPONENT STATS CARD
// ===========================================
interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = THEME_COLORS.primary[500],
  trend,
  onClick
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-6
        transition-all duration-200 hover:shadow-md hover:scale-105
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp 
              size={16} 
              className={trend.isPositive ? '' : 'rotate-180'} 
            />
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-600 text-sm">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

// ===========================================
// COMPONENT QUICK ACTION CARD
// ===========================================
interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionProps> = ({
  icon: Icon,
  title,
  description,
  color = THEME_COLORS.primary[500],
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-lg border border-gray-200 p-4 
                hover:shadow-lg hover:border-blue-300 transition-all duration-200 
                hover:scale-105 active:scale-95"
    >
      <div className="flex items-center space-x-3">
        <div 
          className="p-2 rounded-lg group-hover:scale-110 transition-transform"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {description}
          </p>
        </div>
        
        <ArrowRight 
          size={16} 
          className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" 
        />
      </div>
    </button>
  );
};

// ===========================================
// COMPONENT DASHBOARD CHÍNH
// ===========================================
const Dashboard: React.FC<DashboardProps> = ({ currentUser, onNavigate }) => {
  // State cho dashboard stats với mock data mặc định
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 156,
    pendingRequests: 12,
    activeCompetitions: 3,
    totalPoints: 85420,
    currentPoints: currentUser.currentPoints || 2580,
    teamMembers: 8
  });

  const [isLoading] = useState(false);

  // Effect để load data
  useEffect(() => {
    // Load real data nếu có API
    setStats({
      totalEmployees: 156,
      pendingRequests: 12,
      activeCompetitions: 3,
      totalPoints: 85420,
      currentPoints: currentUser.currentPoints || 2580,
      teamMembers: 8
    });
  }, [currentUser.currentPoints]);

  // Render dashboard theo role
  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case USER_ROLES.ADMIN:
        return renderAdminDashboard();
      case USER_ROLES.HR:
        return renderHRDashboard();
      case USER_ROLES.MANAGER:
        return renderManagerDashboard();
      case USER_ROLES.EMPLOYEE:
      default:
        return renderEmployeeDashboard();
    }
  };

  // Dashboard cho Admin
  const renderAdminDashboard = () => (
    <>
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Users}
          title="Tổng nhân viên"
          value={stats.totalEmployees || 0}
          color={THEME_COLORS.primary[500]}
          trend={{ value: 8.2, isPositive: true }}
          onClick={() => onNavigate('/employees')}
        />
        <StatsCard
          icon={FileText}
          title="Yêu cầu chờ duyệt"
          value={stats.pendingRequests || 0}
          color={THEME_COLORS.warning}
          onClick={() => onNavigate('/requests')}
        />
        <StatsCard
          icon={Activity}
          title="Cuộc thi đang diễn ra"
          value={stats.activeCompetitions || 0}
          color={THEME_COLORS.success}
          onClick={() => onNavigate('/activities')}
        />
        <StatsCard
          icon={Award}
          title="Tổng điểm hệ thống"
          value={stats.totalPoints || 0}
          color={THEME_COLORS.info}
          onClick={() => onNavigate('/rewards')}
        />
      </div>

      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="space-y-3">
            <QuickActionCard
              icon={Plus}
              title="Tạo nhân viên mới"
              description="Thêm nhân viên vào hệ thống"
              onClick={() => onNavigate('/employees/create')}
            />
            <QuickActionCard
              icon={Activity}
              title="Tạo cuộc thi mới"
              description="Khởi tạo hoạt động cho nhân viên"
              onClick={() => onNavigate('/activities/create')}
            />
            <QuickActionCard
              icon={Award}
              title="Quản lý điểm thưởng"
              description="Cấu hình quy tắc điểm thưởng"
              onClick={() => onNavigate('/rewards/settings')}
            />
          </div>
        </div>

        {/* System Analytics Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Phân tích hệ thống</h2>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">Biểu đồ phân tích sẽ hiển thị ở đây</p>
            <button
              onClick={() => onNavigate('/reports')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Xem báo cáo chi tiết
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Dashboard cho HR
  const renderHRDashboard = () => (
    <>
      {/* HR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Users}
          title="Tổng nhân viên"
          value={stats.totalEmployees || 0}
          color={THEME_COLORS.primary[500]}
          trend={{ value: 5.2, isPositive: true }}
          onClick={() => onNavigate('/employees')}
        />
        <StatsCard
          icon={FileText}
          title="Yêu cầu chờ duyệt"
          value={stats.pendingRequests || 0}
          color={THEME_COLORS.warning}
          onClick={() => onNavigate('/requests')}
        />
        <StatsCard
          icon={Users}
          title="Tuyển dụng mới"
          value={8}
          subtitle="Tháng này"
          color={THEME_COLORS.success}
          onClick={() => onNavigate('/hr/recruitment')}
        />
        <StatsCard
          icon={Award}
          title="Điểm thưởng phân phối"
          value={stats.totalPoints || 0}
          color={THEME_COLORS.info}
          onClick={() => onNavigate('/rewards')}
        />
      </div>

      {/* HR Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quản lý nhân sự</h2>
          <div className="space-y-3">
            <QuickActionCard
              icon={Plus}
              title="Thêm nhân viên mới"
              description="Tuyển dụng và thêm nhân viên"
              onClick={() => onNavigate('/employees/create')}
            />
            <QuickActionCard
              icon={FileText}
              title="Quản lý yêu cầu"
              description={`${stats.pendingRequests} yêu cầu chờ xử lý`}
              onClick={() => onNavigate('/requests')}
            />
            <QuickActionCard
              icon={Users}
              title="Báo cáo nhân sự"
              description="Thống kê và phân tích"
              onClick={() => onNavigate('/hr/reports')}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thống kê nhân viên</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Kỹ thuật</p>
                <p className="text-sm text-blue-600">45 nhân viên</p>
              </div>
              <div className="text-blue-600 font-bold">65%</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Kinh doanh</p>
                <p className="text-sm text-green-600">28 nhân viên</p>
              </div>
              <div className="text-green-600 font-bold">40%</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-800">Nhân sự</p>
                <p className="text-sm text-purple-600">12 nhân viên</p>
              </div>
              <div className="text-purple-600 font-bold">17%</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Dashboard cho Manager
  const renderManagerDashboard = () => (
    <>
      {/* Manager Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Users}
          title="Thành viên nhóm"
          value={stats.teamMembers || 0}
          color={THEME_COLORS.primary[500]}
          onClick={() => onNavigate('/team')}
        />
        <StatsCard
          icon={FileText}
          title="Yêu cầu chờ duyệt"
          value={stats.pendingRequests || 0}
          color={THEME_COLORS.warning}
          onClick={() => onNavigate('/requests')}
        />
        <StatsCard
          icon={Award}
          title="Điểm cá nhân"
          value={currentUser.currentPoints}
          subtitle="Có thể tặng cho team"
          color={THEME_COLORS.success}
          onClick={() => onNavigate('/rewards')}
        />
        <StatsCard
          icon={Target}
          title="Mục tiêu tháng"
          value="85%"
          color={THEME_COLORS.info}
        />
      </div>

      {/* Manager Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quản lý nhóm</h2>
          <div className="space-y-3">
            <QuickActionCard
              icon={CheckCircle}
              title="Phê duyệt yêu cầu"
              description={`${stats.pendingRequests} yêu cầu đang chờ`}
              onClick={() => onNavigate('/requests')}
            />
            <QuickActionCard
              icon={Award}
              title="Tặng điểm thưởng"
              description="Thưởng điểm cho thành viên xuất sắc"
              onClick={() => onNavigate('/rewards/gift')}
            />
            <QuickActionCard
              icon={Users}
              title="Quản lý team"
              description="Xem hiệu suất nhóm"
              onClick={() => onNavigate('/team')}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nguyễn A đã hoàn thành yêu cầu</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Trần B gửi yêu cầu nghỉ phép</p>
                <p className="text-xs text-gray-500">4 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Dashboard cho Employee
  const renderEmployeeDashboard = () => (
    <>
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Award}
          title="Điểm hiện tại"
          value={currentUser.currentPoints}
          color={THEME_COLORS.primary[500]}
          trend={{ value: 12.5, isPositive: true }}
          onClick={() => onNavigate('/rewards')}
        />
        <StatsCard
          icon={FileText}
          title="Yêu cầu đang chờ"
          value={2}
          color={THEME_COLORS.warning}
          onClick={() => onNavigate('/requests')}
        />
        <StatsCard
          icon={Activity}
          title="Hoạt động tham gia"
          value={3}
          color={THEME_COLORS.success}
          onClick={() => onNavigate('/activities')}
        />
        <StatsCard
          icon={Clock}
          title="Giờ làm tháng này"
          value="168h"
          color={THEME_COLORS.info}
        />
      </div>

      {/* Employee Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="space-y-3">
            <QuickActionCard
              icon={FileText}
              title="Tạo yêu cầu mới"
              description="Nghỉ phép, WFH, cập nhật timesheet"
              onClick={() => onNavigate('/requests/create')}
            />
            <QuickActionCard
              icon={Activity}
              title="Tham gia cuộc thi"
              description="Đăng ký các hoạt động công ty"
              onClick={() => onNavigate('/activities')}
            />
            <QuickActionCard
              icon={Award}
              title="Quy đổi điểm thưởng"
              description="Chuyển đổi điểm thành tiền mặt"
              onClick={() => onNavigate('/rewards/convert')}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông báo</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <AlertCircle size={16} className="text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Cuộc thi chạy bộ mới</p>
                <p className="text-xs text-blue-600">Đăng ký trước 25/11</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <CheckCircle size={16} className="text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Yêu cầu được duyệt</p>
                <p className="text-xs text-green-600">Nghỉ phép 22-23/11</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {LABELS.welcome}, {currentUser.fullName}! 👋
        </h1>
        <p className="text-gray-600">
          {ROLE_LABELS[currentUser.role]} - {currentUser.department}
        </p>
        <p className="text-sm text-gray-500">
          Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Dashboard Content theo Role */}
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;
