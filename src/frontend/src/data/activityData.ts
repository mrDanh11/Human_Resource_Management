/**
 * activityData.ts - Mock data cho danh sách các hoạt động
 */

export interface ActivityData {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  maxParticipants?: number;
  currentParticipants: number;
  location: string;
  type: 'sports' | 'charity' | 'training' | 'team-building' | 'volunteer';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  imageUrl?: string;
  organizer: string;
  points?: number;
}

export const mockActivities: ActivityData[] = [
  {
    id: 'act-001',
    name: 'Chạy bộ vì sức khỏe',
    description: 'Chương trình chạy bộ marathon nhằm nâng cao sức khỏe và tinh thần đồng đội. Tất cả nhân viên đều có thể tham gia.',
    startDate: '2025-01-15T06:00:00',
    endDate: '2025-01-15T10:00:00',
    registrationStart: '2024-12-10T00:00:00',
    registrationEnd: '2025-12-25T23:59:59',
    maxParticipants: 100,
    currentParticipants: 67,
    location: 'Công viên Thống Nhất',
    type: 'sports',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    organizer: 'Phòng Nhân sự',
    points: 50
  },
  {
    id: 'act-002',
    name: 'Từ thiện vùng cao',
    description: 'Chương trình từ thiện mang đến quà tặng, sách vở cho trẻ em vùng cao. Cùng nhau chia sẻ yêu thương.',
    startDate: '2025-01-20T07:00:00',
    endDate: '2025-01-22T18:00:00',
    registrationStart: '2024-12-15T00:00:00',
    registrationEnd: '2025-01-15T23:59:59',
    maxParticipants: 30,
    currentParticipants: 28,
    location: 'Sơn La, Lai Châu',
    type: 'charity',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    organizer: 'Ban Đoàn thể',
    points: 100
  },
  {
    id: 'act-003',
    name: 'Workshop Kỹ năng lãnh đạo',
    description: 'Khóa đào tạo nâng cao kỹ năng lãnh đạo và quản lý nhóm cho các quản lý cấp trung.',
    startDate: '2025-01-18T08:00:00',
    endDate: '2025-01-18T17:00:00',
    registrationStart: '2024-12-10T00:00:00',
    registrationEnd: '2025-12-20T23:59:59',
    maxParticipants: 50,
    currentParticipants: 42,
    location: 'Phòng hội thảo A - Tầng 5',
    type: 'training',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    organizer: 'Phòng Đào tạo',
    points: 30
  },
  {
    id: 'act-004',
    name: 'Team Building Mùa Đông',
    description: 'Hoạt động team building với các trò chơi ngoài trời, BBQ và gala dinner tại resort.',
    startDate: '2025-02-01T08:00:00',
    endDate: '2025-02-02T16:00:00',
    registrationStart: '2024-12-20T00:00:00',
    registrationEnd: '2025-01-25T23:59:59',
    maxParticipants: 150,
    currentParticipants: 89,
    location: 'Legacy Yên Tử Resort, Quảng Ninh',
    type: 'team-building',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    organizer: 'Ban Giám đốc',
    points: 80
  },
  {
    id: 'act-005',
    name: 'Hiến máu nhân đạo',
    description: 'Ngày hội hiến máu tình nguyện phối hợp cùng Viện Huyết học - Truyền máu TW.',
    startDate: '2025-01-25T08:00:00',
    endDate: '2025-01-25T16:00:00',
    registrationStart: '2024-12-10T00:00:00',
    registrationEnd: '2025-12-23T23:59:59',
    maxParticipants: 80,
    currentParticipants: 54,
    location: 'Hội trường Tầng 1',
    type: 'volunteer',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?w=800',
    organizer: 'Phòng Y tế',
    points: 70
  },
  {
    id: 'act-006',
    name: 'Giải cầu lông nội bộ',
    description: 'Giải đấu cầu lông giao hữu giữa các phòng ban nhằm tăng cường sức khỏe và gắn kết.',
    startDate: '2025-02-10T14:00:00',
    endDate: '2025-02-10T18:00:00',
    registrationStart: '2024-12-16T00:00:00',
    registrationEnd: '2025-02-05T23:59:59',
    maxParticipants: 32,
    currentParticipants: 24,
    location: 'Nhà thi đấu Trịnh Hoài Đức',
    type: 'sports',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    organizer: 'Câu lạc bộ Thể thao',
    points: 40
  },
  {
    id: 'act-007',
    name: 'Trồng cây xanh bảo vệ môi trường',
    description: 'Chiến dịch trồng 1000 cây xanh tại khu vực công nghiệp nhằm cải thiện môi trường làm việc.',
    startDate: '2025-01-28T07:00:00',
    endDate: '2025-01-28T11:00:00',
    registrationStart: '2024-12-16T00:00:00',
    registrationEnd: '2025-01-26T23:59:59',
    maxParticipants: 100,
    currentParticipants: 73,
    location: 'Khu công nghiệp Thăng Long',
    type: 'volunteer',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    organizer: 'Ban Môi trường',
    points: 60
  },
  {
    id: 'act-008',
    name: 'Yoga buổi sáng',
    description: 'Lớp yoga định kỳ mỗi sáng thứ 7 giúp thư giãn và nâng cao sức khỏe tinh thần.',
    startDate: '2025-01-13T06:30:00',
    endDate: '2025-01-13T08:00:00',
    registrationStart: '2024-12-10T00:00:00',
    registrationEnd: '2025-01-12T23:59:59',
    maxParticipants: 40,
    currentParticipants: 35,
    location: 'Sân thượng Tầng 10',
    type: 'sports',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    organizer: 'Câu lạc bộ Sức khỏe',
    points: 20
  }
];

export const getActivityById = (id: string): ActivityData | undefined => {
  return mockActivities.find(activity => activity.id === id);
};

export const getUpcomingActivities = (): ActivityData[] => {
  return mockActivities.filter(activity => activity.status === 'upcoming');
};

export const getActivitiesByType = (type: ActivityData['type']): ActivityData[] => {
  return mockActivities.filter(activity => activity.type === type);
};
