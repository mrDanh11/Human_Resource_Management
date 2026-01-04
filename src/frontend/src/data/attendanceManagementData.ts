// Mock data cho trang quản lý chấm công

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatar: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'normal' | 'late' | 'missing' | 'on-leave';
  statusText: string;
}

// Danh sách nhân viên
export const employees = [
  { id: 'NV001', name: 'Nguyễn Văn An' },
  { id: 'NV002', name: 'Trần Thị Bình' },
  { id: 'NV003', name: 'Lê Văn Cường' }
];

// Danh sách phòng ban
export const departments = [
  { id: 'it', name: 'Phòng IT' },
  { id: 'marketing', name: 'Phòng Marketing' },
  { id: 'accounting', name: 'Phòng Kế toán' }
];

// Mock data chấm công
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'NV001',
    employeeName: 'Nguyễn Văn An',
    department: 'Phòng IT',
    avatar: 'NA',
    date: '15/01/2024',
    checkIn: '--:--',
    checkOut: '17:30',
    status: 'missing',
    statusText: 'Thiếu dữ liệu'
  },
  {
    id: '2',
    employeeId: 'NV002',
    employeeName: 'Trần Thị Bình',
    department: 'Phòng Marketing',
    avatar: 'TB',
    date: '15/01/2024',
    checkIn: '09:15',
    checkOut: '18:00',
    status: 'late',
    statusText: 'Đi muộn'
  },
  {
    id: '3',
    employeeId: 'NV003',
    employeeName: 'Lê Văn Cường',
    department: 'Phòng Kế toán',
    avatar: 'LC',
    date: '15/01/2024',
    checkIn: '08:00',
    checkOut: '--:--',
    status: 'missing',
    statusText: 'Chưa checkout'
  },
  {
    id: '4',
    employeeId: 'NV001',
    employeeName: 'Nguyễn Văn An',
    department: 'Phòng IT',
    avatar: 'NA',
    date: '16/01/2024',
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'normal',
    statusText: 'Bình thường'
  },
  {
    id: '5',
    employeeId: 'NV002',
    employeeName: 'Trần Thị Bình',
    department: 'Phòng Marketing',
    avatar: 'TB',
    date: '16/01/2024',
    checkIn: '08:05',
    checkOut: '17:10',
    status: 'normal',
    statusText: 'Bình thường'
  }
];
