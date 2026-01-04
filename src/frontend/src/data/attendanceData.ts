// Mock data cho bảng chấm công

export type AttendanceStatus = 'Normal' | 'Late' | 'Missing' | 'Overtime' | 'Leave';

export interface AttendanceRecord {
  id: string;
  date: string; // Format: DD/MM/YYYY
  checkIn: string | null; // Format: HH:mm
  checkOut: string | null; // Format: HH:mm
  totalHours: string | null; // Format: X.Xh
  status: AttendanceStatus;
  note: string;
}

export interface AttendanceSummary {
  totalWorkDays: number;
  lateOrEarlyCount: number;
  overtimeHours: number;
  absenceOrLeaveCount: number;
}

export interface MonthlyAttendance {
  month: string; // Format: MM/YYYY
  records: AttendanceRecord[];
  summary: AttendanceSummary;
}

// Mock data cho tháng 10/2025
export const mockAttendanceOctober2025: MonthlyAttendance = {
  month: '10/2025',
  records: [
    {
      id: '1',
      date: '16/10/2025',
      checkIn: '08:12',
      checkOut: '17:03',
      totalHours: '7.8h',
      status: 'Late',
      note: ''
    },
    {
      id: '2',
      date: '17/10/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    },
    {
      id: '3',
      date: '18/10/2025',
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: 'Missing',
      note: ''
    },
    {
      id: '4',
      date: '19/10/2025',
      checkIn: '08:00',
      checkOut: '19:30',
      totalHours: '10.5h',
      status: 'Overtime',
      note: 'Làm thêm dự án'
    },
    {
      id: '5',
      date: '20/10/2025',
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: 'Leave',
      note: 'Nghỉ phép'
    },
    {
      id: '6',
      date: '21/10/2025',
      checkIn: '08:05',
      checkOut: '17:00',
      totalHours: '7.9h',
      status: 'Normal',
      note: ''
    },
    {
      id: '7',
      date: '22/10/2025',
      checkIn: '08:15',
      checkOut: '16:50',
      totalHours: '7.6h',
      status: 'Late',
      note: ''
    },
    {
      id: '8',
      date: '23/10/2025',
      checkIn: '08:00',
      checkOut: '17:30',
      totalHours: '8.5h',
      status: 'Overtime',
      note: ''
    },
    {
      id: '9',
      date: '24/10/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    },
    {
      id: '10',
      date: '25/10/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    }
  ],
  summary: {
    totalWorkDays: 22,
    lateOrEarlyCount: 3,
    overtimeHours: 15.5,
    absenceOrLeaveCount: 2
  }
};

// Mock data cho các tháng khác
export const mockAttendanceNovember2025: MonthlyAttendance = {
  month: '11/2025',
  records: [
    {
      id: '11',
      date: '01/11/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    },
    {
      id: '12',
      date: '02/11/2025',
      checkIn: '08:10',
      checkOut: '17:00',
      totalHours: '7.8h',
      status: 'Late',
      note: ''
    },
    {
      id: '13',
      date: '03/11/2025',
      checkIn: '08:00',
      checkOut: '18:30',
      totalHours: '9.5h',
      status: 'Overtime',
      note: 'Họp khách hàng'
    },
    {
      id: '14',
      date: '04/11/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    },
    {
      id: '15',
      date: '05/11/2025',
      checkIn: null,
      checkOut: null,
      totalHours: null,
      status: 'Leave',
      note: 'Nghỉ phép cá nhân'
    }
  ],
  summary: {
    totalWorkDays: 20,
    lateOrEarlyCount: 2,
    overtimeHours: 12.0,
    absenceOrLeaveCount: 1
  }
};

export const mockAttendanceDecember2025: MonthlyAttendance = {
  month: '12/2025',
  records: [
    {
      id: '16',
      date: '01/12/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    },
    {
      id: '17',
      date: '02/12/2025',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: '8.0h',
      status: 'Normal',
      note: ''
    },
    {
      id: '18',
      date: '03/12/2025',
      checkIn: '08:00',
      checkOut: '19:00',
      totalHours: '10.0h',
      status: 'Overtime',
      note: 'Sprint cuối năm'
    }
  ],
  summary: {
    totalWorkDays: 21,
    lateOrEarlyCount: 1,
    overtimeHours: 8.0,
    absenceOrLeaveCount: 0
  }
};

// Danh sách tất cả dữ liệu chấm công
export const allMonthlyAttendance: MonthlyAttendance[] = [
  mockAttendanceOctober2025,
  mockAttendanceNovember2025,
  mockAttendanceDecember2025
];

// Danh sách ca làm việc
export const workShifts = [
  { id: 'all', name: 'Tất cả ca' },
  { id: 'morning', name: 'Ca sáng (7:00 - 12:00)' },
  { id: 'afternoon', name: 'Ca chiều (13:00 - 18:00)' },
  { id: 'fullday', name: 'Ca ngày (8:00 - 17:00)' },
  { id: 'night', name: 'Ca đêm (20:00 - 5:00)' }
];
