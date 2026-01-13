import {
  StickyNote,
  Trophy,
  Timer,
  Route,
  Gauge,
  Ruler,
  Clock,
  CalendarCheck,
  Award,
  HandHeart,
  Medal,
  ListChecks,
  Activity,
  Users,
  Star,
  Hash, 
  MessageSquareMore
} from 'lucide-react';


export const RESULT_ICON_MAP: Record<string, any> = {
  note: StickyNote,
  rank: Trophy,
  team_rank: Medal,

  time: Timer,
  pace_per_km: Gauge,

  distance_km: Route,
  distance_m: Ruler,

  attendance_hours: Clock,
  hours_contributed: Clock,

  quiz_score: Star,
  points_earned: Hash,

  completion_date: CalendarCheck,
  certificate_issued: Award,

  impact: HandHeart,
  recognition: Award,

  tasks_completed: ListChecks,
  activities_completed: Activity,

  team_name: Users,

  feedback: MessageSquareMore,
};
