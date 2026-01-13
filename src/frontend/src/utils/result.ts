export const parseResult = (result: any): Record<string, any> => {
  if (!result) return {};

  if (typeof result === 'string') {
    try {
      return JSON.parse(result);
    } catch {
      return {};
    }
  }

  return result;
};

export const RESULT_LABEL_MAP: Record<string, string> = {
  note: 'Ghi chú',
  rank: 'Thứ hạng',
  time: 'Thời gian hoàn thành',
  distance_km: 'Quãng đường (km)',
  pace_per_km: 'Pace / km',
  distance_m: 'Quãng đường (m)',
  attendance_hours: 'Số giờ tham gia',
  quiz_score: 'Điểm quiz',
  completion_date: 'Ngày hoàn thành',
  certificate_issued: 'Chứng chỉ đã cấp',
  impact: 'Tác động',
  recognition: 'Công nhận',
  tasks_completed: 'Số nhiệm vụ hoàn thành',
  activities_completed: 'Số hoạt động đã hoàn thành',
  hours_contributed: 'Số giờ đóng góp',
  team_name: 'Tên đội',
  team_rank: 'Thứ hạng đội',
  points_earned: 'Điểm đạt được',
};