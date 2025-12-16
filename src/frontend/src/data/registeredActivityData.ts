/**
 * registeredActivityData.ts - Mock data cho các hoạt động đã đăng ký của nhân viên
 */

export interface RegisteredActivity {
  employeeId: string;
  activityId: string;
  registeredAt: string;
  status: 'registered' | 'cancelled';
}

// Danh sách hoạt động đã đăng ký của nhân viên ID 06
export const mockRegisteredActivities: RegisteredActivity[] = [
  {
    employeeId: '06',
    activityId: 'act-001', // Chạy bộ vì sức khỏe
    registeredAt: '2024-12-12T10:30:00',
    status: 'registered'
  },
  {
    employeeId: '06',
    activityId: 'act-003', // Workshop Kỹ năng lãnh đạo
    registeredAt: '2024-12-14T14:20:00',
    status: 'registered'
  },
  {
    employeeId: '06',
    activityId: 'act-005', // Hiến máu nhân đạo
    registeredAt: '2024-12-16T09:15:00',
    status: 'registered'
  }
];

// Hàm kiểm tra nhân viên đã đăng ký hoạt động chưa
export const isActivityRegistered = (employeeId: string, activityId: string): boolean => {
  return mockRegisteredActivities.some(
    reg => reg.employeeId === employeeId && 
           reg.activityId === activityId && 
           reg.status === 'registered'
  );
};

// Hàm lấy danh sách hoạt động đã đăng ký của nhân viên
export const getRegisteredActivitiesByEmployee = (employeeId: string): RegisteredActivity[] => {
  return mockRegisteredActivities.filter(
    reg => reg.employeeId === employeeId && reg.status === 'registered'
  );
};
