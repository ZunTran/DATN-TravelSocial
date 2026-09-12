export type DashboardDays = 7 | 30 | 90 | null;

export interface UserStatistics {
  total: number;
  newUsers: number;
  active: number;
  banned: number;
  locked: number;
}

export interface SessionStatistics {
  sessions: number;
  uniqueUsers: number;
  activeSessions: number;
}

export type RegistrationTrend =
  | 'UP'
  | 'DOWN'
  | 'STABLE';

export interface RegistrationGrowth {
  percentage: number;
  trend: RegistrationTrend;
}

export interface UserGrowthByDay {
  date: string | null;
  count: number;
}

export interface SessionActivityByDay {
  date: string | null;
  sessions: number;
  users: number;
}

export interface AdminUserDashboard {
  users: UserStatistics;
  sessions: SessionStatistics;
  registrationGrowth: RegistrationGrowth;
  userGrowthByDay: UserGrowthByDay[];
  sessionActivityByDay: SessionActivityByDay[];
}

export interface AdminUserDashboardQuery {
  adminUserDashboard: AdminUserDashboard;
}