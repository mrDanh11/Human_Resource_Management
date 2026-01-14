// Mock data cho trang phê duyệt yêu cầu cập nhật bảng công

export type RequestType = 'Giờ in' | 'Giờ ra' | 'Cả ngày' | 'Thêd';
export type RequestStatus = 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối' | 'Đã hủy';

export interface ApprovalRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  date: string; // DD/MM/YYYY
  type: RequestType;
  oldValue: string;
  newValue: string;
  reason: string;
  status: RequestStatus;
  submittedBy: string;
  submittedAt: string; // DD/MM/YYYY HH:mm
  approvedBy?: string;
  approvedAt?: string;
}

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    employeeId: '30154',
    employeeName: 'Nguyễn Văn An',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff',
    date: '15/01/2024',
    type: 'Giờ in',
    oldValue: '08:30',
    newValue: '08:00',
    reason: 'Quên chấm công do họp sáng cấp với khách hàng',
    status: 'Chờ duyệt',
    submittedBy: 'Anh Nguyễn',
    submittedAt: '16/01/2024 09:15:30'
  },
  {
    id: '2',
    employeeId: '09524',
    employeeName: 'Trần Thị Bình',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=ec4899&color=fff',
    date: '15/01/2024',
    type: 'Giờ ra',
    oldValue: '17:00',
    newValue: '18:30',
    reason: 'Làm thêm giờ để hoàn thành dự án deadline',
    status: 'Chờ duyệt',
    submittedBy: 'Anh Trần',
    submittedAt: '16/01/2024 08:45:20'
  },
  {
    id: '3',
    employeeId: '11226',
    employeeName: 'Hoàng Văn Em',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Hoang+Van+Em&background=10b981&color=fff',
    date: '15/01/2024',
    type: 'Giờ in',
    oldValue: '09:30',
    newValue: '08:35',
    reason: 'Đã vào công ty nhưng quên chấm công',
    status: 'Chờ duyệt',
    submittedBy: 'Chị Hoàng',
    submittedAt: '16/01/2024 11:00:05'
  },
  {
    id: '4',
    employeeId: '09340',
    employeeName: 'Lê Văn Cường',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Le+Van+Cuong&background=f59e0b&color=fff',
    date: '14/01/2024',
    type: 'Thêd',
    oldValue: '0 giờ',
    newValue: '3 giờ',
    reason: 'Tăng ca xử lý có sự cố hệ thống',
    status: 'Đã duyệt',
    submittedBy: 'Lê Văn Cường',
    submittedAt: '15/01/2024 10:20:15',
    approvedBy: 'Quản lý IT',
    approvedAt: '15/01/2024 14:30:00'
  },
  {
    id: '5',
    employeeId: '11732',
    employeeName: 'Phạm Thị Dung',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Pham+Thi+Dung&background=8b5cf6&color=fff',
    date: '13/07/2024',
    type: 'Cả ngày',
    oldValue: 'Cả ngày',
    newValue: 'Cả chiều',
    reason: 'Đã xin ra ngoài để đi khám bảo hiểm',
    status: 'Đã hủy bỏ',
    submittedBy: 'Chị Dũng',
    submittedAt: '14/01/2024 07:00:00'
  },
  {
    id: '6',
    employeeId: '07234',
    employeeName: 'Đỗ Thị Phương',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Do+Thi+Phuong&background=14b8a6&color=fff',
    date: '14/01/2024',
    type: 'Thêd',
    oldValue: '0 giờ',
    newValue: '2 giờ',
    reason: 'Hỗ trợ team thực hiện thành báo cáo',
    status: 'Đã duyệt',
    submittedBy: 'Chị Đỗ',
    submittedAt: '15/01/2024 09:00:00',
    approvedBy: 'Trưởng phòng',
    approvedAt: '15/01/2024 10:30:00'
  },
  {
    id: '7',
    employeeId: '30155',
    employeeName: 'Nguyễn Minh Tú',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Minh+Tu&background=f97316&color=fff',
    date: '12/01/2024',
    type: 'Giờ in',
    oldValue: '09:00',
    newValue: '08:00',
    reason: 'Có công việc đột xuất từ sáng sớm',
    status: 'Từ chối',
    submittedBy: 'Anh Tú',
    submittedAt: '13/01/2024 10:00:00',
    approvedBy: 'Quản lý',
    approvedAt: '13/01/2024 15:00:00'
  },
  {
    id: '8',
    employeeId: '30156',
    employeeName: 'Lê Thị Mai',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Le+Thi+Mai&background=ef4444&color=fff',
    date: '15/01/2024',
    type: 'Giờ ra',
    oldValue: '17:30',
    newValue: '19:00',
    reason: 'Làm việc với khách hàng ngoài giờ',
    status: 'Chờ duyệt',
    submittedBy: 'Chị Mai',
    submittedAt: '16/01/2024 08:00:00'
  },
  {
    id: '9',
    employeeId: '30157',
    employeeName: 'Trần Văn Hùng',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Tran+Van+Hung&background=06b6d4&color=fff',
    date: '14/01/2024',
    type: 'Cả ngày',
    oldValue: '08:00',
    newValue: '09:00',
    reason: 'Đi muộn do kẹt xe',
    status: 'Đã duyệt',
    submittedBy: 'Anh Hùng',
    submittedAt: '15/01/2024 08:30:00',
    approvedBy: 'Trưởng phòng',
    approvedAt: '15/01/2024 10:00:00'
  },
  {
    id: '10',
    employeeId: '30158',
    employeeName: 'Phạm Văn Long',
    employeeAvatar: 'https://ui-avatars.com/api/?name=Pham+Van+Long&background=a855f7&color=fff',
    date: '15/01/2024',
    type: 'Giờ in',
    oldValue: '08:45',
    newValue: '08:00',
    reason: 'Máy chấm công bị lỗi không nhận dấu vân tay',
    status: 'Chờ duyệt',
    submittedBy: 'Anh Long',
    submittedAt: '16/01/2024 09:30:00'
  }
];

// Helper functions
export const getRequestsByStatus = (status?: RequestStatus): ApprovalRequest[] => {
  if (!status) return mockApprovalRequests;
  return mockApprovalRequests.filter(req => req.status === status);
};

export const getRequestsByType = (type?: RequestType): ApprovalRequest[] => {
  if (!type) return mockApprovalRequests;
  return mockApprovalRequests.filter(req => req.type === type);
};

export const searchRequests = (query: string): ApprovalRequest[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockApprovalRequests.filter(req => 
    req.employeeName.toLowerCase().includes(lowercaseQuery) ||
    req.employeeId.includes(query) ||
    req.reason.toLowerCase().includes(lowercaseQuery)
  );
};
