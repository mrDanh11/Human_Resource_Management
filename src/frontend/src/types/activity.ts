export interface Activity {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  activityType: string;
  imageUrl: string;
  organizer: string;
  points: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  maxParticipants: number;
  location: string;
  activityType: string;
  imageUrl: string;
  organizer: string;
  points: number;
}

export interface ActivityListResponse {
  activities: Activity[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Campaign - Chiến dịch/hoạt động cho nhân viên
 */
export interface Campaign {
  id?: string;
  name: string; // 10-200 ký tự
  description: string; // Tối thiểu 50 ký tự
  startDate: string;
  endDate: string;
  registrationDeadline: string; // Phải trước startDate ít nhất 1 ngày
  maxParticipants: number | null; // 5-1000 hoặc null (không giới hạn)
  imageUrl?: string;
  status?: 'upcoming' | 'ongoing' | 'ended';
  createdAt?: string;
}

export interface CampaignFormData extends Omit<Campaign, 'id' | 'status' | 'createdAt'> {}

export interface CampaignValidationErrors {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  maxParticipants?: string;
  imageUrl?: string;
  points: number;
}

export interface CompetitionLeaderboard {
  employeeId: string;
  employeeName: string;
  totalDistance: number;
  totalRuns: number;
  averageSpeed: number;
  rank: number;
}

export interface CompetitionStats {
  totalParticipants: number;
  totalDistance: number;
  totalRuns: number;
  averageDistance: number;
  topRunners: CompetitionLeaderboard[];
}

export interface ParticipationData {
  id: number,
  employeeId: number,
  activityId: number,
  employeeName: string,
  activityName: string,
  description: string,
  registerDate: Date,
  cancelDate: Date,
  status: string,
  result: string,
  imgPath: string,
}

export interface MyParticipationResponse {
  employeeId: number;
  activityId: number;
  activityName: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  location: string;
  activityType: string;
  imageUrl: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  points: number;
  activityStatus: string;
  registeredAt: string;
  status: string;
}


export interface ExcellentEmployee {
  id: number;
  name: string;
  department: string;
  email: string;
}

export interface CompletedActivityData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  excellentEmployees: number;
  excellentEmployeeList?: ExcellentEmployee[];
  location?: string;
  activityType?: string;
  imageUrl?: string;
  organizer?: string;
  points?: number;
}