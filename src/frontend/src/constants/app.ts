/**
 * app.ts - Constants cho ứng dụng Human Resource Management
 * Định nghĩa các hằng số, labels, roles và cấu hình chung
 */

// ===========================================
// CẤU HÌNH ỨNG DỤNG
// ===========================================
export const APP_CONFIG = {
  name: 'Human Resource Management System',
  shortName: 'HRMS',
  version: '1.0.0',
  course: 'CSC12005 - Phát triển ứng dụng hệ thống thông tin hiện đại',
  university: 'Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM',
  group: 'Group 07',
} as const;

// ===========================================
// PHÂN QUYỀN NGƯỜI DÙNG (SYNC VỚI DATABASE)
// ===========================================
export const USER_ROLES = {
  ADMIN: 'admin',        // id: 1 - System administrator
  HR: 'hr',              // id: 2 - Human resources manager
  MANAGER: 'manager',    // id: 3 - Department manager
  EMPLOYEE: 'employee',  // id: 4 - Regular employee
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Quản trị viên',
  [USER_ROLES.HR]: 'Nhân sự',
  [USER_ROLES.MANAGER]: 'Quản lý',
  [USER_ROLES.EMPLOYEE]: 'Nhân viên',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.EMPLOYEE]: [
    'view_own_profile',
    'edit_own_basic_info',
    'create_requests',
    'view_own_requests',
    'join_activities',
    'view_own_points',
    'convert_points'
  ],
  [USER_ROLES.MANAGER]: [
    'view_team_profiles',
    'approve_team_requests',
    'manage_team_activities',
    'gift_points',
    'view_team_reports'
  ],
  [USER_ROLES.HR]: [
    'manage_all_employees',
    'view_all_requests',
    'manage_departments',
    'view_hr_reports',
    'manage_employee_data',
    'handle_recruitment'
  ],
  [USER_ROLES.ADMIN]: [
    'full_system_access',
    'manage_employees',
    'manage_departments',
    'system_analytics',
    'manage_competitions',
    'manage_point_rules',
    'system_configuration'
  ]
} as const;

// ===========================================
// LABELS CHUNG CHO UI
// ===========================================
export const LABELS = {
  // Authentication
  auth: {
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    loginSubtitle: 'Đăng nhập vào hệ thống quản lý nhân sự',
    forgotPassword: 'Quên mật khẩu?',
    rememberMe: 'Ghi nhớ đăng nhập',
    invalidCredentials: 'Tên đăng nhập hoặc mật khẩu không đúng',
    loginSuccess: 'Đăng nhập thành công',
    logoutSuccess: 'Đăng xuất thành công'
  },

  // Header
  welcome: 'Chào mừng',
  notifications: 'Thông báo',
  profile: 'Hồ sơ',
  logout: 'Đăng xuất',
  
  // Dashboard Cards
  totalEmployees: 'Tổng nhân viên',
  pendingRequests: 'Yêu cầu chờ duyệt',
  activeCompetitions: 'Cuộc thi đang diễn ra',
  totalPoints: 'Tổng điểm thưởng',
  currentPoints: 'Điểm hiện tại',
  teamMembers: 'Thành viên nhóm',
  
  // Navigation
  dashboard: 'Bảng điều khiển',
  myProfile: 'Hồ sơ cá nhân',
  employeeManagement: 'Quản lý nhân viên',
  requestManagement: 'Quản lý yêu cầu',
  activityManagement: 'Quản lý hoạt động', 
  rewardSystem: 'Hệ thống khen thưởng',
  teamManagement: 'Quản lý nhóm',
  systemSettings: 'Cài đặt hệ thống',
  reports: 'Báo cáo',
  
  // Actions
  create: 'Tạo mới',
  edit: 'Chỉnh sửa',
  view: 'Xem',
  delete: 'Xóa',
  approve: 'Phê duyệt',
  reject: 'Từ chối',
  save: 'Lưu',
  cancel: 'Hủy',
  
  // Request Types
  leaveRequest: 'Xin nghỉ phép',
  wfhRequest: 'Làm việc từ xa',
  timesheetUpdate: 'Cập nhật timesheet',
  checkInOut: 'Chấm công',
  
  // Status
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
} as const;

// ===========================================
// CẤU HÌNH MENU NAVIGATION
// ===========================================
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles: string[];
  badge?: number;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: LABELS.dashboard,
    icon: 'Home',
    path: '/dashboard',
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'my-profile', 
    label: LABELS.myProfile,
    icon: 'User',
    path: '/profile',
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'employee-management',
    label: LABELS.employeeManagement,
    icon: 'Users',
    path: '/employees',
    roles: [USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'request-management',
    label: LABELS.requestManagement, 
    icon: 'FileText',
    path: '/requests',
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'activity-management',
    label: LABELS.activityManagement,
    icon: 'Activity',
    path: '/activities',
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'reward-system',
    label: LABELS.rewardSystem,
    icon: 'Award',
    path: '/rewards', 
    roles: [USER_ROLES.EMPLOYEE, USER_ROLES.MANAGER, USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'team-management',
    label: LABELS.teamManagement,
    icon: 'Users2',
    path: '/team',
    roles: [USER_ROLES.MANAGER]
  },
  {
    id: 'hr-management',
    label: 'Quản lý nhân sự',
    icon: 'UserCheck',
    path: '/hr',
    roles: [USER_ROLES.HR]
  },
  {
    id: 'reports',
    label: LABELS.reports,
    icon: 'BarChart3',
    path: '/reports',
    roles: [USER_ROLES.MANAGER, USER_ROLES.HR, USER_ROLES.ADMIN]
  },
  {
    id: 'system-settings',
    label: LABELS.systemSettings,
    icon: 'Settings',
    path: '/settings',
    roles: [USER_ROLES.ADMIN]
  }
];

// ===========================================
// MÀU SẮC CHỦ ĐẠO - XANH DƯƠNG
// ===========================================
export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Màu xanh dương chính
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0', 
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: '#10b981',
  warning: '#f59e0b', 
  error: '#ef4444',
  info: '#06b6d4',
} as const;

// ===========================================
// CẤU HÌNH ICON VÀ HÌNH ẢNH  
// ===========================================
export const ASSET_PATHS = {
  logo: '/src/assets/images/logo.png',
  avatars: '/src/assets/images/',
  icons: {
    company: '/src/assets/icons/company-icon.svg',
    notification: '/src/assets/icons/notification.svg',
    success: '/src/assets/icons/success.svg',
    warning: '/src/assets/icons/warning.svg',
    error: '/src/assets/icons/error.svg',
  }
} as const;

// ===========================================
// AVATAR CONSTANTS (READ-ONLY)
// ===========================================
export const AVATAR_SAMPLES = {
  admin: '/src/assets/images/admin.svg',
  hr: '/src/assets/images/hr_manager.svg', 
  manager: '/src/assets/images/manager.svg',
  employee: '/src/assets/images/employee.svg'
} as const;

// ===========================================
// CẤU HÌNH RESPONSIVE BREAKPOINTS
// ===========================================
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;