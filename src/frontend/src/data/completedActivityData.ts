/**
 * completedActivityData.ts - Mock data cho các hoạt động đã hoàn thành
 */

export interface CompletedActivityData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  excellentEmployees: number;
  absentees: number;
  location: string;
  type: 'sports' | 'charity' | 'training' | 'team-building' | 'volunteer';
  imageUrl?: string;
  organizer: string;
}

export const mockCompletedActivities: CompletedActivityData[] = [
  {
    id: 'comp-001',
    name: 'Chạy bộ Marathon mùa xuân 2024',
    description: 'Chương trình chạy bộ marathon nhằm nâng cao sức khỏe và tinh thần đồng đội. Tất cả nhân viên đều có thể tham gia.',
    startDate: '2024-03-15T06:00:00',
    endDate: '2024-03-15T10:00:00',
    maxParticipants: 100,
    currentParticipants: 87,
    excellentEmployees: 12,
    absentees: 8,
    location: 'Công viên Thống Nhất',
    type: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    organizer: 'Phòng Nhân sự'
  },
  {
    id: 'comp-002',
    name: 'Từ thiện vùng cao Sapa',
    description: 'Chương trình từ thiện mang đến quà tặng, sách vở cho trẻ em vùng cao. Cùng nhau chia sẻ yêu thương.',
    startDate: '2024-05-20T07:00:00',
    endDate: '2024-05-22T18:00:00',
    maxParticipants: 30,
    currentParticipants: 30,
    excellentEmployees: 8,
    absentees: 2,
    location: 'Sapa, Lào Cai',
    type: 'charity',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    organizer: 'Ban Giám đốc'
  },
  {
    id: 'comp-003',
    name: 'Đào tạo kỹ năng lãnh đạo',
    description: 'Khóa đào tạo nâng cao kỹ năng lãnh đạo và quản lý cho các trưởng phòng và nhân viên tiềm năng.',
    startDate: '2024-06-10T08:00:00',
    endDate: '2024-06-12T17:00:00',
    maxParticipants: 50,
    currentParticipants: 45,
    excellentEmployees: 15,
    absentees: 3,
    location: 'Hội trường A, Tòa nhà chính',
    type: 'training',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    organizer: 'Phòng Đào tạo'
  },
  {
    id: 'comp-004',
    name: 'Team Building mùa hè 2024',
    description: 'Chuyến du lịch team building tại biển Vũng Tàu, tăng cường gắn kết và tinh thần làm việc nhóm.',
    startDate: '2024-07-15T07:00:00',
    endDate: '2024-07-17T18:00:00',
    maxParticipants: 120,
    currentParticipants: 115,
    excellentEmployees: 20,
    absentees: 10,
    location: 'Resort Malibu, Vũng Tàu',
    type: 'team-building',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    organizer: 'Phòng Hành chính'
  },
  {
    id: 'comp-005',
    name: 'Hiến máu tình nguyện',
    description: 'Chương trình hiến máu nhân đạo cứu người, góp phần lan tỏa yêu thương trong cộng đồng.',
    startDate: '2024-08-25T08:00:00',
    endDate: '2024-08-25T16:00:00',
    maxParticipants: 80,
    currentParticipants: 72,
    excellentEmployees: 25,
    absentees: 5,
    location: 'Hội trường B, Tòa nhà chính',
    type: 'volunteer',
    imageUrl: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=800',
    organizer: 'Đoàn Thanh niên'
  },
  {
    id: 'comp-006',
    name: 'Bóng đá giao hữu liên phòng ban',
    description: 'Giải bóng đá giao hữu giữa các phòng ban nhằm thúc đẩy tinh thần thể thao và đoàn kết.',
    startDate: '2024-09-10T14:00:00',
    endDate: '2024-09-10T18:00:00',
    maxParticipants: 60,
    currentParticipants: 58,
    excellentEmployees: 10,
    absentees: 4,
    location: 'Sân vận động Quận 7',
    type: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    organizer: 'CLB Bóng đá'
  },
  {
    id: 'comp-007',
    name: 'Dọn dẹp bãi biển xanh',
    description: 'Hoạt động tình nguyện dọn rác bảo vệ môi trường biển, nâng cao ý thức cộng đồng.',
    startDate: '2024-10-05T06:00:00',
    endDate: '2024-10-05T11:00:00',
    maxParticipants: 50,
    currentParticipants: 48,
    excellentEmployees: 18,
    absentees: 3,
    location: 'Bãi biển Cần Giờ',
    type: 'volunteer',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
    organizer: 'Nhóm Môi trường xanh'
  },
  {
    id: 'comp-008',
    name: 'Đào tạo Digital Marketing',
    description: 'Khóa học nâng cao kiến thức về marketing số và xu hướng mới trong ngành.',
    startDate: '2024-11-15T09:00:00',
    endDate: '2024-11-15T17:00:00',
    maxParticipants: 40,
    currentParticipants: 38,
    excellentEmployees: 12,
    absentees: 2,
    location: 'Phòng họp tầng 5',
    type: 'training',
    imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800',
    organizer: 'Phòng Marketing'
  }
];
