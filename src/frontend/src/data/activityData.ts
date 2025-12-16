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
    startDate: '2026-01-20T07:00:00',
    endDate: '2026-01-22T18:00:00',
    registrationStart: '2025-12-01T00:00:00',
    registrationEnd: '2026-01-15T23:59:59',
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
    startDate: '2026-02-01T08:00:00',
    endDate: '2026-02-02T16:00:00',
    registrationStart: '2025-12-01T00:00:00',
    registrationEnd: '2026-01-25T23:59:59',
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
    startDate: '2026-02-10T14:00:00',
    endDate: '2026-02-10T18:00:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2026-02-05T23:59:59',
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
    startDate: '2026-01-28T07:00:00',
    endDate: '2026-01-28T11:00:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2026-01-26T23:59:59',
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
    startDate: '2025-12-21T06:30:00',
    endDate: '2025-12-21T08:00:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2025-12-20T23:59:59',
    maxParticipants: 40,
    currentParticipants: 35,
    location: 'Sân thượng Tầng 10',
    type: 'sports',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    organizer: 'Câu lạc bộ Sức khỏe',
    points: 20
  },
  {
    id: 'act-009',
    name: 'Khóa học Excel nâng cao',
    description: 'Khóa đào tạo kỹ năng sử dụng Excel từ cơ bản đến nâng cao, bao gồm các hàm phức tạp và pivot table.',
    startDate: '2026-02-05T08:30:00',
    endDate: '2026-02-07T17:00:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2026-02-01T23:59:59',
    maxParticipants: 60,
    currentParticipants: 38,
    location: 'Phòng máy tính B - Tầng 3',
    type: 'training',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    organizer: 'Phòng Đào tạo',
    points: 40
  },
  {
    id: 'act-010',
    name: 'Bơi lội mùa hè',
    description: 'Buổi tập bơi lội tập thể dành cho nhân viên và gia đình, có huấn luyện viên hướng dẫn.',
    startDate: '2026-02-15T08:00:00',
    endDate: '2026-02-15T11:00:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2026-02-12T23:59:59',
    maxParticipants: 50,
    currentParticipants: 31,
    location: 'Bể bơi Mỹ Đình',
    type: 'sports',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800',
    organizer: 'Câu lạc bộ Thể thao',
    points: 45
  },
  {
    id: 'act-011',
    name: 'Workshop Kỹ năng giao tiếp',
    description: 'Hội thảo nâng cao kỹ năng giao tiếp và thuyết trình hiệu quả trong môi trường công sở.',
    startDate: '2026-02-20T13:30:00',
    endDate: '2026-02-20T17:30:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2026-02-18T23:59:59',
    maxParticipants: 45,
    currentParticipants: 29,
    location: 'Hội trường Tầng 2',
    type: 'training',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    organizer: 'Phòng Nhân sự',
    points: 35
  },
  {
    id: 'act-012',
    name: 'Dã ngoại cuối tuần',
    description: 'Chuyến du lịch ngắn ngày đến Tam Đảo, tham quan và nghỉ dưỡng cùng đồng nghiệp.',
    startDate: '2026-02-22T06:00:00',
    endDate: '2026-02-23T18:00:00',
    registrationStart: '2025-12-10T00:00:00',
    registrationEnd: '2026-02-19T23:59:59',
    maxParticipants: 80,
    currentParticipants: 56,
    location: 'Tam Đảo, Vĩnh Phúc',
    type: 'team-building',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    organizer: 'Ban Đoàn thể',
    points: 65
  },
  {
    id: 'act-013',
    name: 'Tặng quà trung thu cho trẻ em',
    description: 'Chương trình trao tặng bánh trung thu và quà cho trẻ em có hoàn cảnh khó khăn.',
    startDate: '2025-09-10T08:00:00',
    endDate: '2025-09-10T16:00:00',
    registrationStart: '2024-12-16T00:00:00',
    registrationEnd: '2025-09-05T23:59:59',
    maxParticipants: 35,
    currentParticipants: 18,
    location: 'Trung tâm Bảo trợ trẻ em Hà Nội',
    type: 'charity',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?w=800',
    organizer: 'Ban Đoàn thể',
    points: 85
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
